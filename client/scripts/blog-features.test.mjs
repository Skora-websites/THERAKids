// Blog feature test suite (browser, headless Edge via puppeteer-core).
//
//   node scripts/blog-features.test.mjs [baseUrl] [apiUrl]
//
// A. SEO meta tags per blog (persist, re-populate, all three fallbacks, XSS escaping, legacy post, listing defaults)
// B. Slug auto-fill from title (accents/specials, live update, manual lock, clear-to-refill, edit-form rule, reachable URL)
// C. Rich paste fidelity (REAL clipboard paste of Word-style HTML, preserved elements, junk stripped, re-hosted images,
//    server round-trip, public render, plain-text fallback)
// D. Regression (blog CRUD, duplicate-slug error, WYSIWYG content save, delete)
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:5174';
const API = process.argv[3] || process.env.API_URL || 'http://localhost:5005';
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ORIGIN = new URL(BASE).origin;

// Static head shipped in index.html — home must keep exactly these after
// visiting an SEO-managed page (spec: other pages unaffected).
const STATIC_TITLE = 'TheraKids Noida | Occupational Therapy, Speech Therapy, Physical Therapy for Kids';
const STATIC_KEYWORDS = 'occupational therapy noida, speech therapy noida, physical therapy noida, pediatric therapy, child development center, autism therapy, ADHD therapy, special education noida';
const STATIC_DESC = 'TheraKids Noida offers world-class Occupational therapy, physical therapy, speech therapy, and Counseling to child/kids in Noida, Delhi NCR under the supervision of highly trained specialists.';

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

