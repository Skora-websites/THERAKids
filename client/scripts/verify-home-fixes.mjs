import fs from 'fs';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5174';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
let passed = 0, failed = 0;
const check = (name, cond, detail = '') => {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name} ${detail}`); }
};

const browser = await puppeteer.launch({
  executablePath: EDGE, headless: 'new',
  args: ['--no-first-run', '--disable-extensions', '--window-size=1440,1400']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1400 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await page.waitForSelector('.process-grid .process-img-wrapper', { timeout: 15000 });

/* --- 1. blog preview cards --- */
const blogCount = await page.$$eval('.blog-preview-grid .blog-preview-card', (n) => n.length);
check('home shows exactly 2 blog cards', blogCount === 2, `(got ${blogCount})`);

/* --- 2. intervention cards: count + equal dimensions --- */
const cards = await page.$$eval('.services-grid-expanded .service-gradient-card', (els) =>
  els.map((e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })
);
check('home shows exactly 8 intervention cards', cards.length === 8, `(got ${cards.length})`);
const heights = [...new Set(cards.map((c) => c.h))];
const widths = [...new Set(cards.map((c) => c.w))];
check('all intervention cards equal height', heights.length === 1, `(heights: ${heights.join(', ')})`);
check('all intervention cards equal width', widths.length === 1, `(widths: ${widths.join(', ')})`);

/* --- 3. arch hover: corners outside the arch stay background-clean --- */
const wrapper = await page.$('.process-img-wrapper');
await wrapper.evaluate((el) => el.scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 900));
const rect = await wrapper.evaluate((el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height };
});
const PAD = 30;
const clip = { x: rect.x - PAD, y: rect.y - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2 };
const tmp = os.tmpdir();

const card = await page.$('.process-grid .tilt-card');
const box = await card.boundingBox();
// hover the TOP of the card (worst case for the shoulders outside the arch)
await page.mouse.move(box.x + box.width / 2, box.y + 30);
await page.mouse.move(box.x + box.width * 0.3, box.y + 50);
await new Promise((r) => setTimeout(r, 400));
const b64 = await page.screenshot({ clip, encoding: 'base64' });
fs.writeFileSync(path.join(tmp, 'arch-fixed.png'), Buffer.from(b64, 'base64'));
fs.writeFileSync(path.join(tmp, 'arch-fixed.json'), JSON.stringify({ clip, rect }));

await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
