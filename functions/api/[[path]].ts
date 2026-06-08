import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from '../../lib/types';
import { requireAdminAuth } from '../../lib/auth';
import { handleProjects } from '../../lib/api/projects';
import { handleSteps } from '../../lib/api/steps';
import { handleMessages } from '../../lib/api/messages';
import { handleTokens } from '../../lib/api/tokens';
import { handleFiles } from '../../lib/api/files';
import { handleNotifications, getEmailHistory } from '../../lib/api/notifications';
import { handleClientApi } from '../../lib/api/client';
import { errorResponse } from '../../lib/utils';

export async function onRequest(ctx: EventContext<Env, 'path', unknown>): Promise<Response> {
  const { request, env } = ctx;

  // ── CORS preflight ──────────────────────────────────────────────────────────
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

  // Use the real URL for routing (Pages Functions preserves the full URL)
  const reqUrl = new URL(request.url);

  // ── PUBLIC CLIENT API /api/client/{token} (no admin auth) ───────────────────
  if (reqUrl.pathname.match(/^\/api\/client\/[a-f0-9]{64}/)) {
    return addSecurityHeaders(await handleClientApi(request, env, reqUrl));
  }

  // ── Admin auth required for all other /api/ routes ──────────────────────────
  const authError = requireAdminAuth(request, env);
  if (authError) return addSecurityHeaders(authError);

  return addSecurityHeaders(await handleApiRoutes(request, env, reqUrl));
}

async function handleApiRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  // Projects
  if (pathname === '/api/projects' || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
    return handleProjects(request, env, url);
  }

  // Steps
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
    return handleSteps(request, env, url);
  }

  // Messages
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
    return handleMessages(request, env, url);
  }

  // Tokens (project-scoped or global revoke)
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) ||
      pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/)) {
    return handleTokens(request, env, url);
  }

  // Files
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
    return handleFiles(request, env, url);
  }

  // Notifications / email
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
    return handleNotifications(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
    return getEmailHistory(request, env, url);
  }

  return errorResponse('Not found', 404);
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, headers });
}
