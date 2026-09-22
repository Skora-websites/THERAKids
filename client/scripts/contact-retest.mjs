// Focused retest: (1) Contact stuck-hidden after full watchdog window,
// (2) real tap-target sizes inside the OPEN mobile nav menu.
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions'],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

// 1. Contact with a full 4s settle (watchdog fires at 2.5s)
await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 4000));
const contact = await page.evaluate(() => {
  const hidden = [];
  for (const el of document.querySelectorAll('section h1, section h2, section p, h1, h2')) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.top >= 0 && r.top < window.innerHeight && (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05)) {
      hidden.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}" op=${cs.opacity} vis=${cs.visibility}`);
    }
  }
  return hidden;
});
console.log(contact.length ? `Contact STILL hidden after 4s:\n  ${contact.join('\n  ')}` : 'Contact: all content revealed after 4s ✓');

// 2. Open the hamburger menu, measure real link boxes
const hamburger = await page.$('.hamburger');
if (hamburger) {
  await hamburger.click();
  await new Promise((r) => setTimeout(r, 800));
  const sizes = await page.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('.nav-links.open a')) {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      if (cs.visibility !== 'hidden' && r.height > 0) {
        out.push(`"${a.textContent.trim().slice(0, 16)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return out;
  });
  console.log('\nMobile menu (open) link sizes:');
  console.log(sizes.length ? '  ' + sizes.join('\n  ') : '  (no visible links found)');
} else {
  console.log('\nNo .hamburger found at 390px');
}

await browser.close();
