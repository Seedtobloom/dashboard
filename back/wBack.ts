import type { Env } from './types';
import { requireAdminAuth, verifyClientToken, getTokenFromRequest } from './auth';
import { handleProjects } from './api/projects';
import { handleSteps } from './api/steps';
import { handleMessages } from './api/messages';
import { handleTokens } from './api/tokens';
import { handleFiles } from './api/files';
import { handleNotifications, getEmailHistory } from './api/notifications';
import { handleClientApi } from './api/client';
import { errorResponse } from './utils';

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

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

  // ── CLIENT PORTAL /p/{token} — legacy redirect support ─────────────────────
  // The front worker serves client.html as SPA. The back worker only handles:
  //   - /p/{token}/message  (legacy form POST, kept for compatibility)
  //   - /api/client/*       (new public SPA API)
  if (pathname.startsWith('/p/')) {
    const msgMatch = pathname.match(/^\/p\/([a-f0-9]{64})\/message$/);
    if (msgMatch && request.method === 'POST') {
      return handleLegacyClientMessage(request, env, msgMatch[1]);
    }
    // GET /p/{token} — the front worker serves client.html; if somehow hitting back, redirect
    return Response.redirect(new URL(request.url).toString(), 302);
  }

  // ── PUBLIC CLIENT API /api/client/{token} ───────────────────────────────────
  if (pathname.startsWith('/api/client/')) {
    return handleClientApi(request, env, url);
  }

  // ── API /api — requires admin auth ─────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const authError = requireAdminAuth(request, env);
    if (authError) return authError;
    return handleApiRoutes(request, env, url);
  }

  // ── Root / and /admin — redirect (front worker handles these) ──────────────
  if (pathname === '/' || pathname === '' || pathname.startsWith('/admin')) {
    const frontUrl = env.PORTAL_BASE_URL
      ? env.PORTAL_BASE_URL.replace('bloom-portal-back', 'bloom-portal-front')
      : '/admin';
    return Response.redirect(frontUrl, 302);
  }

  return errorResponse('Not found', 404);
}

// ── Legacy client message POST (form-encoded from old client.html) ────────────

async function handleLegacyClientMessage(request: Request, env: Env, token: string): Promise<Response> {
  const clientToken = await verifyClientToken(token, env);
  if (!clientToken) return errorResponse('Invalid token', 403);

  const { getProject, addMessage } = await import('./kv');
  const { generateId } = await import('./utils');

  const project = await getProject(env, clientToken.projectId);
  if (!project) return errorResponse('Project not found', 404);

  let content = '';
  const contentType = request.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    const body = await request.json() as { content: string };
    content = body.content?.trim() ?? '';
  } else {
    const form = await request.formData();
    content = (form.get('content') as string)?.trim() ?? '';
  }

  if (!content) return errorResponse('content is required');

  const message = {
    id: generateId(),
    projectId: project.id,
    author: 'client' as const,
    content,
    createdAt: new Date().toISOString(),
    readByClient: true,
    readByAdmin: false,
  };

  await addMessage(env, message);

  if (contentType.includes('application/json')) {
    return new Response(JSON.stringify({ success: true, message }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.redirect(request.headers.get('Referer') ?? `/p/${token}`, 303);
}

// ── Admin API routes ──────────────────────────────────────────────────────────

async function handleApiRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  // Projects CRUD
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

  // Tokens (project-scoped)
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens/)) {
    return handleTokens(request, env, url);
  }

  // Tokens (token-scoped revoke)
  if (pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/)) {
    return handleTokens(request, env, url);
  }

  // Files
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
    return handleFiles(request, env, url);
  }

  // Manual notifications
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
    return handleNotifications(request, env, url);
  }

  // Email history
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
    return getEmailHistory(request, env, url);
  }

  return errorResponse('Not found', 404);
}
