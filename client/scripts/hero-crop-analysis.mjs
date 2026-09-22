// Therapy hero crop analysis at phone width.
// For each therapy page: screenshots the hero (saved for visual review) and
// computes which slice of the source photo is actually visible (object-fit:cover
// math), then runs a crude skin-tone detector over that slice to estimate where
// the subject mass sits — catching crops that behead subjects or push them off-frame.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:5173';
const OUT_DIR = path.resolve(process.cwd(), 'scripts/hero-shots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  ['Speech', '/services/speech-therapy'],
  ['Occupational', '/services/occupational-therapy'],
  ['Physical', '/services/physical-therapy'],
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions'],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

for (const [name, pathName] of PAGES) {
  await page.goto(BASE + pathName, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  const heroEl = await page.$('.page-hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(OUT_DIR, `${name.toLowerCase()}-390.png`) });
  }

  const analysis = await page.evaluate(() => {
    const img = document.querySelector('.page-hero-visual img');
    if (!img) return { error: 'no hero img' };
    const box = img.getBoundingClientRect();
    const natW = img.naturalWidth, natH = img.naturalHeight;
    const pos = getComputedStyle(img).objectPosition || '50% 50%';
    const [px, py] = pos.split(' ').map((s) => parseFloat(s) / 100);

    // object-fit: cover crop math
    const scale = Math.max(box.width / natW, box.height / natH);
    const drawnW = natW * scale, drawnH = natH * scale;
    const sx = ((drawnW - box.width) * px) / scale;
    const sy = ((drawnH - box.height) * py) / scale;
    const sw = box.width / scale, sh = box.height / scale;

    // Sample the crop window, classify skin-tone pixels, aggregate by thirds
    const G = 48;
    const canvas = document.createElement('canvas');
    canvas.width = G; canvas.height = G;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, G, G);
    const data = ctx.getImageData(0, 0, G, G).data;
    const rows = [0, 0, 0], cols = [0, 0, 0];
    let skin = 0, total = 0;
    for (let y = 0; y < G; y++) {
      for (let x = 0; x < G; x++) {
        const i = (y * G + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const isSkin = r > 95 && g > 40 && b > 20 && r > g && g > b &&
                       mx - mn > 15 && Math.abs(r - g) > 12 && r < 250;
        total++;
        if (isSkin) {
          skin++;
          rows[Math.min(2, Math.floor((y / G) * 3))]++;
          cols[Math.min(2, Math.floor((x / G) * 3))]++;
        }
      }
    }
    const pct = (n) => Math.round((n / Math.max(1, skin)) * 100);
    return {
      image: img.src.split('/').pop(),
      objectPosition: pos,
      natural: `${natW}x${natH}`,
      visibleSlice: `${Math.round(sw)}x${Math.round(sh)} of ${natW}x${natH}`,
      verticalMass: `top ${pct(rows[0])}% / mid ${pct(rows[1])}% / bottom ${pct(rows[2])}%`,
      horizontalMass: `left ${pct(cols[0])}% / mid ${pct(cols[1])}% / right ${pct(cols[2])}%`,
      skinCoverage: Math.round((skin / total) * 100) + '%',
    };
  });

  console.log(`\n=== ${name} (${pathName})`);
  if (analysis.error) { console.log('  ' + analysis.error); continue; }
  console.log(`  image: ${analysis.image} (${analysis.natural}), object-position: ${analysis.objectPosition}`);
  console.log(`  visible slice: ${analysis.visibleSlice}`);
  console.log(`  subject mass — V: ${analysis.verticalMass} | H: ${analysis.horizontalMass}`);
  console.log(`  skin coverage of frame: ${analysis.skinCoverage}`);
  // crude verdicts
  const v = analysis.verticalMass.match(/\d+/g).map(Number);
  const h = analysis.horizontalMass.match(/\d+/g).map(Number);
  const flags = [];
  if (v[0] >= 60) flags.push('subject mass near TOP — head may be tight against frame top');
  if (v[2] >= 60) flags.push('subject mass at BOTTOM — top of frame may be empty/subject cropped low');
  if (h[0] >= 60) flags.push('subject pushed LEFT');
  if (h[2] >= 60) flags.push('subject pushed RIGHT');
  if (analysis.skinCoverage.startsWith('0') || analysis.skinCoverage === '1%') flags.push('little/no skin tone detected — crop may be mostly background');
  console.log(flags.length ? '  ⚠ ' + flags.join('; ') : '  ✓ framing looks balanced');
}

await browser.close();
console.log(`\nScreenshots saved to client/scripts/hero-shots/ for visual review.`);
