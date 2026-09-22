// About-page style audit — simulates a hard refresh:
// 1. SSR-renders the FULL app at /about (Layout + Header + PageHero + sections)
// 2. Walks the real import graph from main.jsx to find every stylesheet that loads
// 3. Verifies every class in the rendered HTML has a matching CSS rule
// 4. Checks the design tokens the rules depend on exist in :root
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, 'src');

/* ---------- 1. Collect stylesheets reachable from main.jsx (what a fresh load fetches) ---------- */
const cssFiles = new Set();
const visited = new Set();
const resolveExt = (p) => {
  for (const cand of [p, `${p}.jsx`, `${p}.js`, `${p}.mjs`, `${p}.css`]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
};
const walk = (file) => {
  if (visited.has(file)) return;
  visited.add(file);
  const code = fs.readFileSync(file, 'utf8');
  const importRe = /import\s+[^'"]*['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(code))) {
    const spec = m[1];
    if (spec.endsWith('.css')) {
      const r = resolveExt(path.join(path.dirname(file), spec));
      if (r) cssFiles.add(r);
      continue;
    }
    if (spec.startsWith('.')) {
      const r = resolveExt(path.join(path.dirname(file), spec));
      if (r && /\.(jsx|js|mjs)$/.test(r)) walk(r);
    }
    // bare imports (node_modules) bring no project CSS
  }
};
walk(path.join(SRC, 'main.jsx'));
console.log(`Stylesheets that load on /about (${cssFiles.size}):`);
[...cssFiles].forEach((f) => console.log('  -', path.relative(ROOT, f)));

const allCss = [...cssFiles].map((f) => fs.readFileSync(f, 'utf8')).join('\n');

/* ---------- 2. Render the full app at /about ---------- */
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { AppProvider } = await vite.ssrLoadModule('/src/context/AppContext.jsx');
const App = (await vite.ssrLoadModule('/src/App.jsx')).default;
const html = renderToStaticMarkup(
  React.createElement(AppProvider, null,
    React.createElement(MemoryRouter, { initialEntries: ['/about'] },
      React.createElement(Routes, null, React.createElement(Route, { path: '/about', element: React.createElement(App) }))))
);

// classes used anywhere in the rendered document
const used = new Set();
for (const m of html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach((c) => c && used.add(c));

/* ---------- 3. Check each class has a rule in the loading stylesheets ---------- */
// Classes that are JS hooks or set from inline styles / doodle internals — no rule needed
const JS_HOOKS = new Set(['about-page']);
const unstyled = [];
const styled = [];
for (const cls of [...used].sort()) {
  if (JS_HOOKS.has(cls)) continue;
  const re = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`);
  (re.test(allCss) ? styled : unstyled).push(cls);
}

/* ---------- 4. Token checks for the rules About depends on ---------- */
const tokenChecks = [
  ['--color-navy', /--color-navy:/],
  ['--color-navy-light', /--color-navy-light:/],
  ['--color-pastel-lilac', /--color-pastel-lilac:/],
  ['--color-pastel-peach', /--color-pastel-peach:/],
  ['--color-surface-container-lowest', /--color-surface-container-lowest:/],
  ['--spacing-xl', /--spacing-xl:/],
  ['--shadow-lg', /--shadow-lg:/],
];

let failures = 0;
console.log(`\nRendered classes: ${used.size}  |  styled: ${styled.length}  |  JS hooks (skipped): ${JS_HOOKS.size}`);
if (unstyled.length) {
  failures += unstyled.length;
  console.log('\nCLASSES WITH NO CSS RULE:');
  unstyled.forEach((c) => console.log('  MISSING .', c));
} else {
  console.log('Every rendered class resolves to a CSS rule ✓');
}

console.log('\nDesign tokens:');
for (const [name, re] of tokenChecks) {
  const ok = re.test(allCss);
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

/* ---------- 5. Per-section confirmation (the sections the user asked about) ---------- */
console.log('\nPer-section styling confirmation:');
const sectionChecks = [
  ['Hero (lilac, PageHero)', /page-hero bg-pastel-lilac/],
  ['Philosophy section', /about-philosophy section-padding/],
  ['Philosophy blob image', /image-blob-mask/],
  ['Values list', /values-list/],
  ['Vision & Mission (lilac)', /bg-pastel-lilac section-padding[^"]*"[^>]*>\s*<div class="cloud-divider cloud-top fill-white"/],
  ['Vision card', /vision-card/],
  ['Mission card', /mission-card/],
  ['Founder band (peach)', /founder-section bg-pastel-peach/],
  ['Founder wave (white fill)', /cloud-divider cloud-bottom fill-surface-lowest/],
  ['Co-founder band (white, image-left)', /founder-section co-founder-section bg-white/],
  ['Global CTA (peach) present', /cta-section-wrapper/],
  ['Footer present', /global-footer|site-footer|footer/],
];
for (const [name, re] of sectionChecks) {
  const ok = re.test(html);
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

console.log(`\n${failures === 0 ? 'ABOUT PAGE FULLY STYLED — ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
await vite.close();
process.exitCode = failures === 0 ? 0 : 1;
