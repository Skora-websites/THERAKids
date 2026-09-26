import puppeteer from 'puppeteer-core';
const BASE = process.argv[2];
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-first-run'] });
let bad = 0;
for (const w of [1440, 754, 390]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.services-grid-expanded', { timeout: 15000 });
  const r = await page.evaluate(() => {
    const doc = document.documentElement;
    const svc = [...document.querySelectorAll('.services-grid-expanded .service-gradient-card')];
    const hs = [...new Set(svc.map(e => Math.round(e.getBoundingClientRect().height)))];
    const blogs = document.querySelectorAll('.blog-preview-grid .blog-preview-card').length;
    const win = document.querySelector('.process-arch-window');
    return { overflow: doc.scrollWidth - doc.clientWidth, svcCount: svc.length, heights: hs, blogs,
             archClip: win ? getComputedStyle(win).overflow : 'missing' };
  });
  const ok = r.overflow <= 1 && r.svcCount === 8 && r.heights.length === 1 && r.blogs === 2 && r.archClip === 'hidden';
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} @${w}px — overflow:${r.overflow} cards:${r.svcCount} heights:[${r.heights}] blogs:${r.blogs} archClip:${r.archClip}`);
  await page.close();
}
await browser.close();
process.exitCode = bad ? 1 : 0;
