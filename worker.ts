import type { Env } from './lib/types';
import { requireAdminAuth, verifyClientToken } from './lib/auth';
import { handleProjects } from './lib/api/projects';
import { handleSteps } from './lib/api/steps';
import { handleMessages } from './lib/api/messages';
import { handleTokens } from './lib/api/tokens';
import { handleFiles } from './lib/api/files';
import { handleNotifications, getEmailHistory } from './lib/api/notifications';
import { handleClientApi } from './lib/api/client';
import { errorResponse } from './lib/utils';

const ERROR_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lien invalide · Seed to Bloom</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=DM+Sans:wght@400&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#f5f0e8;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,.08)}
  h1{font-family:'Playfair Display',serif;color:#1a2744;font-size:22px;margin:16px 0;font-weight:400}
  p{color:#8090a8;line-height:1.7;font-size:15px}
  a{color:#7fa688}
</style>
</head>
<body>
<div class="card">
  <div style="font-size:48px;margin-bottom:8px">🌸</div>
  <h1>Ce lien n'est plus valide</h1>
  <p>Le lien a expiré ou a été révoqué.<br><br>
  Contactez <a href="mailto:hello@seedtobloom.fr">Cindy</a> pour un nouveau lien d'accès.</p>
</div>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      let response: Response;

      // ── Client portal /p/{token} ──────────────────────────────────────────────
      if (pathname.match(/^\/p\/([a-f0-9]{64})$/)) {
        response = await handleClientPortal(request, env, pathname);
      }
      // ── Public client API /api/client/* ───────────────────────────────────────
      else if (pathname.match(/^\/api\/client\//)) {
        response = await handleClientApi(request, env, url);
      }
      // ── Admin API /api/* (requires Basic Auth) ────────────────────────────────
      else if (pathname.startsWith('/api/')) {
        const authError = requireAdminAuth(request, env);
        if (authError) return withSecurityHeaders(authError);
        response = await handleApiRoutes(request, env, url);
      }
      // ── Everything else → handled by _redirects + static assets ─────────────
      else {
        return new Response(null, { status: 404 });
      }

      return withSecurityHeaders(response);
    } catch (err) {
      console.error('Unhandled error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleClientPortal(_request: Request, env: Env, pathname: string): Promise<Response> {
  const match = pathname.match(/^\/p\/([a-f0-9]{64})$/);
  if (!match) return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  const token = match[1];
  const clientToken = await verifyClientToken(token, env);

  if (!clientToken) {
    return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const sevenDays = 7 * 24 * 60 * 60;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/client.html?token=${token}`,
      'Set-Cookie': `bloom_token=${token}; Path=/; Max-Age=${sevenDays}; HttpOnly; SameSite=Lax; Secure`,
      'Cache-Control': 'no-store',
    },
  });
}

async function handleApiRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === '/api/projects' || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
    return handleProjects(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
    return handleSteps(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
    return handleMessages(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) ||
      pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/)) {
    return handleTokens(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
    return handleFiles(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
    return handleNotifications(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
    return getEmailHistory(request, env, url);
  }

  return errorResponse('Not found', 404);
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, headers });
}
