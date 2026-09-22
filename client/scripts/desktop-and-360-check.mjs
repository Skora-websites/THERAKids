// Desktop regression + small-phone (360px) sweep after tap-target fixes.
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions'],
});

// 1. Desktop: footer links should stay compact, nothing should overlap
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
const desktop = await page.evaluate(() => {
  const link = document.querySelector('.footer-links a');
  const nav = document.querySelector('.nav-links');
  const navVisible = nav && getComputedStyle(nav).visibility !== 'hidden' && nav.offsetHeight > 0;
  return {
    footerLinkHeight: link ? Math.round(link.getBoundingClientRect().height) : -1,
    desktopNavVisible: navVisible,
    hOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hamburgerHidden: (() => {
      const h = document.querySelector('.hamburger');
      return h ? getComputedStyle(h).display === 'none' : true;
    })(),
  };
});
console.log('Desktop 1440px:', JSON.stringify(desktop));

// 2. Small phone 360px: overflow + theme switcher size on every page
const small = await browser.newPage();
await small.setViewport({ width: 360, height: 780, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const paths = ['/', '/about', '/services', '/conditions', '/gallery', '/blogs', '/contact', '/services/speech-therapy', '/admin'];
let allClean = true;
for (const p of paths) {
  await small.goto('http://localhost:5173' + p, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const over = await small.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const swatch = await small.evaluate(() => {
    const b = document.querySelector('.theme-switcher-btn');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  });
  if (over > 1) { allClean = false; console.log(`✗ 360px ${p}: overflow ${over}px`); }
  else console.log(`✓ 360px ${p} (swatch ${swatch || 'n/a'})`);
}
console.log(allClean ? '\n360px sweep: ALL CLEAN' : '\n360px sweep: ISSUES FOUND');

await browser.close();
