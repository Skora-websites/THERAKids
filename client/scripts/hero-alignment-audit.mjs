import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:5173';
const EDGE = process.env.BROWSER_PATH
  || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const PAGES = ['/', '/about', '/blogs', '/conditions', '/contact', '/gallery', '/services'];
// Phone, tall phone, landscape phone, tablet portrait/landscape, laptop ratios, desktop.
const VIEWPORTS = [
  [360, 800], [390, 844], [844, 390], [768, 1024], [1024, 768],
  [1280, 800], [1366, 768], [1440, 900], [1920, 1080]
];

const measure = () => {
  const q = (s) => document.querySelector(s);
  const header = q('.header-pill') || q('.global-header');
  const eyebrow = q('[data-hero="eyebrow"]');
  const title = q('[data-hero="title"]');
  const desc = q('[data-hero="text"]');
  const section = q('.page-hero, .home-hero');
  if (!section || !eyebrow || !title) return { error: 'no hero' };
  const rect = (e) => (e ? e.getBoundingClientRect() : null);
  const nav = rect(header);
  const eb = rect(eyebrow), tt = rect(title), ds = rect(desc);
  const st = (e) => (e ? getComputedStyle(e) : null);
  const ebs = st(eyebrow), tts = st(title), dss = st(desc);
  const container = section.querySelector('.container');
  const cr = rect(container);
  return {
    padTop: Math.round(parseFloat(st(section).paddingTop)),
    navBottom: nav ? Math.round(nav.bottom) : null,
    gapNav: eb ? Math.round(eb.top - (nav ? nav.bottom : 0)) : null,
    ebAlign: ebs.textAlign, ebMb: ebs.marginBottom, ebFs: ebs.fontSize,
    titleGap: eb && tt ? Math.round(tt.top - eb.bottom) : null,
    titleAlign: tts.textAlign, titleMb: tts.marginBottom,
    descGap: tt && ds ? Math.round(ds.top - tt.bottom) : null,
    descAlign: ds ? dss.textAlign : null,
    descMaxW: ds ? dss.maxWidth : null,
    // how far the text block's left edge sits from the container's left edge
    textLeft: eb ? Math.round(eb.left) : null,
    containerLeft: cr ? Math.round(cr.left) : null,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
};

const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-first-run'] });
const rows = [];
for (const [w, h] of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  for (const path of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('[data-hero="title"]', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 400)); // let GSAP entrance settle
    const m = await page.evaluate(measure);
    rows.push({ vp: `${w}x${h}`, path, ...m });
  }
  await page.close();
}
await browser.close();

const cols = ['vp', 'path', 'padTop', 'navBottom', 'gapNav', 'ebAlign', 'ebMb', 'ebFs',
  'titleGap', 'titleAlign', 'titleMb', 'descGap', 'descAlign', 'descMaxW',
  'textLeft', 'containerLeft', 'overflow'];
const widths = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)));
const line = (r) => cols.map((c, i) => String(r[c] ?? '').padEnd(widths[i])).join(' | ');
console.log(cols.map((c, i) => c.padEnd(widths[i])).join(' | '));
console.log(widths.map((w) => '-'.repeat(w)).join('-+-'));
rows.forEach((r) => console.log(line(r)));
