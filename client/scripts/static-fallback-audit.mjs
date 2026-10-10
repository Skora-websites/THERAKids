// Static-deploy audit: serves assumptions aside, this opens the built site with
// NO backend (VITE_API_URL unset at build time → every /api call fails) and
// asserts each public section still renders content from the fallback data.
//
//   node scripts/static-fallback-audit.mjs [baseUrl]
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4174';
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
const page = await browser.newPage();

const count = (sel) => page.$$eval(sel, (els) => els.length).catch(() => 0);
// textContent (not innerText): scroll-reveal animations park elements at
// visibility:hidden until they enter the viewport, which hides innerText.
const textLen = (sel) =>
  page.$eval(sel, (el) => (el.textContent || '').trim().length).catch(() => 0);

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const open = async (path) => {
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 30000 });
  // Scroll the whole page so every ScrollTrigger reveal has fired, then return
  // to the top — otherwise below-fold sections are legitimately still hidden.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1200));
};

// ---- Home -------------------------------------------------------------
await open('/');
check('home: testimonials', (await count('.testimonial-slide')) >= 3, `${await count('.testimonial-slide')} slides`);
check('home: FAQ list', (await count('.faq-question')) >= 3, `${await count('.faq-question')} rows`);
check('home: blog preview cards = 2', (await count('.blog-preview-card')) === 2, `${await count('.blog-preview-card')}`);
check('home: services grid', (await count('.services-grid-expanded > *')) >= 6, `${await count('.services-grid-expanded > *')} cards`);
check('home: founders', (await count('.founders-img-grid > *')) >= 1, `${await count('.founders-img-grid > *')}`);
check('home: contact/hours copy present', (await textLen('footer')) > 200, `${await textLen('footer')} chars in footer`);

// ---- About ------------------------------------------------------------
await open('/about');
check('about: team cards = 6', (await count('.team-card')) === 6, `${await count('.team-card')}`);
check('about: team cards visible', await page.$$eval('.team-card', (els) => els.every((e) => getComputedStyle(e).opacity === '1')).catch(() => false));
check('about: impact stat cards = 4', (await count('.stat-card')) === 4, `${await count('.stat-card')}`);
check('about: gallery slides', (await count('.gallery-stage-slide')) >= 5, `${await count('.gallery-stage-slide')}`);
check('about: value cards', (await count('.team-value-card')) === 4, `${await count('.team-value-card')}`);

// ---- Services / detail ------------------------------------------------
await open('/services');
check('services: cards', (await count('.services-compact-card')) >= 6, `${await count('.services-compact-card')} cards`);
await open('/services/online-therapy');
check('detail: related services band = 2', (await count('.related-service-card')) === 2, `${await count('.related-service-card')}`);
check('detail: body copy', (await textLen('.therapy-detail-page')) > 800, `${await textLen('.therapy-detail-page')} chars`);

// ---- Conditions -------------------------------------------------------
await open('/conditions');
check('conditions: cards', (await count('.service-detail-card')) >= 4, `${await count('.service-detail-card')} cards`);

// ---- Blogs + detail ---------------------------------------------------
await open('/blogs');
check('blogs: exactly 2 cards', (await count('.blog-card-image')) === 2, `${await count('.blog-card-image')}`);
await open('/blogs/speech-milestones-toddlers');
check('blog detail: article renders', (await textLen('.blog-body')) > 500, `${await textLen('.blog-body')} chars`);
await open('/blogs/understanding-sensory-processing');
check('blog detail #2 renders', (await textLen('.blog-body')) > 500, `${await textLen('.blog-body')} chars`);
check('blogs: removed posts are not found', await (async () => {
  await page.goto(BASE + '/blogs/benefits-of-speech-therapy-for-kids', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));
  const t = await page.evaluate(() => document.body.innerText);
  return /Post not found|Something went wrong/.test(t);
})());

// ---- Contact ----------------------------------------------------------
await open('/contact');
const contactText = await page.evaluate(() => document.body.innerText);
check('contact: hours fallback', contactText.includes('Mon-Fri'), 'opening hours shown');
check('contact: both centres', contactText.includes('Noida') && contactText.includes('Gr. Noida') || contactText.includes('Greater Noida'));

console.log(`\n${failed === 0 ? 'ALL SECTIONS RENDER WITHOUT AN API' : `${failed} FAILING SECTION(S)`}`);
await browser.close();
process.exit(failed === 0 ? 0 : 1);
