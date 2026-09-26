import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5174';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-first-run'] });

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? ` (${detail})` : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(path, width = 1440) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  await page.setViewport({ width, height: 900 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
  return { page, errors };
}

/* ---------- A. About: founder section top padding ---------- */
{
  const { page, errors } = await open('/about');
  const r = await page.evaluate(() => {
    const el = document.querySelector('.founder-section');
    if (!el) return null;
    const probe = document.createElement('div');
    probe.style.paddingTop = 'var(--spacing-xl)';
    document.body.appendChild(probe);
    const spacingPx = parseFloat(getComputedStyle(probe).paddingTop);
    probe.remove();
    return { spacingPx, pt: parseFloat(getComputedStyle(el).paddingTop) };
  });
  check('about: founder-section found', Boolean(r), JSON.stringify(r));
  if (r) {
    check(
      'about: top padding = spacing-xl + 70px',
      Math.abs(r.pt - (r.spacingPx + 70)) <= 2,
      `pt=${r.pt}px, spacing-xl=${r.spacingPx}px`
    );
  }
  check('about: no console/page errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------- B + C. Home: carousel behavior + hover tilt ---------- */
{
  const { page, errors } = await open('/');
  await page.waitForSelector('.testimonial-marquee-track .testimonial-slide', { timeout: 15000 });

  const slides = await page.$$eval('.testimonial-slide', (els) => els.length);
  check('home: every testimonial rendered twice', slides >= 4 && slides % 2 === 0, `${slides} slides`);
  check('home: old grid removed', (await page.$$('.testimonials-grid')).length === 0);
  check(
    'home: arrows/dots removed',
    (await page.$$('.carousel-btn')).length === 0 && (await page.$$('.carousel-dot')).length === 0
  );
  const duplicated = await page.$$eval('.testimonial-slide', (els) =>
    els.slice(els.length / 2).every((e) => e.getAttribute('aria-hidden') === 'true')
  );
  check('home: duplicate copy hidden from AT', duplicated === true);

  const anim = await page.$eval('.testimonial-marquee-track', (e) => {
    const cs = getComputedStyle(e);
    return { name: cs.animationName, dur: cs.animationDuration, iter: cs.animationIterationCount };
  });
  check(
    'home: track loops infinitely',
    anim.name === 'testimonial-marquee' && anim.iter === 'infinite',
    `${anim.name} ${anim.dur} ${anim.iter}`
  );

  // Seamless loop: the -50% shift must equal exactly one copy of the list
  const seam = await page.$eval('.testimonial-marquee-track', (e) => ({
    half: e.scrollWidth / 2,
    firstCopy: [...e.children]
      .slice(0, e.children.length / 2)
      .reduce((w, c) => w + c.getBoundingClientRect().width, 0)
  }));
  check('home: half the track = one copy', Math.abs(seam.half - seam.firstCopy) <= 2, JSON.stringify(seam));

  // The loop actually advances
  await page.$eval('.testimonial-marquee', (e) => e.scrollIntoView({ block: 'center' }));
  const shift = () =>
    page.$eval('.testimonial-marquee-track', (e) =>
      new DOMMatrixReadOnly(getComputedStyle(e).transform).m41
    );
  const startX = await shift();
  await sleep(1200);
  const laterX = await shift();
  check('home: marquee keeps moving', laterX < startX - 1, `x ${Math.round(startX)} → ${Math.round(laterX)}`);

  // Hovering the row pauses it so a review can be read
  const marqueeBox = await page.$eval('.testimonial-marquee', (e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(marqueeBox.x, marqueeBox.y);
  await sleep(250);
  const paused = await page.$eval(
    '.testimonial-marquee-track',
    (e) => getComputedStyle(e).animationPlayState
  );
  check('home: hover pauses marquee', paused === 'paused', paused);
  await page.mouse.move(0, 0);
  await sleep(250);
  const resumed = await page.$eval(
    '.testimonial-marquee-track',
    (e) => getComputedStyle(e).animationPlayState
  );
  check('home: marquee resumes on leave', resumed === 'running', resumed);

  // Cards stay next to each other (no wrap) and carry a quote mark, no photo
  const cardShape = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.testimonial-slide')].map((s) =>
      Math.round(s.getBoundingClientRect().top)
    );
    return {
      rows: new Set(rows).size,
      images: document.querySelectorAll('.testimonial-card img').length,
      avatars: document.querySelectorAll('.testimonial-avatar').length,
      quotes: document.querySelectorAll('.testimonial-quote-mark').length,
      height: Math.round(document.querySelector('.testimonial-card').getBoundingClientRect().height)
    };
  });
  check('home: slides stay on one row', cardShape.rows === 1, `rows=${cardShape.rows}`);
  check('home: every card has a quote mark', cardShape.quotes === slides, JSON.stringify(cardShape));
  check(
    'home: cards carry no parent photo',
    cardShape.images === 0 && cardShape.avatars === 0,
    JSON.stringify(cardShape)
  );

  // --- C. Hover tilt on "How we can work together" cards ---
  await page.$eval('.services-grid-expanded', (e) => e.scrollIntoView({ block: 'center' }));
  await sleep(400);
  const card = await page.$('.services-grid-expanded .tilt-card');
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.5);
  await sleep(200);
  const t1 = await card.$eval('.tilt-inner', (e) => e.style.transform);
  const s1 = await card.$eval('.tilt-shine', (e) => e.style.opacity);
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
  await sleep(200);
  const t2 = await card.$eval('.tilt-inner', (e) => e.style.transform);
  const rot = (t) => {
    const m = /rotateY\((-?[\d.]+)deg\)/.exec(t || '');
    return m ? parseFloat(m[1]) : null;
  };
  const r1 = rot(t1);
  const r2 = rot(t2);
  check(
    'home: tilt tracks pointer live (no stale transform)',
    r1 !== null && r2 !== null && r1 < r2,
    `left=${r1}deg right=${r2}deg`
  );
  check('home: shine appears on hover', s1 === '1', `opacity=${s1}`);
  await page.mouse.move(0, 0);
  await sleep(700);
  const s2 = await card.$eval('.tilt-shine', (e) => e.style.opacity);
  check('home: shine hides on leave', s2 === '0', `opacity=${s2}`);

  // Regression: previous home fixes intact
  const reg = await page.evaluate(() => ({
    svcCards: document.querySelectorAll('.services-grid-expanded .service-gradient-card').length,
    blogs: document.querySelectorAll('.blog-preview-grid .blog-preview-card').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
  check('home: 8 intervention cards', reg.svcCards === 8, `${reg.svcCards}`);
  check('home: 2 blog cards', reg.blogs === 2, `${reg.blogs}`);
  check('home: no horizontal overflow', reg.overflow <= 1, `${reg.overflow}px`);
  check('home: no console/page errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------- D + F. Services listing compact cards → detail page ---------- */
{
  const { page, errors } = await open('/services');
  await page.waitForSelector('.services-compact-card', { timeout: 15000 });
  await page.$eval('.services-compact-grid', (e) => e.scrollIntoView({ block: 'center' }));
  await sleep(600);

  const stats = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.services-compact-card')];
    return {
      count: cards.length,
      oldCards: document.querySelectorAll('.service-detail-card').length,
      hasKeyBenefits: document.body.innerText.includes('Key Benefits'),
      widths: [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().width)))],
      heights: cards.map((c) => Math.round(c.getBoundingClientRect().height)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  check('services: 9 compact cards', stats.count === 9, `${stats.count}`);
  check('services: old big cards removed', stats.oldCards === 0, `${stats.oldCards}`);
  check('services: no "Key Benefits" on listing', stats.hasKeyBenefits === false);
  check('services: equal card widths', stats.widths.length === 1, `widths=${stats.widths}`);
  const maxH = Math.max(...stats.heights);
  check('services: cards are short (< 380px)', maxH < 380, `max=${maxH}px heights=${JSON.stringify(stats.heights)}`);
  check('services: no overflow', stats.overflow <= 1, `${stats.overflow}px`);

  // Click the Special Education card → SPA navigates to its detail page
  const handles = await page.$$('.services-compact-card');
  let target = null;
  for (const h of handles) {
    const txt = await h.evaluate((e) => e.textContent);
    if (txt.includes('Special Education')) target = h;
  }
  check('services: Special Education card found', Boolean(target));
  await target.click();
  await page.waitForFunction(() => location.pathname === '/services/special-education', {
    timeout: 10000,
  });
  await page.waitForSelector('.therapy-extra', { timeout: 15000 });
  // Below-fold content is GSAP-reveal-hidden until scrolled into view — scroll first.
  await page.$eval('.therapy-intro-content', (e) => e.scrollIntoView({ block: 'center' }));
  await page.waitForFunction(
    () => {
      const el = document.querySelector('.therapy-intro-content');
      if (!el) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.9;
    },
    { timeout: 8000 }
  );

  const detail = await page.evaluate(() => {
    const kb = [...document.querySelectorAll('h4')].find((h) =>
      h.textContent.includes('Key Benefits')
    );
    const benefitCount =
      kb && kb.nextElementSibling ? kb.nextElementSibling.querySelectorAll('li').length : 0;
    return {
      path: location.pathname,
      benefitCount,
      bands: document.querySelectorAll('.therapy-extra').length,
      faqs: document.querySelectorAll('.faq-item').length,
      hasWhatWeWorkOn: document.body.textContent.includes('What We Work On'),
      hasOurApproach: document.body.textContent.includes('Our Approach'),
      introLen: document.querySelector('.therapy-intro-content')?.textContent.length || 0,
    };
  });
  check('detail: navigated to /services/special-education', detail.path === '/services/special-education', detail.path);
  check('detail: 6 key benefits in intro', detail.benefitCount === 6, `${detail.benefitCount}`);
  check('detail: 2 content bands', detail.bands === 2, `${detail.bands}`);
  check('detail: 4 FAQs', detail.faqs === 4, `${detail.faqs}`);
  check('detail: new band titles present', detail.hasWhatWeWorkOn && detail.hasOurApproach);
  check('detail: long intro rendered', detail.introLen > 600, `${detail.introLen} chars`);
  check('services→detail: no console/page errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------- G. Overflow sweep at 3 widths ---------- */
for (const w of [1440, 754, 390]) {
  for (const route of ['/', '/about', '/services', '/services/aba-therapy']) {
    const { page, errors } = await open(route, w);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    check(`overflow ${route} @${w}`, overflow <= 1, `${overflow}px`);
    if (errors.length) check(`errors ${route} @${w}`, false, errors.join(' | '));
    await page.close();
  }
}

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
