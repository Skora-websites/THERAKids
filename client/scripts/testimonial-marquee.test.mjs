// Testimonial marquee — seam + pace regression suite (headless Edge via puppeteer-core).
//
//   node scripts/testimonial-marquee.test.mjs [baseUrl]
//   node scripts/testimonial-marquee.test.mjs --update        # rewrite the snapshot
//
// A. SEAM   — the -50% keyframe must cover exactly one copy of the list: uniform
//             slide widths, no flex gap, track width = 2 x copy, and the gap at the
//             seam identical to the spacing between cards inside a copy. Also reads
//             the live @keyframes rule, so editing the -50% (or adding a gap that
//             breaks it) fails here instead of silently showing a jump.
// B. MOTION — linear, monotonic, right→left, and a steady px/s across samples; an
//             eased or restarted animation would wobble here.
// C. PACE   — px/s and seconds-per-card compared against testimonial-marquee.snapshot.json,
//             so an accidental speed change (or a breakpoint falling back to desktop
//             values) fails loudly.
// D. TOUCH  — tapping a card on a phone must not freeze the loop, and reduced motion
//             must fall back to a plain swipeable scroller.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.join(HERE, 'testimonial-marquee.snapshot.json');
const args = process.argv.slice(2);
const UPDATE = args.includes('--update');
const BASE = args.find((a) => !a.startsWith('--')) || process.env.BASE_URL || 'http://localhost:5173';
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const VIEWPORTS = [
  { label: '1440', width: 1440, height: 900, touch: false, tolerate: 0.02 },
  { label: '754', width: 754, height: 900, touch: false, tolerate: 0.02 }, // tablet: still desktop pacing
  { label: '390', width: 390, height: 844, touch: true, tolerate: 0.03 } // phone: slower, 13s per card
];

/* ------------------------------ tiny harness ------------------------------ */
const sections = [];
let current = null;
let passed = 0;
let failed = 0;

const section = (name) => { current = { name, passed: 0, failed: 0 }; sections.push(current); };
const check = async (name, fn) => {
  try {
    await fn();
    passed++; current.passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failed++; current.failed++;
    console.log(`  FAIL  ${name} — ${err.message}`);
  }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Chrome normalises translate3d(0, 0, 0) to "translate3d(0px, 0px, 0px)", so read
// the value and its unit separately rather than expecting a percentage.
const translateX = (transform) => {
  const m = /translate3d\(\s*(-?[\d.]+)(px|%)?/.exec(transform || '');
  if (!m) return null;
  return { value: parseFloat(m[1]), unit: m[2] === '%' ? '%' : 'px' };
};

/* ------------------------------- page probes ------------------------------ */
const trackX = (page) =>
  page.evaluate(() =>
    new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.testimonial-marquee-track')).transform).m41
  );

const readSeam = (page) =>
  page.evaluate(() => {
    const mq = document.querySelector('.testimonial-marquee');
    const track = document.querySelector('.testimonial-marquee-track');
    const slides = [...track.children];
    const rects = slides.map((s) => s.getBoundingClientRect());
    const half = slides.length / 2;
    const widths = rects.map((r) => r.width);
    return {
      slides: slides.length,
      copyCount: track.scrollWidth / 2,
      copyWidth: rects.slice(0, half).reduce((w, r) => w + r.width, 0),
      widthSpread: Math.max(...widths) - Math.min(...widths),
      internalGap: rects[1].left - rects[0].left,
      seamGap: rects[half].left - rects[half - 1].left,
      columnGap: getComputedStyle(track).columnGap,
      cardPadding: [...new Set(slides.map((s) => getComputedStyle(s).paddingRight))],
      trackWidth: track.getBoundingClientRect().width,
      marqueeWidth: mq.clientWidth,
      card: rects[0].width - parseFloat(getComputedStyle(slides[0]).paddingRight),
      visibleCards: +(mq.clientWidth / rects[0].width).toFixed(2)
    };
  });

const readAnimation = (page) =>
  page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.testimonial-marquee-track'));
    let keyframes = null;
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; } // cross-origin sheet
      for (const rule of rules) {
        if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'testimonial-marquee') {
          keyframes = [...rule.cssRules].map((k) => ({ key: k.keyText, transform: k.style.transform }));
        }
      }
    }
    return {
      name: cs.animationName,
      duration: parseFloat(cs.animationDuration),
      timing: cs.animationTimingFunction,
      iterations: cs.animationIterationCount,
      playState: cs.animationPlayState,
      keyframes
    };
  });

const open = async (browser, vp) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width, height: vp.height, isMobile: vp.touch, hasTouch: vp.touch, deviceScaleFactor: 1
  });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('.testimonial-marquee-track .testimonial-slide', { timeout: 15000 });
  await page.$eval('.testimonial-marquee', (e) => e.scrollIntoView({ block: 'center' }));
  await sleep(300);
  return page;
};

