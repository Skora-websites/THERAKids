// SEO suite (browser, headless Edge via puppeteer-core).
//
//   node scripts/seo.test.mjs [baseUrl] [apiUrl]
//   npm run test:seo
//
// A. SEO TAB — the admin tab lists every static route, is scoped to the pages that
//    have no resource of their own, and edits round-trip.
// B. STATIC PAGES — an admin-filled meta title becomes <title> verbatim; an empty
//    row leaves the static index.html tags untouched instead of stripping them.
// C. SERVICE PAGES — meta edited in the Services panel reaches /services/:slug, and
//    an empty meta title falls back to the service name.
// D. BLOG PAGES — the meta title is printed with no site suffix appended.
//
// The suite writes to the local database through the admin API and restores every
// value it touches (see the cleanup section at the end).
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:5173';
const API = process.argv[3] || process.env.API_URL || 'http://localhost:5005';
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Static head shipped in index.html — the home page must keep these while its SEO
// row is empty (and after an admin clears the fields again).
const STATIC_TITLE = 'TheraKids Noida | Occupational Therapy, Speech Therapy, Physical Therapy for Kids';
const STATIC_KEYWORDS = 'occupational therapy noida, speech therapy noida, physical therapy noida, pediatric therapy, child development center, autism therapy, ADHD therapy, special education noida';
const STATIC_DESC = 'TheraKids Noida offers world-class Occupational therapy, physical therapy, speech therapy, and Counseling to child/kids in Noida, Delhi NCR under the supervision of highly trained specialists.';

const ROUTES = ['/', '/about', '/services', '/conditions', '/gallery', '/blogs', '/contact'];

/* ------------------------------ tiny harness ------------------------------ */
const sections = [];
let current = null;
let passed = 0;
let failed = 0;

const section = (name) => { current = { name, passed: 0, failed: 0 }; sections.push(current); };
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
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

/* -------------------------------- helpers -------------------------------- */
const login = async (page) => {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('form input');
  const inputs = await page.$$('form input');
  await inputs[0].type('admin');
  await inputs[1].type('admin123');
  await page.click('form button');
  await page.waitForFunction(() => location.pathname.indexOf('/admin/dashboard') === 0, { timeout: 15000 });
};

const adminToken = (page) => page.evaluate(() => localStorage.getItem('admin_token'));

const apiJson = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, options);
  return { status: res.status, body: res.status === 204 ? null : await res.json().catch(() => null) };
};

