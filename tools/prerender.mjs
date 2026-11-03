// Fill <div id="app"> of each built page with its first render (SEO + fast first paint).
// Usage: node tools/prerender.mjs   (needs Playwright + Chromium installed)
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html'; else if (!path.extname(p)) p += '.html';
  const f = path.join(SITE, p);
  if (!f.startsWith(SITE) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0);
const port = server.address().port;
const browser = await chromium.launch();
const page = await browser.newPage();
await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
for (const f of ['index.html', 'products.html', 'about.html', 'contact.html', 'privacy.html']) {
  const file = path.join(SITE, f);
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/<div id="app">[\s\S]*?<\/div>\n<template id="tpl">/, '<div id="app"><!--PRERENDER--></div>\n<template id="tpl">');
  fs.writeFileSync(file, src);
  await page.goto(`http://127.0.0.1:${port}/${f}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('js-ready'));
  const inner = await page.evaluate(() => document.getElementById('app').innerHTML);
  fs.writeFileSync(file, src.replace('<!--PRERENDER-->', () => inner));
  console.log('prerendered', f, inner.length);
}
await browser.close(); server.close();