/* ---------------------------------- run ---------------------------------- */
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions']
});

const snapshots = {};
let snapshot = {};
if (!UPDATE && fs.existsSync(SNAPSHOT_PATH)) snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

for (const vp of VIEWPORTS) {
  console.log(`\n--- viewport ${vp.label} (touch=${vp.touch}) ---`);
  const page = await open(browser, vp);
  const seam = await readSeam(page);
  const anim = await readAnimation(page);

  /* ================================ A. SEAM ================================ */
  section(`A. SEAM @${vp.label}`);

  await check('list is rendered exactly twice (even slide count)', () => {
    assert(seam.slides >= 2 && seam.slides % 2 === 0, `${seam.slides} slides`);
  });

  await check('all slides are the same width', () => {
    assert(seam.widthSpread <= 0.5, `width spread ${seam.widthSpread.toFixed(2)}px across ${seam.slides} slides`);
  });

  await check('flex container adds no gap (it would break the -50% math)', () => {
    assert(
      seam.columnGap === 'normal' || parseFloat(seam.columnGap) === 0,
      `column-gap = ${seam.columnGap}`
    );
    assert(seam.cardPadding.length === 1, `slides use ${seam.cardPadding.length} different paddings`);
  });

  await check('scrollWidth / 2 equals one copy of the list', () => {
    assert(
      Math.abs(seam.copyCount - seam.copyWidth) <= 0.5,
      `scrollWidth/2 = ${seam.copyCount.toFixed(2)} but one copy measures ${seam.copyWidth.toFixed(2)}`
    );
  });

  await check('seam gap == spacing between cards inside a copy', () => {
    assert(
      Math.abs(seam.seamGap - seam.internalGap) <= 0.5,
      `seam ${seam.seamGap.toFixed(2)}px vs internal ${seam.internalGap.toFixed(2)}px`
    );
  });

  await check('@keyframes runs from 0 to exactly -50% of the track', () => {
    assert(Array.isArray(anim.keyframes) && anim.keyframes.length > 0, 'testimonial-marquee @keyframes not found');
    const start = translateX((anim.keyframes.find((k) => k.key === '0%') || anim.keyframes[0]).transform);
    const end = translateX((anim.keyframes.find((k) => k.key === '100%') || anim.keyframes[anim.keyframes.length - 1]).transform);
    assert(start && start.value === 0, `start keyframe shifts ${start ? start.value + start.unit : 'nothing'}, must be 0`);
    assert(end, 'end keyframe has no translate3d');
    assert(end.unit === '%', `end keyframe must be a percentage (got ${end.value}${end.unit}) or the loop drifts with content`);
    assert(Math.abs(end.value + 50) <= 0.01, `end keyframe shifts ${end.value}%, must be -50%`);
  });

  const cycleDistance = seam.trackWidth / 2;
  await check('one cycle travels exactly the width of one copy', () => {
    assert(
      Math.abs(cycleDistance - seam.copyWidth) <= 0.5,
      `cycle ${cycleDistance.toFixed(2)}px vs copy ${seam.copyWidth.toFixed(2)}px`
    );
  });

  /* =============================== B. MOTION =============================== */
  section(`B. MOTION @${vp.label}`);

  await check('animation is infinite, linear and running', () => {
    assert(anim.name === 'testimonial-marquee', `animation-name = ${anim.name}`);
    assert(anim.iterations === 'infinite', `iteration-count = ${anim.iterations}`);
    assert(anim.timing === 'linear', `timing-function = ${anim.timing}`);
    assert(anim.playState === 'running', `play-state = ${anim.playState}`);
  });

  const samples = [];
  for (let i = 0; i < 7; i++) {
    samples.push({ t: Date.now(), x: await trackX(page) });
    await sleep(400);
  }
  const deltas = samples.slice(1).map((s, i) => ({
    dt: (s.t - samples[i].t) / 1000,
    dx: s.x - samples[i].x
  }));
  const speeds = deltas.map((d) => -d.dx / d.dt); // cards travel right→left, so x decreases
  const meanSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const spread = (Math.max(...speeds) - Math.min(...speeds)) / Math.abs(meanSpeed);

  await check('cards travel right→left, never backwards', () => {
    assert(deltas.every((d) => d.dx < 0), `deltas: ${deltas.map((d) => d.dx.toFixed(1)).join(', ')}`);
  });

  await check('speed is steady across the loop (no hitch at the seam)', () => {
    assert(spread <= 0.25, `speed varied ${(spread * 100).toFixed(1)}% around ${meanSpeed.toFixed(1)}px/s`);
  });

  /* ================================ C. PACE ================================ */
  section(`C. PACE @${vp.label}`);

  // Only count-independent values belong in the snapshot: copyWidth and the cycle
  // duration both grow when an admin adds a testimonial, and that must not fail.
  const measured = {
    cardWidth: +seam.card.toFixed(1),
    visibleCards: seam.visibleCards,
    pxPerSecond: +meanSpeed.toFixed(1),
    secondsPerCard: +(seam.card / meanSpeed).toFixed(1),
    direction: 'right→left'
  };
  snapshots[vp.label] = {
    ...measured,
    copyWidth: +seam.copyWidth.toFixed(1), // recorded for reference only
    durationSeconds: +anim.duration.toFixed(1),
    cards: seam.slides / 2
  };

  await check('pace matches the committed snapshot', () => {
    if (UPDATE || !snapshot[vp.label]) return; // first run / explicit refresh records it
    const want = snapshot[vp.label];
    const within = (key, tolerance) => {
      const expected = want[key];
      assert(expected !== undefined, `snapshot is missing "${key}" for ${vp.label} — re-run with --update`);
      const drift = Math.abs(measured[key] - expected) / Math.abs(expected || 1);
      assert(
        drift <= tolerance,
        `${key}: ${measured[key]} vs snapshot ${expected} (${(drift * 100).toFixed(1)}% off)`
      );
    };
    within('cardWidth', vp.tolerate);
    within('pxPerSecond', 0.15);
    within('secondsPerCard', 0.15);
    assert(measured.visibleCards === want.visibleCards, `visibleCards: ${measured.visibleCards} vs ${want.visibleCards}`);
    assert(measured.direction === want.direction, `direction: ${measured.direction} vs ${want.direction}`);
  });

  await check('cycle = card count x the per-card time token', async () => {
    const perCard = await page.evaluate(() =>
      parseFloat(
        getComputedStyle(document.querySelector('.testimonial-marquee-track')).getPropertyValue(
          '--marquee-card-seconds'
        )
      )
    );
    const cards = seam.slides / 2;
    assert(perCard > 0, `--marquee-card-seconds resolved to "${perCard}"`);
    assert(
      Math.abs(anim.duration - cards * perCard) <= 0.2,
      `duration ${anim.duration}s != ${cards} cards x ${perCard}s (does the inline --marquee-cards still reach the CSS?)`
    );
  });

  await check('phone pace is slower than desktop, and readable', () => {
    if (vp.touch) {
      assert(measured.secondsPerCard >= 10, `only ${measured.secondsPerCard}s per card on a phone`);
      assert(measured.visibleCards < 2, `${measured.visibleCards} cards visible — expected the mobile layout`);
    } else {
      assert(measured.secondsPerCard <= 10, `${measured.secondsPerCard}s per card on desktop is sluggish`);
    }
  });

  /* =============================== D. TOUCH =============================== */
  if (vp.touch) {
    section(`D. TOUCH @${vp.label}`);

    await check('tapping a card does not freeze the loop', async () => {
      await page.touchscreen.tap(Math.round(vp.width / 2), Math.round(vp.height / 2));
      await sleep(300);
      const state = await readAnimation(page);
      assert(state.playState === 'running', `play-state after tap = ${state.playState}`);
      const before = await trackX(page);
      await sleep(1200);
      const after = await trackX(page);
      assert(Math.abs(after - before) > 5, `loop stalled after a tap (moved ${(after - before).toFixed(1)}px)`);
    });

    await check('reduced motion: no autoplay, row becomes a scroller', async () => {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await sleep(200);
      const state = await page.evaluate(() => {
        const mq = document.querySelector('.testimonial-marquee');
        const track = document.querySelector('.testimonial-marquee-track');
        return {
          animation: getComputedStyle(track).animationName,
          overflowX: getComputedStyle(mq).overflowX,
          scrollable: mq.scrollWidth > mq.clientWidth
        };
      });
      assert(state.animation === 'none', `animation still ${state.animation}`);
      assert(state.overflowX === 'auto', `overflow-x = ${state.overflowX}`);
      assert(state.scrollable, 'the row is not scrollable under reduced motion');
    });
  }

  await page.close();
}

/* ------------------------------- snapshot IO ------------------------------ */
await browser.close();

if (UPDATE) {
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshots, null, 2)}\n`);
  console.log(`\nsnapshot written: ${path.relative(process.cwd(), SNAPSHOT_PATH)}`);
} else if (!Object.keys(snapshot).length) {
  console.log('\nno snapshot found — run once with --update to record the current pace');
}

console.log('\n================ RESULTS ================');
for (const s of sections) {
  console.log(`${s.name.padEnd(24)} ${s.passed} passed${s.failed ? `, ${s.failed} FAILED` : ''}`);
}
console.log(`\nTOTAL: ${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
