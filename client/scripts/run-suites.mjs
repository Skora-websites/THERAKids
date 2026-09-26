// Runs both browser suites against one dev server, in one command:
//
//   npm test                                     # auto-detects a running dev server
//   BASE_URL=http://localhost:5174 npm test       # or point at one explicitly
//
// Prerequisites: the client dev server (client: npm run dev) and the API
// (server: npm start). The blog suite needs the API for its admin login and CRUD
// round-trips; the marquee suite only needs the rendered page.
//
// Each suite prints its own results and exits non-zero on failure; this runner
// passes the resolved BASE_URL/API_URL down to both and summarises at the end.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.API_URL || 'http://localhost:5005';
const PORTS = [5173, 5174, 5175]; // vite picks the next free port when one is taken

const SUITES = [
  { label: 'testimonial marquee (seam, pace, touch)', script: 'scripts/testimonial-marquee.test.mjs', needsApi: false },
  { label: 'SEO (tab, static pages, services, blogs)', script: 'scripts/seo.test.mjs', needsApi: true },
  { label: 'blog features (SEO, slug, paste, CRUD)', script: 'scripts/blog-features.test.mjs', needsApi: true }
];

const alive = async (url) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
};

const resolveBase = async () => {
  if (process.env.BASE_URL) return (await alive(`${process.env.BASE_URL}/`)) ? process.env.BASE_URL : null;
  for (const port of PORTS) {
    const url = `http://localhost:${port}`;
    if (await alive(`${url}/`)) return url;
  }
  return null;
};

const runSuite = (script, base) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(ROOT, script)], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, BASE_URL: base, API_URL: API }
    });
    child.on('exit', (code) => resolve(code ?? 1));
  });

/* ------------------------------ preflight ------------------------------ */
const base = await resolveBase();
if (!base) {
  const tried = process.env.BASE_URL
    ? `BASE_URL=${process.env.BASE_URL} did not respond`
    : `No dev server answered on ${PORTS.map((p) => `http://localhost:${p}`).join(', ')}`;
  console.error(
    `\n${tried}.\n` +
      `Start one first:  cd client && npm run dev\n` +
      `Or point the suites at a running instance:  BASE_URL=http://localhost:1234 npm test\n`
  );
  process.exit(1);
}

const apiUp = await alive(`${API}/api/settings`);
console.log(`\nbase url : ${base}`);
console.log(`api url  : ${API}${apiUp ? '' : '  (unreachable)'}`);
if (!apiUp) {
  console.warn('warning: the API is not responding, so the blog suite will fail. Start it with:  cd server && npm start');
}

/* -------------------------------- suites -------------------------------- */
const results = [];
for (const suite of SUITES) {
  if (suite.needsApi && !apiUp) {
    results.push({ label: suite.label, skipped: true });
    continue;
  }
  console.log(`\n${'='.repeat(58)}\n${suite.label}\n${'='.repeat(58)}`);
  results.push({ label: suite.label, code: await runSuite(suite.script, base) });
}

/* -------------------------------- report -------------------------------- */
console.log(`\n${'='.repeat(58)}\nSUITES\n${'='.repeat(58)}`);
for (const r of results) {
  const status = r.skipped ? 'SKIPPED (API down)' : r.code === 0 ? 'PASSED' : `FAILED (exit ${r.code})`;
  console.log(`${status.padEnd(20)} ${r.label}`);
}

const bad = results.filter((r) => r.skipped || r.code !== 0);
console.log(`\n${results.length - bad.length}/${results.length} suites passed`);
process.exitCode = bad.length === 0 ? 0 : 1;