const authed = (token, body, method = 'PUT') => ({
  method,
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const headTags = (page) =>
  page.evaluate(() => ({
    title: document.title,
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') ?? null,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null
  }));

const gotoPage = async (page, path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction(() => document.title.length > 0);
  await new Promise((r) => setTimeout(r, 400)); // let the /api/seo lookup land
};

const openSeoRows = async (page) => {
  await page.goto(`${BASE}/admin/dashboard/seo`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.crud-table tbody tr', { timeout: 15000 });
};

// Resolve a modal control by its <label> prefix
const openEditForRoute = async (page, route) => {
  const found = await page.evaluateHandle((r) => {
    const row = [...document.querySelectorAll('.crud-table tbody tr')].find((tr) =>
      [...tr.querySelectorAll('td')].some((td) => td.textContent.trim() === r)
    );
    if (!row) return false;
    const btn = [...row.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Edit');
    if (btn) btn.click();
    return Boolean(btn);
  }, route);
  assert(await found.evaluate((v) => v), `no SEO row found for ${route}`);
  await page.waitForSelector('.admin-modal', { visible: true });
};

const setFieldValue = async (page, labelPrefix, value) => {
  const handle = await page.evaluateHandle((text) => {
    const labels = [...document.querySelectorAll('.admin-modal label')];
    const label = labels.find((l) => l.textContent.trim().startsWith(text));
    return label ? label.parentElement.querySelector('input, textarea, select') : null;
  }, labelPrefix);
  const el = handle.asElement();
  assert(el, `field not found: ${labelPrefix}`);
  await el.click();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  if (value) await page.keyboard.type(value, { delay: 2 });
};

const readFieldValue = async (page, labelPrefix) =>
  page.evaluate((text) => {
    const labels = [...document.querySelectorAll('.admin-modal label')];
    const label = labels.find((l) => l.textContent.trim().startsWith(text));
    const el = label?.parentElement.querySelector('input, textarea, select');
    return el ? el.value : null;
  }, labelPrefix);

const submitModal = (page) => page.click('.admin-modal button[type="submit"]');
const modalClosed = (page) =>
  page.waitForFunction(() => !document.querySelector('.admin-modal'), { timeout: 15000 });

/* ---------------------------------- run ---------------------------------- */
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions', '--window-size=1440,900']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('dialog', (d) => d.accept().catch(() => {}));
const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(err.message));

await login(page);
const token = await adminToken(page);
assert(token, 'admin login failed — is the API running with the seeded admin?');

// Previous values, so the suite can put everything back at the end. Read through the
// admin endpoint: the public /api/seo payload is meta-only and carries no ids.
const originalAbout = await apiJson(`/api/admin/page_seo`, { headers: { Authorization: `Bearer ${token}` } });
const aboutRowBefore = (originalAbout.body || []).find((r) => r.page_key === '/about');
const { body: servicesBefore } = await apiJson('/api/services');
const serviceBefore = (servicesBefore || [])[0];
assert(aboutRowBefore, '/about SEO row missing — run: cd server && node scripts/migrate-seo.js');
assert(serviceBefore, 'no services found — seed the database first');

const ABOUT_META = {
  meta_title: 'About TheraKids Noida — Pediatric Therapy Team',
  meta_keywords: 'therakids about, pediatric therapists noida, child therapy team',
  meta_description: 'Meet the multidisciplinary TheraKids Noida team behind our pediatric occupational, speech and physical therapy programmes.'
};

/* ================================ A. SEO TAB ============================== */
section('A. SEO TAB (admin)');

await check('SEO tab exists in the sidebar and opens', async () => {
  const link = await page.$('a[href="/admin/dashboard/seo"]');
  assert(link, 'no SEO link in the admin nav');
  const label = await link.evaluate((a) => a.textContent.trim());
  assert(label === 'SEO', `nav label is "${label}"`);
  await link.click();
  await page.waitForSelector('.crud-table tbody tr', { timeout: 15000 });
});

await check('every static route has a row', async () => {
  const keys = await page.$$eval('.crud-table tbody tr', (rows) =>
    rows.map((tr) => tr.querySelector('td:nth-child(2)')?.textContent.trim())
  );
  for (const route of ROUTES) {
    assert(keys.includes(route), `${route} missing from the SEO table (found: ${keys.join(', ')})`);
  }
});

await check('blog posts and service pages are not listed (they live in their panels)', async () => {
  const keys = await page.$$eval('.crud-table tbody tr', (rows) =>
    rows.map((tr) => tr.querySelector('td:nth-child(2)')?.textContent.trim())
  );
  const stray = keys.filter((k) => k && k.startsWith('/blogs/') === false && k.includes('/') && !ROUTES.includes(k));
  assert(stray.length === 0, `unexpected rows: ${stray.join(', ')}`);
});

await check('tab is scoped: no Add New, no Delete, route is read-only', async () => {
  const addNew = await page.$$eval('.crud-header button', (bs) => bs.map((b) => b.textContent.trim()));
  assert(addNew.length === 0, `"+ Add New" should be hidden, got ${addNew.join(', ')}`);
  const deletes = await page.$$eval('.crud-table tbody .actions-cell button', (bs) =>
    bs.filter((b) => b.textContent.trim() === 'Delete').length
  );
  assert(deletes === 0, `${deletes} Delete buttons rendered`);
  const note = await page.$eval('.admin-note', (el) => el.textContent).catch(() => null);
  assert(note && /Blogs panel/.test(note), `scope note missing (got "${note}")`);

  await openEditForRoute(page, '/about');
  const readOnly = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('.admin-modal label')];
    const label = labels.find((l) => l.textContent.trim().startsWith('Page (route path)'));
    return label?.parentElement.querySelector('input')?.readOnly;
  });
  assert(readOnly === true, 'the route path input is editable');
  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

await check('/about meta saves and re-populates in the edit form', async () => {
  await openEditForRoute(page, '/about');
  await setFieldValue(page, 'Meta Title', ABOUT_META.meta_title);
  await setFieldValue(page, 'Meta Keywords', ABOUT_META.meta_keywords);
  await setFieldValue(page, 'Meta Description', ABOUT_META.meta_description);
  await submitModal(page);
  await modalClosed(page);

  const { body } = await apiJson('/api/seo');
  const row = (body || []).find((r) => r.page_key === '/about');
  assert(row.meta_title === ABOUT_META.meta_title, `stored title = "${row.meta_title}"`);
  assert(row.meta_keywords === ABOUT_META.meta_keywords, `stored keywords = "${row.meta_keywords}"`);
  assert(row.meta_description === ABOUT_META.meta_description, `stored description = "${row.meta_description}"`);

  await openSeoRows(page);
  await openEditForRoute(page, '/about');
  assert((await readFieldValue(page, 'Meta Title')) === ABOUT_META.meta_title, 'title not re-populated');
  assert((await readFieldValue(page, 'Meta Keywords')) === ABOUT_META.meta_keywords, 'keywords not re-populated');
  assert((await readFieldValue(page, 'Meta Description')) === ABOUT_META.meta_description, 'description not re-populated');
  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

/* ============================== B. STATIC PAGES =========================== */
section('B. STATIC PAGES (public)');

await check('/about prints the meta title verbatim, plus keywords + description', async () => {
  await gotoPage(page, '/about');
  const tags = await headTags(page);
  assert(tags.title === ABOUT_META.meta_title, `title = "${tags.title}"`);
  assert(!/\|/.test(tags.title), `title still carries a suffix: "${tags.title}"`);
  assert(tags.keywords === ABOUT_META.meta_keywords, `keywords = "${tags.keywords}"`);
  assert(tags.description === ABOUT_META.meta_description, `description = "${tags.description}"`);
  assert(tags.canonical === 'https://therakidsnoida.com/about', `canonical = "${tags.canonical}"`);
  assert(tags.ogUrl === tags.canonical, `og:url = "${tags.ogUrl}"`);
});

await check('home keeps the static index.html tags while its SEO row is empty', async () => {
  await gotoPage(page, '/');
  const tags = await headTags(page);
  assert(tags.title === STATIC_TITLE, `title = "${tags.title}"`);
  assert(tags.keywords === STATIC_KEYWORDS, `keywords = "${tags.keywords}"`);
  assert(tags.description === STATIC_DESC, `description = "${tags.description}"`);
  assert(tags.canonical === 'https://therakidsnoida.com/', `canonical = "${tags.canonical}"`);
});

await check('other empty rows keep their defaults too (/contact, /gallery)', async () => {
  for (const path of ['/contact', '/gallery']) {
    await gotoPage(page, path);
    const tags = await headTags(page);
    assert(tags.title === STATIC_TITLE, `${path} title = "${tags.title}"`);
    assert(tags.description === STATIC_DESC, `${path} description lost`);
    assert(tags.canonical === `https://therakidsnoida.com${path}`, `${path} canonical = "${tags.canonical}"`);
  }
});

await check('clearing the fields restores the static defaults', async () => {
  await openSeoRows(page);
  await openEditForRoute(page, '/about');
  await setFieldValue(page, 'Meta Title', '');
  await setFieldValue(page, 'Meta Keywords', '');
  await setFieldValue(page, 'Meta Description', '');
  await submitModal(page);
  await modalClosed(page);
  await gotoPage(page, '/about');
  const tags = await headTags(page);
  assert(tags.title === STATIC_TITLE, `title = "${tags.title}" (static expected)`);
  assert(tags.keywords === STATIC_KEYWORDS, `keywords = "${tags.keywords}"`);
  assert(tags.description === STATIC_DESC, `description = "${tags.description}"`);
});

/* ============================= C. SERVICE PAGES =========================== */
section('C. SERVICE PAGES');

const SERVICE_META = {
  meta_title: 'Speech & Language Therapy for Children in Noida',
  meta_keywords: 'child speech therapy noida, speech therapist for kids',
  meta_description: 'Our pediatric speech-language pathologists help children build clear speech, language and confident communication.'
};

await check('service meta saved in the Services panel reaches the live page', async () => {
  const res = await apiJson(`/api/admin/services/${serviceBefore.id}`, authed(token, SERVICE_META));
  assert(res.status === 200, `PUT services/${serviceBefore.id} → ${res.status}`);
  await gotoPage(page, `/services/${serviceBefore.slug}`);
  const tags = await headTags(page);
  assert(tags.title === SERVICE_META.meta_title, `title = "${tags.title}"`);
  assert(tags.keywords === SERVICE_META.meta_keywords, `keywords = "${tags.keywords}"`);
  assert(tags.description === SERVICE_META.meta_description, `description = "${tags.description}"`);
  assert(tags.canonical === `https://therakidsnoida.com/services/${serviceBefore.slug}`, `canonical = "${tags.canonical}"`);
});

await check('the Services form carries the meta fields', async () => {
  await page.goto(`${BASE}/admin/dashboard/services`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.crud-table tbody tr', { timeout: 15000 });
  const clicked = await page.evaluate(() => {
    const row = document.querySelector('.crud-table tbody tr');
    const btn = [...row.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Edit');
    if (btn) btn.click();
    return Boolean(btn);
  });
  assert(clicked, 'no Edit button on the services table');
  await page.waitForSelector('.admin-modal', { visible: true });
  const labels = await page.$$eval('.admin-modal label', (ls) => ls.map((l) => l.textContent.trim()));
  for (const wanted of ['Meta Title', 'Meta Keywords', 'Meta Description', 'Canonical URL']) {
    assert(labels.some((l) => l.startsWith(wanted)), `${wanted} field missing from the Services form`);
  }
  const heading = await page.$$eval('.form-section-heading', (hs) => hs.map((h) => h.textContent.trim()));
  assert(heading.includes('SEO Settings'), `SEO Settings heading missing (got: ${heading.join(', ')})`);
  assert((await readFieldValue(page, 'Meta Title')) === SERVICE_META.meta_title, 'service meta title not re-populated');
  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

await check('empty service meta falls back to the service name and short description', async () => {
  const res = await apiJson(
    `/api/admin/services/${serviceBefore.id}`,
    authed(token, { meta_title: '', meta_keywords: '', meta_description: '' })
  );
  assert(res.status === 200, `PUT failed with ${res.status}`);
  await gotoPage(page, `/services/${serviceBefore.slug}`);
  const tags = await headTags(page);
  assert(tags.title === serviceBefore.name, `title = "${tags.title}", expected the service name`);
  assert(tags.description && tags.description.length > 20, `description = "${tags.description}"`);
  assert(!tags.description.includes('<'), 'description still contains markup');
});

/* =============================== D. BLOG PAGES ============================ */
section('D. BLOG PAGES');

await check('blog meta title is printed with no site suffix', async () => {
  const { body: blogs } = await apiJson('/api/blogs');
  assert(blogs && blogs.length, 'no published blogs to check');
  // Prefer a post that actually has a meta title; most seeded posts fall back to
  // their title. The legacy seo_title column is ignored (the panel edits meta_title).
  const post = blogs.find((b) => (b.meta_title || '').trim()) || blogs[0];
  const metaTitle = (post.meta_title || '').trim();
  await gotoPage(page, `/blogs/${post.slug}`);
  const tags = await headTags(page);
  const expected = metaTitle || post.title;
  assert(tags.title === expected, `title = "${tags.title}", expected "${expected}"`);
  assert(!tags.title.includes('| TheraKids'), `site suffix still appended: "${tags.title}"`);
  assert(!tags.title.endsWith(' |'), 'title has a dangling separator');
});

await check('legacy seo_title values never leak into <title>', async () => {
  const { body: blogs } = await apiJson('/api/blogs');
  const legacy = blogs.find((b) => (b.seo_title || '').trim() && !(b.meta_title || '').trim());
  assert(legacy, 'no seeded post carries a legacy seo_title to check');
  await gotoPage(page, `/blogs/${legacy.slug}`);
  const tags = await headTags(page);
  assert(tags.title === legacy.title, `title = "${tags.title}", expected the post title`);
  assert(!tags.title.includes('| TheraKids'), 'seo_title leaked the site suffix into <title>');
});

await check('no uncaught page errors during the suite', () => {
  assert(pageErrors.length === 0, pageErrors.join(' | '));
});

/* -------------------------------- cleanup -------------------------------- */
const cleanup = async () => {
  const restore = async (path, body) => {
    const res = await apiJson(path, authed(token, body));
    console.log(`  restore ${path} → ${res.status}`);
  };
  await restore(`/api/admin/page_seo/${aboutRowBefore.id}`, {
    meta_title: aboutRowBefore.meta_title || '',
    meta_keywords: aboutRowBefore.meta_keywords || '',
    meta_description: aboutRowBefore.meta_description || '',
    canonical_url: aboutRowBefore.canonical_url || ''
  });
  await restore(`/api/admin/services/${serviceBefore.id}`, {
    meta_title: serviceBefore.meta_title || '',
    meta_keywords: serviceBefore.meta_keywords || '',
    meta_description: serviceBefore.meta_description || '',
    canonical_url: serviceBefore.canonical_url || ''
  });
};
console.log('\ncleaning up:');
await cleanup();

await browser.close();

/* --------------------------------- report -------------------------------- */
console.log('\n================ RESULTS ================');
for (const s of sections) {
  console.log(`${s.name.padEnd(28)} ${s.passed} passed${s.failed ? `, ${s.failed} FAILED` : ''}`);
}
console.log(`\nTOTAL: ${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
