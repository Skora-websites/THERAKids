// Mobile/responsive audit: finds className tokens used in JSX that have no CSS
// definition anywhere in the project (the class of bug that silently unstyled
// the About page). Static className="..." strings only — template literals are
// skipped since their values resolve at runtime.
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src');

// 1. Collect all class selectors from CSS files
const cssFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.css')) cssFiles.push(p);
  }
};
walk(root);

const definedClasses = new Set();
const classSelectorRe = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8');
  // strip comments so commented-out selectors don't count as defined
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(classSelectorRe)) definedClasses.add(m[1]);
}

// 2. Collect static className tokens from JSX
const knownUtilityExceptions = new Set([
  'open', 'active', 'reverse', 'h-full', // state/toggle classes & JS-conditionals
]);
const missing = new Map(); // token -> [files]
const jsxFiles = [];
walkJsx(root);
function walkJsx(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsx(p);
    else if (entry.name.endsWith('.jsx')) jsxFiles.push(p);
  }
}
for (const file of jsxFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/className="([^"]*)"/g)) {
    for (const token of m[1].split(/\s+/)) {
      if (!token || token.includes('/') || /\d+\/\d+/.test(token)) continue; // bg-white/60 style
      if (definedClasses.has(token) || knownUtilityExceptions.has(token)) continue;
      if (token === 'grid' && definedClasses.has('grid')) continue;
      if (!missing.has(token)) missing.set(token, []);
      missing.get(token).push(path.relative(root, file));
    }
  }
}

console.log('=== Undefined className tokens (static strings only) ===');
if (missing.size === 0) console.log('NONE');
for (const [token, files] of [...missing].sort((a, b) => a[0].localeCompare(b[0]))) {
  const uniq = [...new Set(files)];
  console.log(`${token.padEnd(22)} -> ${uniq.join(', ')}`);
}

// 3. Fixed-width rules that could overflow a 360-375px viewport
console.log('\n=== Fixed widths > 340px (potential 360px-viewport overflow) ===');
let overflowRisk = 0;
for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8');
  for (const m of css.matchAll(/^\.([a-zA-Z0-9_-]+)\s*\{[^}]*?width:\s*(\d{3,})px/gm)) {
    if (parseInt(m[2], 10) > 340) {
      console.log(`.${m[1]} { width: ${m[2]}px }  (${path.relative(root, file)})`);
      overflowRisk++;
    }
  }
}
if (overflowRisk === 0) console.log('NONE');

// 4. Page-level horizontal-clip check: every page root should live inside a clipping ancestor
console.log('\n=== Overflow clips found (body/main/page-level) ===');
const clips = [];
for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/(body|main|html)\s*\{([^}]*)\}/g)) {
    if (/overflow-x:\s*hidden|overflow:\s*hidden/.test(m[2])) clips.push(`${m[1]} (${path.relative(root, file)})`);
  }
}
console.log(clips.length ? clips.join('\n') : 'NONE — decorative negative offsets rely on element-level clipping');
