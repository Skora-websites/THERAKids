// Diagnostic: SSR-render every page through Vite's module runner.
// Any module that throws during render (undefined component, bad import, etc.) fails here,
// pinpointing the page that blanks the browser.
//
// Pages are wrapped in MemoryRouter + AppProvider to mirror how App.jsx composes them in
// the browser — without those, pages using useNavigate/useParams/useAppContext would fail
// here but work fine in the app.
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

const pages = [
  ['Home', '/src/pages/Home.jsx', '/'],
  ['About', '/src/pages/About.jsx', '/about'],
  ['Services', '/src/pages/Services.jsx', '/services'],
  ['Conditions', '/src/pages/Conditions.jsx', '/conditions'],
  ['Gallery', '/src/pages/Gallery.jsx', '/gallery'],
  ['Blogs', '/src/pages/Blogs.jsx', '/blogs'],
  ['BlogPost', '/src/pages/BlogPost.jsx', '/blogs/sample-slug', '/blogs/:slug'],
  ['Contact', '/src/pages/Contact.jsx', '/contact'],
  ['SpeechTherapy', '/src/pages/SpeechTherapy.jsx', '/services/speech-therapy'],
  ['OccupationalTherapy', '/src/pages/OccupationalTherapy.jsx', '/services/occupational-therapy'],
  ['PhysicalTherapy', '/src/pages/PhysicalTherapy.jsx', '/services/physical-therapy'],
  ['AdminLogin', '/src/pages/admin/AdminLogin.jsx', '/admin'],
  // Mounted under the same parent pattern App.jsx uses, because AdminDashboard's inner
  // <Routes> relies on descendant routing against the /admin/dashboard/* remainder.
  ['AdminDashboard', '/src/pages/admin/AdminDashboard.jsx', '/admin/dashboard', '/admin/dashboard/*'],
];

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

// react-router-dom is SSR-externalized by Vite, so a plain import here shares the same
// module instance the pages receive. AppContext is app source, so it must come through the
// runner to match what the pages import.
const { AppProvider } = await vite.ssrLoadModule('/src/context/AppContext.jsx');

const wrap = (Comp, routePath, mount) =>
  React.createElement(
    AppProvider,
    null,
    React.createElement(
      MemoryRouter,
      { initialEntries: [routePath] },
      React.createElement(Routes, null, React.createElement(Route, { path: mount, element: React.createElement(Comp) }))
    )
  );

for (const [name, path, routePath, mount = '*'] of pages) {
  try {
    const mod = await vite.ssrLoadModule(path);
    const Comp = mod.default;
    if (typeof Comp !== 'function') {
      console.log(`FAIL  ${name}: default export is ${typeof Comp}`);
      continue;
    }
    const html = renderToStaticMarkup(wrap(Comp, routePath, mount));
    console.log(`OK    ${name} (${html.length} chars)`);
  } catch (err) {
    console.log(`FAIL  ${name}: ${err.message}`);
    if (err.stack) console.log(err.stack.split('\n').slice(1, 5).join('\n'));
  }
}

await vite.close();
