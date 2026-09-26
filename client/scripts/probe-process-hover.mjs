import fs from 'fs';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5174';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions', '--window-size=1440,1400']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1400 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await page.waitForSelector('.process-grid .process-img-wrapper', { timeout: 15000 });

const wrapper = await page.$('.process-img-wrapper');
await wrapper.evaluate((el) => el.scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 900)); // scroll-reveal settles

const rect = await wrapper.evaluate((el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height };
});

const PAD = 30;
const clip = {
  x: Math.max(0, rect.x - PAD),
  y: Math.max(0, rect.y - PAD),
  width: rect.w + PAD * 2,
  height: rect.h + PAD * 2
};

const tmp = os.tmpdir();
const save = async (name) => {
  const b64 = await page.screenshot({ clip, encoding: 'base64' });
  fs.writeFileSync(path.join(tmp, name), Buffer.from(b64, 'base64'));
};

await save('proc-rest.png');

const card = await page.$('.process-grid .tilt-card');
const box = await card.boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height * 0.3;
await page.mouse.move(cx, cy);
await page.mouse.move(cx + 30, cy + 15);
await new Promise((r) => setTimeout(r, 350));
await save('proc-hover.png');

// Second pass: shine disabled, to separate "shine rectangle" from "image clip"
await page.evaluate(() => {
  document.querySelectorAll('.tilt-shine').forEach((s) => { s.style.display = 'none'; });
});
await page.mouse.move(cx + 10, cy + 40);
await page.mouse.move(cx - 25, cy + 10);
await new Promise((r) => setTimeout(r, 350));
await save('proc-hover-noshine.png');

const imgStyle = await wrapper.evaluate((el) => {
  const img = el.querySelector('img');
  const cs = getComputedStyle(img);
  return { borderRadius: cs.borderRadius, transform: cs.transform, overflow: getComputedStyle(el).overflow };
});

// Points in PAGE coordinates (screenshot clip space = page coords)
const meta = {
  clip,
  imgStyle,
  rect,
  points: {
    cornerA: { x: rect.x + 4, y: rect.y + 4 },                       // outside arch curve, top-left
    cornerB: { x: rect.x + rect.w - 10, y: rect.y + 4 },             // outside arch curve, top-right
    inner: { x: rect.x + rect.w / 2, y: rect.y + 70 },               // inside the arch (photo)
    bg: { x: 8, y: rect.y + rect.h / 2 }                             // page/section background
  }
};
fs.writeFileSync(path.join(tmp, 'proc-meta.json'), JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta, null, 2));

// Pass 3: cursor near the TOP of the card (users hover the image itself)
const topProbe = async () => {
  const c = await page.$('.process-grid .tilt-card');
  const b = await c.boundingBox();
  await page.evaluate(() => {
    document.querySelectorAll('.tilt-shine').forEach((s) => { s.style.display = ''; });
  });
  await page.mouse.move(b.x + b.width / 2, b.y + 30);
  await page.mouse.move(b.x + b.width * 0.3, b.y + 50);
  await new Promise((r) => setTimeout(r, 350));
  await save('proc-hover-top.png');
};
await topProbe();
console.log('wrote proc-hover-top.png');
await browser.close();
