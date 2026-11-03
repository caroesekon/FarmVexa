import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve('dist/index.html');
let html = readFileSync(filePath, 'utf-8');

// Remove plugin-injected junk
html = html.replace(/<meta name="author" content="[^"]*"\s*\/?>\s*\n?/gi, '');
html = html.replace(/<meta name="keywords" content="[^"]*"\s*\/?>\s*\n?/gi, '');

// Remove all existing OG/Twitter blocks (we'll re-add clean ones)
html = html.replace(/<meta property="og:[^"]*"[^>]*>\s*\n?/gi, '');
html = html.replace(/<meta name="twitter:[^"]*"[^>]*>\s*\n?/gi, '');

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
console.log('✅ dist/index.html SEO cleaned');