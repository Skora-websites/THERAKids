// One-off check: About has no vision/mission section; Blogs renders exactly 2 cards.
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { AppProvider } = await vite.ssrLoadModule('/src/context/AppContext.jsx');
  const { default: About } = await vite.ssrLoadModule('/src/pages/About.jsx');
  const { default: Blogs } = await vite.ssrLoadModule('/src/pages/Blogs.jsx');

  const render = (el) => renderToStaticMarkup(
    React.createElement(AppProvider, null,
      React.createElement(MemoryRouter, { initialEntries: ['/'] }, el)
    )
  );

  const about = render(React.createElement(About));
  const blogs = render(React.createElement(Blogs));

  // About: lilac section should be gone
  const hasLilacBand = /bg-pastel-lilac(?!\S)/.test(about) && /vision-card|mission-card/.test(about);
  console.log('About still has vision/mission cards:', hasLilacBand);

  // About: no leftover vision/mission grid
  console.log('About has vision-mission-grid:', about.includes('vision-mission-grid'));

  // Blogs: exactly 2 cards
  const cardCount = (blogs.match(/blog-card-image/g) || []).length;
  console.log('Blogs card count:', cardCount);

  // Blogs: grid container uses the new two-up class
  console.log('Blogs uses blogs-grid two-up:', blogs.includes('class="blogs-grid"'));

  if (!hasLilacBand && !about.includes('vision-mission-grid') && cardCount === 2 && blogs.includes('class="blogs-grid"')) {
    console.log('\nALL VERIFICATIONS PASSED');
  } else {
    console.log('\nVERIFICATION FAILED');
    process.exitCode = 1;
  }
} finally {
  await vite.close();
}
