import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

const SITE_URL = 'https://farmvexa.hdm.co.ke';

const ROUTES = [
  { path: '/', priority: '1.00' },
  { path: '/login', priority: '0.50' },
  { path: '/register', priority: '0.50' },
];

const today = new Date().toISOString().split('T')[0];

const filePath = resolve('dist/index.html');
if (!existsSync(filePath)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

let html = readFileSync(filePath, 'utf-8');

// Ensure viewport meta is present
if (!html.includes('name="viewport"')) {
  html = html.replace(
    /<head([^>]*)>/i,
    '<head$1>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  );
}

// Remove plugin-injected junk
html = html.replace(/<meta name="author" content="[^"]*"\s*\/?>\s*\n?/gi, '');
html = html.replace(/<meta name="keywords" content="[^"]*"\s*\/?>\s*\n?/gi, '');

// Remove all existing OG/Twitter blocks (we'll re-add clean ones)
html = html.replace(/<meta property="og:[^"]*"[^>]*>\s*\n?/gi, '');
html = html.replace(/<meta name="twitter:[^"]*"[^>]*>\s*\n?/gi, '');

// Fix broken inline favicon → real file
html = html.replace(
  /<link rel="icon" href="data:image\/svg\+xml[^>]*>/gi,
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
);

// Collapse triple blank lines left behind
html = html.replace(/\n{3,}/g, '\n\n');

// Insert clean OG/Twitter block before </head>
const ogBlock = `
    <meta property="og:title" content="FarmVexa - AI-Powered Farm Intelligence" />
    <meta property="og:description" content="See. Sense. Predict. Grow. Monitor crops, manage livestock, track finances with AI." />
    <meta property="og:image" content="https://farmvexa.hdm.co.ke/og-image.png" />
    <meta property="og:url" content="https://farmvexa.hdm.co.ke/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FarmVexa" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="FarmVexa - AI-Powered Farm Intelligence" />
    <meta name="twitter:description" content="See. Sense. Predict. Grow. Monitor crops, manage livestock, track finances with AI." />
    <meta name="twitter:image" content="https://farmvexa.hdm.co.ke/og-image.png" />
`;

html = html.replace('</head>', ogBlock + '</head>');
writeFileSync(filePath, html, 'utf-8');
console.log('✅ dist/index.html cleaned');

// Apply viewport + favicon fix to every sub-route
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === 'index.html' && full !== filePath) {
      let sub = readFileSync(full, 'utf-8');

      if (!sub.includes('name="viewport"')) {
        sub = sub.replace(
          /<head([^>]*)>/i,
          '<head$1>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
        );
      }

      sub = sub.replace(
        /<link rel="icon" href="data:image\/svg\+xml[^>]*>/gi,
        '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
      );

      writeFileSync(full, sub, 'utf-8');
    }
  }
}
walk(resolve('dist'));

// Write sitemap.xml
const urls = ROUTES.map(
  (r) => `    <url>
        <loc>${SITE_URL}${r.path}</loc>
        <lastmod>${today}</lastmod>
        <priority>${r.priority}</priority>
    </url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(resolve('dist/sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ dist/sitemap.xml written (${ROUTES.length} URLs)`);