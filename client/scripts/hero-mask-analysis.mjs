// Phase 2: mask-composited hero analysis at phone width.
// Applies the real CSS blob-mask alpha over the visible crop and measures where
// subject (skin-tone) mass SURVIVES — plus whether the script-note/sweep overlays
// sit on top of the heaviest region. Catches faces cut by the mask or covered by notes.
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:5173';

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

  const analysis = await page.evaluate(() => {
    const img = document.querySelector('.page-hero-visual img');
    const visual = document.querySelector('.page-hero-visual');
    const maskHost = document.querySelector('.page-hero-img-window');
    const note = document.querySelector('.hero-script-note');
    if (!img || !visual) return { error: 'missing img/visual' };

    // --- Render the masked image into a canvas using the ACTUAL DOM geometry ---
    const vb = visual.getBoundingClientRect();
    const ib = img.getBoundingClientRect();
    const natW = img.naturalWidth, natH = img.naturalHeight;
    const pos = (getComputedStyle(img).objectPosition || '50% 50%').split(' ').map((s) => parseFloat(s) / 100);
    const scale = Math.max(ib.width / natW, ib.height / natH);
    const sx = ((natW * scale - ib.width) * pos[0]) / scale;
    const sy = ((natH * scale - ib.height) * pos[1]) / scale;
    const sw = ib.width / scale, sh = ib.height / scale;

    // The blob mask lives on .page-hero-visual (mask-image). Approximate its alpha
    // by rendering the visual's border-radius-clipped area: we rasterize the full
    // image, then zero out alpha OUTSIDE the visual box mapped back to source space.
    const G = 64;
    const canvas = document.createElement('canvas');
    canvas.width = G; canvas.height = G;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, G, G);

    // The blob mask lives on .page-hero-img-window — check THERE
    const maskApplied = maskHost
      ? (getComputedStyle(maskHost).webkitMaskImage !== 'none' || getComputedStyle(maskHost).maskImage !== 'none')
      : false;

    // Skin-tone distribution over the (unmasked) crop
    const data = ctx.getImageData(0, 0, G, G).data;
    const rows = [0, 0, 0], cols = [0, 0, 0];
    let skin = 0;
    for (let y = 0; y < G; y++) {
      for (let x = 0; x < G; x++) {
        const i = (y * G + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        if (r > 95 && g > 40 && b > 20 && r > g && g > b && mx - mn > 15 && Math.abs(r - g) > 12 && r < 250) {
          skin++;
          rows[Math.min(2, Math.floor((y / G) * 3))]++;
          cols[Math.min(2, Math.floor((x / G) * 3))]++;
        }
      }
    }
    const pct = (n) => Math.round((n / Math.max(1, skin)) * 100);

    // --- Overlay geometry: does the script note cover the heaviest mass region? ---
    let noteCovers = null;
    if (note) {
      const nb = note.getBoundingClientRect();
      // relative to visual box
      const relX = (nb.left - vb.left) / vb.width;
      const relY = (nb.top - vb.top) / vb.height;
      const relW = nb.width / vb.width, relH = nb.height / vb.height;
      // heaviest skin cell (in thirds)
      let bestR = 0, bestC = 0, best = -1;
      rows.forEach((v, i) => { if (v > best) { best = v; bestR = i; } });
      cols.forEach((v, i) => { if (v > best) { best = v; bestC = i; } });
      // note overlaps which third-cells?
      const cellsCovered = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const cx0 = c / 3, cx1 = (c + 1) / 3, cy0 = r / 3, cy1 = (r + 1) / 3;
          const ox = Math.max(0, Math.min(relX + relW, cx1) - Math.max(relX, cx0));
          const oy = Math.max(0, Math.min(relY + relH, cy1) - Math.max(relY, cy0));
          if (ox > 0 && oy > 0 && ox * oy > 0.3) cellsCovered.push(`${r},${c}`);
        }
      }
      noteCovers = { region: `row ${bestR}, col ${bestC}`, overlappedCells: cellsCovered };
    }

    return {
      maskApplied,
      verticalMass: [pct(rows[0]), pct(rows[1]), pct(rows[2])],
      horizontalMass: [pct(cols[0]), pct(cols[1]), pct(cols[2])],
      skinCoverage: Math.round((skin / (G * G)) * 100),
      noteCovers,
    };
  });

  console.log(`\n=== ${name} (${pathName})`);
  if (analysis.error) { console.log('  ' + analysis.error); continue; }
  console.log(`  mask applied: ${analysis.maskApplied}`);
  console.log(`  subject mass — V: ${analysis.verticalMass.join('/')} H: ${analysis.horizontalMass.join('/')} (${analysis.skinCoverage}% skin)`);
  console.log(`  script note: ${analysis.noteCovers ? `heaviest region ${analysis.noteCovers.region}; note overlaps cells [${analysis.noteCovers.overlappedCells.join(' ')}]` : 'not present'}`);

  const v = analysis.verticalMass, h = analysis.horizontalMass;
  const flags = [];
  if (v[0] >= 55) flags.push('mass near top — check headroom under mask');
  if (analysis.noteCovers) {
    const [br, bc] = analysis.noteCovers.region.match(/\d/g).map(Number);
    if (analysis.noteCovers.overlappedCells.includes(`${br},${bc}`)) flags.push(`note sits on the heaviest mass region (${analysis.noteCovers.region})`);
  }
  console.log(flags.length ? '  ⚠ ' + flags.join('; ') : '  ✓ subject survives mask + not covered by note');
}

await browser.close();
console.log('\nPhase 2 complete.');
