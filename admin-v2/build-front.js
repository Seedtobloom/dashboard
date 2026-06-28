#!/usr/bin/env node
/**
 * Assemble admin-v2/front.js : worker front admin (proxy /api/* + sert le SPA).
 * Embarque app.css et app.js via JSON.stringify (aucun souci d'échappement).
 * Lancer : node admin-v2/build-front.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const css = fs.readFileSync(path.join(dir, 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin · Seed to Bloom</title>' +
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Alegreya:ital,wght@0,400;1,400&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">' +
  '<link rel="stylesheet" href="/admin.css"></head><body>' +
  '<div id="app"><div class="center"><div class="spin"></div></div></div>' +
  '<div class="toast" id="toast"></div><script src="/admin.js"></script></body></html>';

const handler = [
  'export default {',
  '  async fetch(request, env) {',
  '    const url = new URL(request.url);',
  "    if (url.pathname.startsWith('/api/')) {",
  '      const headers = new Headers(request.headers);',
  "      headers.set('X-Internal-Auth', env.INTERNAL_SECRET || '');",
  '      try { return await env.SERVICE_BACK.fetch(new Request(request, { headers })); }',
  "      catch (e) { return new Response('{\"error\":\"Service indisponible\"}', { status: 502, headers: { 'Content-Type': 'application/json' } }); }",
  '    }',
  "    if (url.pathname === '/admin.css') return new Response(ADMIN_CSS, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });",
  "    if (url.pathname === '/admin.js') return new Response(ADMIN_JS, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });",
  "    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });",
  '  }',
  '};',
  '',
].join('\n');

const out = handler +
  '\nconst ADMIN_CSS = ' + JSON.stringify(css) + ';\n' +
  'const ADMIN_JS = ' + JSON.stringify(js) + ';\n' +
  'const HTML = ' + JSON.stringify(html) + ';\n';

fs.writeFileSync(path.join(dir, 'front.js'), out);
console.log('admin front.js écrit (' + out.length + ' octets)');
execSync('node --check ' + JSON.stringify(path.join(dir, 'front.js')));
console.log('front.js : syntaxe OK');
// vérifie aussi app.js isolément
execSync('node --check ' + JSON.stringify(path.join(dir, 'app.js')));
console.log('app.js : syntaxe OK');
