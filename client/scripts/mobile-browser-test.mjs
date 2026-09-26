// Real-browser mobile test: loads every page in headless Edge at phone size,
// checks for horizontal overflow, console errors, failed requests, and broken
// layout on each page. Reports anything that "looks off".
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:5173';

const PAGES = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Conditions', '/conditions'],
  ['Gallery', '/gallery'],
  ['Blogs', '/blogs'],
  ['BlogPost', '/blogs/speech-milestones-toddlers'],
  ['Contact', '/contact'],
  ['ServiceDetail (speech)', '/services/speech-therapy'],
  ['ServiceDetail (pre-vocational)', '/services/pre-vocational-training'],
  ['AdminLogin', '/admin'],
];

// iPhone 12/13/14-ish viewport
const VP = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions'],
});

const page = await browser.newPage();
await page.setViewport(VP);

const problems = [];
const consoleErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 160));
});
page.on('requestfailed', (req) => {
  const failure = req.failure()?.errorText || '';
  if (!failure.includes('ERR_ABORTED')) {
    problems.push(`[req failed] ${req.url().slice(0, 100)} — ${failure}`);
  }
});
page.on('response', (res) => {
  if (res.status() >= 400) problems.push(`[HTTP ${res.status()}] ${res.url().slice(0, 100)}`);
});

for (const [name, path] of PAGES) {
  consoleErrors.length = 0;
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200)); // let GSAP reveals settle

    const audit = await page.evaluate(() => {
      const doc = document.documentElement;
      const vw = doc.clientWidth;
      const result = {
        scrollWidth: doc.scrollWidth,
        horizontalOverflow: doc.scrollWidth - vw,
        overflowers: [],
      };
      if (result.horizontalOverflow > 1) {
        // find elements wider than the viewport
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width > vw + 1 || r.right > vw + 8) {
            const cls = (el.className && typeof el.className === 'string') ? el.className.split(' ')[0] : el.tagName;
            result.overflowers.push(`${el.tagName.toLowerCase()}.${cls} w=${Math.round(r.width)} right=${Math.round(r.right)}`);
            if (result.overflowers.length >= 5) break;
          }
        }
      }
      // invisible-in-viewport content: elements at the top of the page stuck at opacity 0
      const hidden = [];
      for (const el of document.querySelectorAll('section h1, section h2, section p')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.top >= 0 && r.top < window.innerHeight && cs.visibility === 'hidden') {
          hidden.push(el.textContent.trim().slice(0, 40));
          if (hidden.length >= 3) break;
        }
      }
      result.stuckHidden = hidden;
      return result;
    });

    const issues = [];
    if (audit.horizontalOverflow > 1) {
      issues.push(`H-OVERFLOW ${audit.horizontalOverflow}px: ${audit.overflowers.join(' | ')}`);
    }
    if (audit.stuckHidden.length) issues.push(`STUCK HIDDEN: ${audit.stuckHidden.join(' ; ')}`);
    if (consoleErrors.length) issues.push(`CONSOLE: ${consoleErrors.slice(0, 2).join(' ; ')}`);

    if (issues.length) {
      console.log(`✗ ${name}`);
      issues.forEach((i) => console.log(`    ${i}`));
    } else {
      console.log(`✓ ${name} (scrollW=${audit.scrollWidth}, vw=390)`);
    }
  } catch (e) {
    console.log(`✗ ${name} — FAILED: ${e.message.slice(0, 120)}`);
  }
}

// Extra: tap-target size sanity on Home (buttons/links < 40px are hard to tap)
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
const tinyTargets = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('a, button')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32)) {
      const ctx = el.closest('footer, nav, section, .hero-note-card, .home-hero')?.className || '';
      out.push(`'${el.textContent.trim().slice(0, 22)}' in [${String(ctx).split(' ').slice(0, 2).join('.')}] ${Math.round(r.width)}x${Math.round(r.height)}`);
      if (out.length >= 6) break;
    }
  }
  return out;
});
console.log(tinyTargets.length ? `\nTiny tap targets on Home:\n  ${tinyTargets.join('\n  ')}` : '\nTap targets on Home: OK');

await browser.close();
console.log('\nMobile browser test complete.');
