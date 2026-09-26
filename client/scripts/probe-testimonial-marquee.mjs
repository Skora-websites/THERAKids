// One-off probe: how does the testimonial marquee actually behave at 390px vs 1440px?
// Usage: node scripts/probe-testimonial-marquee.mjs [baseUrl]
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5173';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-first-run'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(label, width, height, touch) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('.testimonial-marquee-track .testimonial-slide');
  await page.$eval('.testimonial-marquee', (e) => e.scrollIntoView({ block: 'center' }));
  await sleep(300);

  const geom = await page.evaluate(() => {
    const marquee = document.querySelector('.testimonial-marquee');
    const track = document.querySelector('.testimonial-marquee-track');
    const slides = [...document.querySelectorAll('.testimonial-slide')];
    const cs = getComputedStyle(track);
    const mcs = getComputedStyle(marquee);
    return {
      card: Math.round(slides[0].getBoundingClientRect().width),
      copyWidth: Math.round(track.scrollWidth / 2),
      slides: slides.length,
      visibleCards: +(marquee.clientWidth / slides[0].getBoundingClientRect().width).toFixed(2),
      duration: cs.animationDuration,
      direction: cs.animationDirection,
      mask: mcs.maskImage === 'none' ? 'none' : 'faded',
      reduce: matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  });

  const pos = () =>
    page.evaluate(() => {
      const m = new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.testimonial-marquee-track')).transform);
      return m.m41;
    });

  const a = await pos();
  await sleep(2000);
  const b = await pos();
  // The track's translateX is negative and decreasing: cards travel right→left.
  const pxPerSec = Math.abs((b - a) / 2);
  const travel = b <= a ? 'right→left' : 'left→right';

  // Touch/hover pause: tap the middle of the row, then see if the loop stayed frozen.
  if (touch) {
    await page.touchscreen.tap(width / 2, Math.round(height * 0.5));
    await sleep(400);
  } else {
    await page.mouse.move(width / 2, Math.round(height * 0.5));
    await sleep(400);
  }
  const afterInteract = await pos();
  await sleep(1500);
  const afterWait = await pos();
  const frozen = Math.abs(afterWait - afterInteract) < 1;
  const playState = await page.$eval(
    '.testimonial-marquee-track',
    (e) => getComputedStyle(e).animationPlayState
  );

  console.log(
    `\n[${label}] ${width}x${height} touch=${touch}\n` +
      `  card=${geom.card}px  copy=${geom.copyWidth}px  slides=${geom.slides}  visible≈${geom.visibleCards} cards\n` +
      `  duration=${geom.duration}  direction=${geom.direction}  mask=${geom.mask}\n` +
      `  speed=${pxPerSec.toFixed(1)}px/s  travel=${travel}  seconds-per-card=${(geom.card / pxPerSec).toFixed(1)}s\n` +
      `  after tap/hover: ${frozen ? 'FROZEN' : 'still moving'}  animationPlayState=${playState}`
  );
  await page.close();
}

await probe('desktop', 1440, 900, false);
await probe('mobile', 390, 844, true);
await browser.close();
