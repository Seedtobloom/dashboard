// Front Worker — serves static admin UI
// Wrangler bundles imported text assets as strings via the bundler.

// @ts-ignore — wrangler bundler resolves these as raw strings
import indexHtml from './index.html';
// @ts-ignore
import styleCss from './style.css';
// @ts-ignore
import adminCss from './admin.css';
// @ts-ignore
import appJs from './app.js';
// @ts-ignore
import clientCss from './client.css';
// @ts-ignore
import clientJs from './client.js';
// @ts-ignore
import clientHtml from './client.html';

export interface FrontEnv {
  BACK_WORKER_URL?: string;
}

export async function handleRequest(request: Request, _env: FrontEnv): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Root → redirect to /admin
  if (pathname === '/' || pathname === '') {
    return Response.redirect(new URL('/admin', request.url).toString(), 302);
  }

  // Static assets
  if (pathname === '/static/style.css') {
    return new Response(styleCss as string, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (pathname === '/static/admin.css') {
    return new Response(adminCss as string, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (pathname === '/static/app.js') {
    return new Response(appJs as string, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (pathname === '/static/client.css') {
    return new Response(clientCss as string, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (pathname === '/static/client.js') {
    return new Response(clientJs as string, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (pathname === '/static/client.html') {
    return new Response(clientHtml as string, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }

  // Admin SPA — all /admin* routes serve index.html
  if (pathname.startsWith('/admin')) {
    return new Response(indexHtml as string, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  return new Response('Not found', { status: 404 });
}
