/* One-off: keeps only the first KEEP blog objects in FALLBACK_DATA.blogs and
   drops the rest, so the static (frontend-only) deploy publishes 2 articles.
   Bracket-matches with string/escape awareness so content HTML is untouched. */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../src/data/fallbackData.js', import.meta.url);
const KEEP = 2;

const src = readFileSync(FILE, 'utf8');
const anchor = src.indexOf('"blogs": [');
if (anchor < 0) throw new Error('blogs key not found');
const open = src.indexOf('[', anchor);

// Scan to the matching ']', respecting quoted strings and escapes.
let depth = 0, inStr = null, end = -1;
for (let i = open; i < src.length; i++) {
  const ch = src[i];
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) throw new Error('unbalanced brackets');

// Split the array body into top-level {...} objects.
const body = src.slice(open + 1, end);
const objs = [];
depth = 0; inStr = null; let start = -1;
for (let i = 0; i < body.length; i++) {
  const ch = body[i];
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'") { inStr = ch; continue; }
  if (ch === '{') { if (depth === 0) start = i; depth++; }
  else if (ch === '}') { depth--; if (depth === 0) objs.push(body.slice(start, i + 1)); }
}

if (objs.length <= KEEP) {
  console.log(`already ${objs.length} blogs - nothing to trim`);
  process.exit(0);
}

const kept = objs.slice(0, KEEP);
// Preserve the original leading whitespace of the first entry.
const keptBody = body.slice(0, objs[0].length) === objs[0]
  ? kept.join(',\n  ')
  : body.slice(0, objs[0].indexOf('{')) + kept.join(',\n  ');

const out = src.slice(0, open + 1) + '\n ' + keptBody + '\n ' + src.slice(end);
writeFileSync(FILE, out);
console.log(`kept ${kept.length} of ${objs.length} blogs`);
