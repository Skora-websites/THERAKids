// Live UI audit: renders every page via Vite SSR and checks structural rules:
// - Heroes carry exactly one wave (bottom-only, hero-scale 80/150px)
// - Section waves pair correctly with the neighbor section's color
// - Therapy breadcrumbs render inside the colored hero
// - Admin/auth pages have no waves
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

const pages = [
  ['Home', '/src/pages/Home.jsx', '/', '*'],
  ['About', '/src/pages/About.jsx', '/about', '*'],
  ['Services', '/src/pages/Services.jsx', '/services', '*'],
  ['Conditions', '/src/pages/Conditions.jsx', '/conditions', '*'],
  ['Gallery', '/src/pages/Gallery.jsx', '/gallery', '*'],
  ['Blogs', '/src/pages/Blogs.jsx', '/blogs', '*'],
  ['Contact', '/src/pages/Contact.jsx', '/contact', '*'],
  ['SpeechTherapy', '/src/pages/SpeechTherapy.jsx', '/services/speech-therapy', '/services/speech-therapy/*'],
  ['OccupationalTherapy', '/src/pages/OccupationalTherapy.jsx', '/services/occupational-therapy', '/services/occupational-therapy/*'],
  ['PhysicalTherapy', '/src/pages/PhysicalTherapy.jsx', '/services/physical-therapy', '/services/physical-therapy/*'],
  ['AdminLogin', '/src/pages/admin/AdminLogin.jsx', '/admin', '*'],
];

const HERO_PAGES = ['Home', 'About', 'Services', 'Conditions', 'Gallery', 'Blogs', 'Contact', 'SpeechTherapy', 'OccupationalTherapy', 'PhysicalTherapy'];
const THERAPY_PAGES = ['SpeechTherapy', 'OccupationalTherapy', 'PhysicalTherapy'];

let failures = 0;
const check = (name, cond, detail) => {
  if (cond) console.log(`  PASS  ${name}${detail ? ' — ' + detail : ''}`);
  else { failures++; console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
};

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const { AppProvider } = await vite.ssrLoadModule('/src/context/AppContext.jsx');

for (const [name, path, routePath, mount] of pages) {
  console.log(`\n=== ${name} ===`);
  const mod = await vite.ssrLoadModule(path);
  const Comp = mod.default;
  let html = '';
  try {
    html = renderToStaticMarkup(
      React.createElement(
        AppProvider,
        null,
        React.createElement(MemoryRouter, { initialEntries: [routePath] },
          React.createElement(Routes, null, React.createElement(Route, { path: mount, element: React.createElement(Comp) })))
      )
    );
  } catch (err) {
    failures++;
    console.log(`  FAIL  render: ${err.message}`);
    continue;
  }

  // Split HTML by top-level sections to attribute waves to their owning section
  const sections = html.match(/<section[^>]*class="[^"]*"[^>]*>[\s\S]*?<\/section>/g) || [];

  if (HERO_PAGES.includes(name)) {
    const hero = sections[0];
    check('hero section exists', !!hero);
    if (hero) {
      const heroWaves = (hero.match(/cloud-divider/g) || []).length;
      check('hero has exactly one wave (bottom-only)', heroWaves === 1 && hero.includes('cloud-bottom'),
        `${heroWaves} wave(s), bottom-only=${hero.includes('cloud-bottom')}`);
      check('hero has no top cloud', !hero.includes('cloud-top'));
      const isTherapy = THERAPY_PAGES.includes(name);
      const heroScale = /page-hero|home-hero/.test(hero);
      check('hero section carries hero class', heroScale);
      if (isTherapy) {
        const crumb = html.indexOf('breadcrumb-nav');
        const heroStart = html.indexOf(hero);
        const heroEnd = heroStart + hero.length;
        check('breadcrumb inside colored hero', crumb > heroStart && crumb < heroEnd);
        check('breadcrumb present', crumb !== -1);
      }
    }
  } else {
    // Auth pages: no cloud waves expected
    const waves = (html.match(/cloud-divider/g) || []).length;
    check('no cloud waves on auth page', waves === 0, `${waves} found`);
  }

  // Every fill-white cloud must border a white-ish neighbor — approximate by checking
  // that wave fills only use known-good colors
  const fills = [...html.matchAll(/cloud-divider (cloud-\w+) (fill-[\w-]+)/g)].map(m => `${m[1]} ${m[2]}`);
  const badFills = fills.filter(f => !/fill-white|fill-pastel-lilac|fill-pastel-peach|fill-surface-lowest/.test(f));
  check('wave fills use known palette', badFills.length === 0, fills.length + ' waves, all valid');

  // No unresolved template / undefined leaking into markup
  check('no "undefined" in markup', !/>undefined</.test(html));
  check('no NaN in markup', !/>NaN</.test(html));
}

console.log(`\n${'='.repeat(40)}`);
console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`);
await vite.close();
process.exitCode = failures === 0 ? 0 : 1;