const openBlogs = async (page) => {
  await page.goto(`${BASE}/admin/dashboard/blogs`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.crud-table tbody tr', { timeout: 15000 });
};

// Resolve a form control (or the rich editor) by its <label> prefix inside the modal
const field = async (page, labelPrefix) => {
  const handle = await page.evaluateHandle((text) => {
    const labels = [...document.querySelectorAll('.admin-modal label')];
    const label = labels.find((l) => l.textContent.trim().startsWith(text));
    if (!label) return null;
    const wrap = label.parentElement;
    // The richtext label wraps the whole toolbar; [contenteditable] must win
    // over the toolbar's <select>/<input>, or keystrokes land in the Style dropdown.
    return (
      wrap.querySelector('[contenteditable="true"]') ||
      wrap.querySelector('input, textarea, select') ||
      wrap
    );
  }, labelPrefix);
  const el = handle.asElement();
  if (!el) throw new Error(`field not found: ${labelPrefix}`);
  return el;
};

const typeInto = async (page, labelPrefix, text, { clear = false } = {}) => {
  const el = await field(page, labelPrefix);
  await el.click();
  if (clear) {
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
  }
  if (text) await page.keyboard.type(text, { delay: 5 });
};

const getValue = async (page, labelPrefix) =>
  field(page, labelPrefix).then((el) => el.evaluate((node) => (node.isContentEditable ? node.innerHTML : node.value)));

const openAdd = async (page) => {
  await page.click('.crud-header .btn-primary');
  await page.waitForSelector('.admin-modal', { visible: true });
};

const submitModal = async (page) => {
  await page.click('.admin-modal button[type="submit"]');
};

const modalClosed = (page) =>
  page.waitForFunction(() => !document.querySelector('.admin-modal'), { timeout: 15000 });

// The blogs table renders id/title/status/published_at — no slug column — so
// rows are addressed by their title.
const openEditByTitle = async (page, titleText) => {
  const found = await page.evaluateHandle((t) => {
    const rows = [...document.querySelectorAll('.crud-table tbody tr')];
    const row = rows.find((r) => r.textContent.includes(t));
    if (!row) return false;
    const btn = [...row.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Edit');
    if (btn) btn.click();
    return Boolean(btn);
  }, titleText);
  assert(await found.evaluate((v) => v), `Edit button not found for "${titleText}"`);
  await page.waitForSelector('.admin-modal', { visible: true });
};

const deleteByTitle = async (page, titleText) => {
  const found = await page.evaluateHandle((t) => {
    const rows = [...document.querySelectorAll('.crud-table tbody tr')];
    const row = rows.find((r) => r.textContent.includes(t));
    if (!row) return false;
    const btn = [...row.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Delete');
    if (btn) btn.click();
    return Boolean(btn);
  }, titleText);
  assert(await found.evaluate((v) => v), `Delete button not found for "${titleText}"`);
};

const saveBlog = async (page, { title, slug, content, status = 'published', meta = {} } = {}) => {
  await openAdd(page);
  // Slug first while the field is empty: typing locks it as a manual value,
  // so the title's auto-fill can never rename it afterwards.
  if (slug) await typeInto(page, 'Slug', slug);
  if (title) await typeInto(page, 'Title', title);
  if (content) {
    const editor = await field(page, 'Content');
    await editor.click();
    await page.keyboard.type(content, { delay: 2 });
  }
  if (status) {
    const sel = await field(page, 'Status');
    await sel.select(status);
  }
  if (meta.title !== undefined) await typeInto(page, 'Meta Title', meta.title, { clear: true });
  if (meta.keywords !== undefined) await typeInto(page, 'Meta Keywords', meta.keywords, { clear: true });
  if (meta.description !== undefined) await typeInto(page, 'Meta Description', meta.description, { clear: true });
  submitModal(page);
  await modalClosed(page);
};

const headTags = async (page) => page.evaluate(() => ({
  title: document.title,
  keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') ?? null,
  description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
  headHtml: document.head.innerHTML
}));

const apiJson = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, options);
  return { status: res.status, body: res.status === 204 ? null : await res.json().catch(() => null) };
};

const adminToken = async (page) => page.evaluate(() => localStorage.getItem('admin_token'));

const deleteBlogBySlug = async (token, slug) => {
  const { body } = await apiJson('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
  const row = (body || []).find((b) => b.slug === slug);
  if (row) await apiJson(`/api/admin/blogs/${row.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
};

const truncateExcerpt = (text, max = 160) => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

/* ------------------------------ Word-style HTML --------------------------- */
const WORD_HTML = `<![if !supportLists]><meta charset="utf-8"><![endif]>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style type="text/css">p.MsoNormal { margin: 0in; font-size: 11pt; }</style>
<script>window.__pwned = 1;</script>
<div class="MsoNormal" style="font-family:Calibri;color:#1f1f1f;">
<h1 style="text-align:center;">Doc Heading</h1>
<p style="text-align:center;"><span style="color:#ff0000;font-size:22px;font-weight:bold;">Colored &amp; sized text</span></p>
<p class="MsoNormal"><b>bold bit</b> <i>italic bit</i> <u>under bit</u>
<a href="https://example.com/x">a good link</a>
<a href="javascript:alert(1)">a bad link</a>
<img src="${BASE}/images/hero-about.jpg" alt="pasted pic" onerror="window.__pwned=2"></p>
<ul style="margin-left:20px;"><li>bullet one</li></ul>
<ol start="3"><li>third item</li></ol>
<table border="1" cellpadding="4" style="border-collapse:collapse;">
 <tr><td colspan="2" rowspan="2" style="border:1px solid #333;padding:4px;text-align:center;">wide cell</td></tr>
 <tr><td>second row</td></tr>
</table>
<o:p></o:p>
<span style="mso-fareast-font-family:'Calibri'">office span</span>
</div>`;

const PLAIN_TEXT = 'Pasted plain text line one. Pasted plain text line two.';

/* --------------------------------- checks --------------------------------- */
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-first-run', '--disable-extensions', '--window-size=1440,900']
});

// Clipboard permissions (permission names vary across Chromium versions)
for (const perms of [
  ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'],
  ['clipboard-read', 'clipboard-write'],
  ['clipboard-sanitized-write'],
  ['clipboardReadWrite']
]) {
  try {
    await browser.defaultBrowserContext().overridePermissions(ORIGIN, perms);
    break;
  } catch { /* try the next spelling */ }
}

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('dialog', (d) => d.accept().catch(() => {}));
const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(err.message));

await login(page);

const LONG_CONTENT =
  'Sensory play helps children explore the world through touch, sight, sound, movement and gravity while building the neural connections that support learning, regulation and confidence every single day. ' +
  'This long body copy exists so the description fallback has more than one hundred sixty characters to work with. ';

const SEO_POST = {
  slug: 'seo-meta-test-post',
  title: 'A Complete Guide to Sensory Play',
  meta: {
    title: 'Sensory Play Guide for Parents',
    keywords: 'sensory play, kids, therapy',
    description: 'A parent-friendly guide to sensory play: what it is, why it matters, and five simple activities to try at home.'
  }
};

/* ================================ A. SEO ================================= */
section('A. SEO META TAGS PER BLOG');

await openBlogs(page);

await check('save blog with all three SEO fields (admin form persists them)', async () => {
  await saveBlog(page, { title: SEO_POST.title, slug: SEO_POST.slug, content: LONG_CONTENT, meta: SEO_POST.meta });
  const token = await adminToken(page);
  const { body } = await apiJson('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
  const row = (body || []).find((b) => b.slug === SEO_POST.slug);
  assert(row, 'row not found after save');
  assert(row.meta_title === SEO_POST.meta.title, `meta_title stored as "${row.meta_title}"`);
  assert(row.meta_keywords === SEO_POST.meta.keywords, `meta_keywords stored as "${row.meta_keywords}"`);
  assert(row.meta_description === SEO_POST.meta.description, `meta_description stored as "${row.meta_description}"`);
});

await check('edit form re-populates the three SEO fields', async () => {
  await openBlogs(page);
  await openEditByTitle(page, SEO_POST.title);
  assert((await getValue(page, 'Meta Title')) === SEO_POST.meta.title, 'Meta Title not re-populated');
  assert((await getValue(page, 'Meta Keywords')) === SEO_POST.meta.keywords, 'Meta Keywords not re-populated');
  assert((await getValue(page, 'Meta Description')) === SEO_POST.meta.description, 'Meta Description not re-populated');
  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

await check('live counters: over-limit turns red, within-limit is neutral', async () => {
  await openBlogs(page);
  await openEditByTitle(page, SEO_POST.title);

  const counterState = async (labelPrefix) => field(page, labelPrefix).then((el) =>
    el.evaluate((node) => {
      const counter = node.closest('.form-field').querySelector('.field-counter');
      return counter ? { text: counter.textContent, over: counter.classList.contains('over') } : null;
    }));

  const overTitle = 'X'.repeat(70);
  await typeInto(page, 'Meta Title', overTitle, { clear: true });
  let counter = await counterState('Meta Title');
  assert(counter, 'Meta Title counter missing');
  assert(counter.over, 'counter should be red/over at 70 chars (target 60)');
  assert(counter.text.includes('60'), `counter should show target 60, got "${counter.text}"`);

  await typeInto(page, 'Meta Title', SEO_POST.meta.title, { clear: true });
  counter = await counterState('Meta Title');
  assert(!counter.over, 'counter should be neutral within the 60-char target');

  await typeInto(page, 'Meta Description', 'Y'.repeat(200), { clear: true });
  counter = await counterState('Meta Description');
  assert(counter.over, 'description counter should be red at 200 chars (target 160)');
  await typeInto(page, 'Meta Description', SEO_POST.meta.description, { clear: true });

  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

await check('public detail page emits exact <title>/<keywords>/<description>', async () => {
  await page.goto(`${BASE}/blogs/${SEO_POST.slug}`, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => document.title.length > 0);
  const tags = await headTags(page);
  // The meta title is the <title>, verbatim — no site suffix is appended.
  assert(tags.title === SEO_POST.meta.title, `title = "${tags.title}"`);
  assert(tags.keywords === SEO_POST.meta.keywords, `keywords = "${tags.keywords}"`);
  assert(tags.description === SEO_POST.meta.description, `description = "${tags.description}"`);
});

await check('clearing all three → title/keywords/description fallbacks', async () => {
  await openBlogs(page);
  await openEditByTitle(page, SEO_POST.title);
  await typeInto(page, 'Meta Title', '', { clear: true });
  await typeInto(page, 'Meta Keywords', '', { clear: true });
  await typeInto(page, 'Meta Description', '', { clear: true });
  submitModal(page);
  await modalClosed(page);

  await page.goto(`${BASE}/blogs/${SEO_POST.slug}`, { waitUntil: 'networkidle2' });
  const tags = await headTags(page);
  assert(tags.title === SEO_POST.title, `title fallback = "${tags.title}"`);
  assert(tags.keywords === null, `keywords tag should be omitted, got "${tags.keywords}"`);
  const expected = truncateExcerpt(LONG_CONTENT.trim());
  assert(tags.description === expected, `description fallback mismatch\n  expected: ${expected}\n  actual:   ${tags.description}`);
  assert(tags.description.length <= 163, `excerpt too long: ${tags.description.length}`);
  assert(tags.description.endsWith('...'), 'truncated excerpt should end with ...');
});

await check('XSS payload in SEO fields stays inert and escaped in head source', async () => {
  const xssTitle = '"/><script>window.__xss=1</script>';
  const xssDesc = '<img src=x onerror=window.__xss=1>';
  await openBlogs(page);
  await openEditByTitle(page, SEO_POST.title);
  await typeInto(page, 'Meta Title', xssTitle, { clear: true });
  await typeInto(page, 'Meta Keywords', '"><script>bad()</script>', { clear: true });
  await typeInto(page, 'Meta Description', xssDesc, { clear: true });
  submitModal(page);
  await modalClosed(page);

  await page.goto(`${BASE}/blogs/${SEO_POST.slug}`, { waitUntil: 'networkidle2' });
  const tags = await headTags(page);
  const executed = await page.evaluate(() => ({
    xss: typeof window.__xss !== 'undefined',
    liveScriptInHead: [...document.head.querySelectorAll('script')].some((s) => s.textContent.includes('__xss')),
    liveImg: [...document.head.querySelectorAll('img')].length
  }));
  assert(!executed.xss, 'XSS payload executed (window.__xss set)');
  assert(!executed.liveScriptInHead, 'script node injected into head');
  assert(executed.liveImg === 0, 'img node injected into head');
  assert(tags.headHtml.includes('&lt;script&gt;'), 'payload should serialise escaped as &lt;script&gt; in head source');
  assert(tags.title.includes(xssTitle), `title should carry the literal payload as text, got "${tags.title}"`);
  assert(tags.keywords === '"><script>bad()</script>', 'keywords content mismatch');
});

await check('legacy post with no SEO data renders with fallbacks', async () => {
  await page.goto(`${BASE}/blogs/understanding-sensory-processing`, { waitUntil: 'networkidle2' });
  const tags = await headTags(page);
  assert(tags.title === 'Understanding Sensory Processing Disorder', `title = "${tags.title}"`);
  assert(tags.keywords === null, 'keywords should be omitted for legacy posts');
  // No stored meta → description must be the 160-char excerpt of the post's content.
  const token = await adminToken(page);
  const { body } = await apiJson('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
  const row = (body || []).find((b) => b.slug === 'understanding-sensory-processing');
  assert(row, 'legacy post missing from API');
  assert(!row.meta_description, `legacy post should have no meta_description, got "${row.meta_description}"`);
  const plain = String(row.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const expected = truncateExcerpt(plain);
  assert(tags.description === expected, `description fallback mismatch\n  expected: ${expected}\n  actual:   ${tags.description}`);
  assert(tags.description.endsWith('...') && tags.description.length <= 163, 'legacy description should be a 160-char excerpt');
  const articleOk = await page.evaluate(() => Boolean(document.querySelector('.blog-body p')));
  assert(articleOk, 'article body did not render');
});

await check('listing page emits default keywords + description', async () => {
  await page.goto(`${BASE}/blogs`, { waitUntil: 'networkidle2' });
  const tags = await headTags(page);
  assert(tags.keywords && tags.keywords.includes('THERAKids blog'), `keywords = "${tags.keywords}"`);
  assert(tags.description && tags.description.includes('THERAKids team'), `description = "${tags.description}"`);
});

await check('other pages unaffected (static head restored when SPA-navigating home)', async () => {
  await page.goto(`${BASE}/blogs/${SEO_POST.slug}`, { waitUntil: 'networkidle2' });
  const onPost = await page.evaluate(() => document.title);
  assert(onPost.includes('window.__xss'), `precondition failed, title = "${onPost}"`);
  // Client-side navigation: BlogPost's cleanup must put the static head back.
  const clicked = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a[href="/"]')].find((x) => x.offsetParent !== null);
    if (a) { a.click(); return true; }
    return false;
  });
  assert(clicked, 'no visible link to "/" found');
  await page.waitForFunction(() => location.pathname === '/', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const tags = await headTags(page);
  assert(tags.title === STATIC_TITLE, `home title = "${tags.title}"`);
  assert(tags.keywords === STATIC_KEYWORDS, `home keywords = "${tags.keywords}"`);
  assert(tags.description === STATIC_DESC, `home description = "${tags.description}"`);
});

/* ================================ B. SLUG ================================ */
section('B. SLUG AUTO-FILL FROM TITLE');

await openBlogs(page);

await check('auto-fill: accents and special characters slugified correctly', async () => {
  await openAdd(page);
  await typeInto(page, 'Title', 'Café & Crème – Prüfung 100%!?');
  const slug = await getValue(page, 'Slug');
  assert(slug === 'cafe-creme-prufung-100', `slug = "${slug}"`);
});

await check('live-updates while typing the title', async () => {
  await typeInto(page, 'Title', '', { clear: true });
  await typeInto(page, 'Title', 'Hel');
  assert((await getValue(page, 'Slug')) === 'hel', `partial slug = "${await getValue(page, 'Slug')}"`);
  await typeInto(page, 'Title', 'lo World');
  assert((await getValue(page, 'Slug')) === 'hello-world', `slug = "${await getValue(page, 'Slug')}"`);
});

await check('hint text present under the slug field', async () => {
  const hint = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('.admin-modal label')];
    const label = labels.find((l) => l.textContent.trim().startsWith('Slug'));
    return label?.parentElement.querySelector('.field-hint')?.textContent || null;
  });
  assert(hint && hint.includes('Auto-filled from the blog title'), `hint = "${hint}"`);
});

await check('manual slug edit locks auto-fill', async () => {
  await typeInto(page, 'Slug', 'my-custom-slug', { clear: true });
  await typeInto(page, 'Title', 'Title After Manual Edit', { clear: true });
  assert((await getValue(page, 'Slug')) === 'my-custom-slug', `slug was overwritten: "${await getValue(page, 'Slug')}"`);
});

await check('clearing the slug field re-enables auto-fill', async () => {
  await typeInto(page, 'Slug', '', { clear: true });
  await typeInto(page, 'Title', 'Fresh Title Here', { clear: true });
  assert((await getValue(page, 'Slug')) === 'fresh-title-here', `slug = "${await getValue(page, 'Slug')}"`);
});

await check('saved post: edit-form slug is NOT overwritten by title edits', async () => {
  // Save with a manual slug first
  await typeInto(page, 'Slug', 'manual-slug-keeps', { clear: true });
  await typeInto(page, 'Title', 'Slug Lock Test', { clear: true });
  const statusSel = await field(page, 'Status');
  await statusSel.select('published');
  submitModal(page);
  await modalClosed(page);

  // Reopen: prefilled slug behaves as manual
  await openBlogs(page);
  await openEditByTitle(page, 'Slug Lock Test');
  await typeInto(page, 'Title', ' Slug Lock Test Renamed', { clear: false });
  assert((await getValue(page, 'Slug')) === 'manual-slug-keeps', `edit-form slug overwritten: "${await getValue(page, 'Slug')}"`);
  // Clearing the field re-enables auto-fill on the edit form too
  await typeInto(page, 'Slug', '', { clear: true });
  await typeInto(page, 'Title', 'Renamed From Cleared Slug', { clear: true });
  assert((await getValue(page, 'Slug')) === 'renamed-from-cleared-slug', `slug = "${await getValue(page, 'Slug')}"`);
  submitModal(page);
  await modalClosed(page);
});

await check('auto-generated slug URL is reachable (status published)', async () => {
  await page.goto(`${BASE}/blogs/manual-slug-keeps`, { waitUntil: 'networkidle2' });
  const state = await page.evaluate(() => ({
    notFound: document.body.innerText.includes('Post not found'),
    heading: document.querySelector('h1')?.textContent || ''
  }));
  // Note: slug was cleared+refilled in the previous test, so the saved slug is the refilled one
  if (state.notFound) {
    await page.goto(`${BASE}/blogs/renamed-from-cleared-slug`, { waitUntil: 'networkidle2' });
    const retry = await page.evaluate(() => !document.body.innerText.includes('Post not found'));
    assert(retry, 'neither slug URL reachable');
  } else {
    assert(state.heading.includes('Slug Lock Test'), `heading = "${state.heading}"`);
  }
});

/* =============================== C. PASTE =============================== */
section('C. RICH PASTE FIDELITY');

await openBlogs(page);

await check('REAL clipboard paste of Word-style HTML into the editor', async () => {
  await openAdd(page);
  await typeInto(page, 'Title', 'Paste Fidelity Test');
  await typeInto(page, 'Meta Keywords', 'paste, word, sanitizer', { clear: true });

  // Write both flavours to the real system clipboard…
  const writeErr = await page.evaluate(async ({ html, plain }) => {
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' })
      })]);
      return null;
    } catch (err) {
      return err.message;
    }
  }, { html: WORD_HTML, plain: PLAIN_TEXT });
  assert(!writeErr, `clipboard.write failed: ${writeErr}`);

  // …then a genuine Ctrl+V (browser paste pipeline, not a synthetic event)
  const editor = await field(page, 'Content');
  await editor.click();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up('Control');

  // Re-hosting remote images is async — wait for the /uploads/ rewrite
  await page.waitForFunction(() => {
    const ed = document.querySelector('[data-testid="blog-content-editor"]');
    return ed && [...ed.querySelectorAll('img')].some((img) => (img.getAttribute('src') || '').startsWith('/uploads/'));
  }, { timeout: 20000 });
});

const editorAudit = async (page) => page.evaluate(() => {
  const ed = document.querySelector('[data-testid="blog-content-editor"]');
  if (!ed) return null;
  const html = ed.innerHTML;
  const spans = [...ed.querySelectorAll('span')];
  const cell = ed.querySelector('td[colspan="2"]');
  return {
    html,
    h1: ed.querySelector('h1')?.textContent.includes('Doc Heading') || false,
    bold: Boolean(ed.querySelector('b, strong')),
    italic: Boolean(ed.querySelector('i, em')),
    underline: Boolean(ed.querySelector('u')),
    coloredSpan: spans.some((s) => /color/i.test(s.getAttribute('style') || '') && /font-size/i.test(s.getAttribute('style') || '')),
    centered: [...ed.querySelectorAll('[style]')].some((n) => /text-align:\s*center/i.test(n.getAttribute('style') || '')),
    marginLeft: [...ed.querySelectorAll('[style]')].some((n) => /margin-left:\s*20px/i.test(n.getAttribute('style') || '')),
    link: Boolean(ed.querySelector('a[href="https://example.com/x"]')),
    ul: Boolean(ed.querySelector('ul li')),
    olStart: ed.querySelector('ol')?.getAttribute('start') === '3',
    tableCell: Boolean(cell) && /border/i.test(cell.getAttribute('style') || '') && /padding/i.test(cell.getAttribute('style') || ''),
    rowspan: Boolean(ed.querySelector('td[rowspan="2"]')),
    imgRehosted: [...ed.querySelectorAll('img')].some((i) => (i.getAttribute('src') || '').startsWith('/uploads/')),
    // junk
    hasScript: Boolean(ed.querySelector('script')),
    hasStyleTag: Boolean(ed.querySelector('style')),
    hasIframe: Boolean(ed.querySelector('iframe')),
    hasO_P: /<o:p|o:p>/i.test(html),
    hasMso: /mso-/i.test(html),
    hasOnAttr: [...ed.querySelectorAll('*')].some((n) => [...n.attributes].some((a) => a.name.toLowerCase().startsWith('on'))),
    hasJsHref: Boolean(ed.querySelector('a[href^="javascript:"]')),
    pwned: typeof window.__pwned !== 'undefined'
  };
});

await check('every preserved element type survives the paste', async () => {
  const a = await editorAudit(page);
  assert(a, 'editor not found');
  for (const key of ['h1', 'bold', 'italic', 'underline', 'coloredSpan', 'centered', 'marginLeft', 'link', 'ul', 'olStart', 'tableCell', 'rowspan', 'imgRehosted']) {
    assert(a[key], `missing preserved element: ${key}`);
  }
});

await check('office junk, scripts and handlers stripped from the editor', async () => {
  const a = await editorAudit(page);
  for (const key of ['hasScript', 'hasStyleTag', 'hasIframe', 'hasO_P', 'hasMso', 'hasOnAttr', 'hasJsHref', 'pwned']) {
    assert(!a[key], `junk survived: ${key}`);
  }
});

const PASTE_SLUG = 'paste-fidelity-test';

await check('save → server sanitiser keeps the same elements, drops the junk', async () => {
  const statusSel = await field(page, 'Status');
  await statusSel.select('published');
  submitModal(page);
  await modalClosed(page);

  const token = await adminToken(page);
  const { body } = await apiJson('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
  const row = (body || []).find((b) => b.slug === PASTE_SLUG);
  assert(row, 'pasted blog not found after save');
  // Normalise style spacing so "text-align: center" and "text-align:center" both match.
  const html = (row.content || '').replace(/\s*:\s*/g, ':').replace(/;\s*/g, ';');
  // On failure, surface every td's style so the exact drop point is visible.
  const tdDump = [...(row.content || '').matchAll(/<td[^>]*>/g)].map((m) => m[0]).join('\n    ');
  const mustHave = ['<h1', '<b>', '<i>', '<u>', 'color', 'font-size', 'text-align:center', 'margin-left:20px',
    'https://example.com/x', '<ul', '<ol start="3"', 'colspan="2"', 'rowspan="2"', 'border:1px solid', 'padding:4px', '/uploads/'];
  for (const tokenStr of mustHave) {
    assert(html.includes(tokenStr), `saved content missing "${tokenStr}"\n    td tags: ${tdDump}`);
  }
  const mustNot = ['<script', '<style', '<iframe', 'o:p', 'mso-', 'onerror', 'javascript:', 'class="'];
  for (const tokenStr of mustNot) assert(!html.toLowerCase().includes(tokenStr.toLowerCase()), `saved content still contains "${tokenStr}"`);
});

await check('public page renders the pasted structure without junk', async () => {
  await page.goto(`${BASE}/blogs/${PASTE_SLUG}`, { waitUntil: 'networkidle2' });
  const audit = await page.evaluate(() => {
    const body = document.querySelector('.blog-body');
    if (!body) return null;
    const html = body.innerHTML;
    return {
      h1: Boolean(body.querySelector('h1')),
      bold: Boolean(body.querySelector('b, strong')),
      italic: Boolean(body.querySelector('i, em')),
      underline: Boolean(body.querySelector('u')),
      coloredSpan: [...body.querySelectorAll('span')].some((s) => /color/i.test(s.getAttribute('style') || '')),
      centered: [...body.querySelectorAll('[style]')].some((n) => /text-align:\s*center/i.test(n.getAttribute('style') || '')),
      link: Boolean(body.querySelector('a[href="https://example.com/x"]')),
      ul: Boolean(body.querySelector('ul li')),
      olStart: body.querySelector('ol')?.getAttribute('start') === '3',
      tableCell: Boolean(body.querySelector('td[colspan="2"][rowspan="2"]')),
      img: Boolean(body.querySelector('img[src^="/uploads/"]')),
      junk: ['<script', '<style', 'mso-', 'o:p', 'onerror', 'javascript:'].filter((t) => html.toLowerCase().includes(t)),
      pwned: typeof window.__pwned !== 'undefined'
    };
  });
  assert(audit, '.blog-body missing on public page');
  for (const key of ['h1', 'bold', 'italic', 'underline', 'coloredSpan', 'centered', 'link', 'ul', 'olStart', 'tableCell', 'img']) {
    assert(audit[key], `public page missing: ${key}`);
  }
  assert(audit.junk.length === 0, `public page junk: ${audit.junk.join(', ')}`);
  assert(!audit.pwned, 'script executed on public page');
});

await check('plain-text-only clipboard still pastes without breaking the editor', async () => {
  await openBlogs(page);
  await openAdd(page);
  const writeErr = await page.evaluate(async (plain) => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': new Blob([plain], { type: 'text/plain' }) })]);
      return null;
    } catch (err) {
      return err.message;
    }
  }, PLAIN_TEXT);
  assert(!writeErr, `clipboard.write(text/plain) failed: ${writeErr}`);

  const editor = await field(page, 'Content');
  await editor.click();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up('Control');
  await new Promise((r) => setTimeout(r, 600));

  const state = await editorAudit(page);
  assert(state, 'editor lost after plain-text paste');
  assert(state.html.includes('Pasted plain text line one'), `plain text not inserted: "${state.html.slice(0, 120)}"`);
  assert(!state.hasScript && !state.pwned, 'junk appeared after plain paste');
  await page.click('.admin-modal .admin-modal-close'); // discard this draft
  await page.waitForSelector('.admin-modal', { hidden: true });
});

/* ============================= D. REGRESSION ============================= */
section('D. CRUD REGRESSION');

await check('blogs table lists records', async () => {
  await openBlogs(page);
  const rows = await page.$$eval('.crud-table tbody tr', (rs) => rs.length);
  assert(rows >= 3, `expected >= 3 rows, found ${rows}`);
});

await check('WYSIWYG content round-trips through save', async () => {
  const token = await adminToken(page);
  const { body } = await apiJson('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
  const row = (body || []).find((b) => b.slug === SEO_POST.slug);
  assert(row, 'blog missing');
  assert(row.content.includes('Sensory play helps children'), 'editor content did not persist');
});

await check('duplicate slug shows an error and does not create a row', async () => {
  await openAdd(page);
  await typeInto(page, 'Title', 'Duplicate Of Seeded Post');
  await typeInto(page, 'Slug', 'understanding-sensory-processing', { clear: true });
  submitModal(page);
  const error = await page.waitForSelector('.admin-error', { timeout: 10000 }).catch(() => null);
  assert(error, 'no error shown for duplicate slug');
  const text = await error.evaluate((n) => n.textContent);
  assert(/duplicate/i.test(text), `error = "${text}"`);
  const stillOpen = await page.$('.admin-modal');
  assert(stillOpen, 'modal should stay open on failure');
  await page.click('.admin-modal .admin-modal-close');
  await page.waitForSelector('.admin-modal', { hidden: true });
});

await check('edit updates an existing record', async () => {
  await openBlogs(page);
  await openEditByTitle(page, SEO_POST.title);
  await typeInto(page, 'Title', ' (Edited)', { clear: false });
  submitModal(page);
  await modalClosed(page);
  const text = await page.$eval('.crud-table tbody', (t) => t.textContent);
  assert(text.includes('A Complete Guide to Sensory Play (Edited)'), 'edited title not in table');
});

await check('delete removes a record (confirm dialog accepted)', async () => {
  await deleteByTitle(page, 'Paste Fidelity Test');
  await page.waitForFunction(() => ![...document.querySelectorAll('.crud-table tbody tr')].some((r) => r.textContent.includes('Paste Fidelity Test')), { timeout: 15000 });
});

await check('no uncaught page errors during the suite', async () => {
  assert(pageErrors.length === 0, pageErrors.join(' | '));
});

/* -------------------------------- cleanup -------------------------------- */
const token = await adminToken(page);
await deleteBlogBySlug(token, SEO_POST.slug);
await deleteBlogBySlug(token, 'a-complete-guide-to-sensory-play'); // artifact of older partial runs
await deleteBlogBySlug(token, 'manual-slug-keeps');
await deleteBlogBySlug(token, 'renamed-from-cleared-slug');
await deleteBlogBySlug(token, PASTE_SLUG);

await browser.close();

/* --------------------------------- report -------------------------------- */
console.log('\n================ RESULTS ================');
for (const s of sections) {
  console.log(`${s.name.padEnd(34)} ${s.passed} passed${s.failed ? `, ${s.failed} FAILED` : ''}`);
}
console.log(`\nTOTAL: ${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
