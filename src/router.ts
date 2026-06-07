import type { Env } from './types';
import { requireAdminAuth, verifyClientToken, getTokenFromRequest } from './auth';
import { handleProjects } from './api/projects';
import { handleSteps } from './api/steps';
import { handleMessages } from './api/messages';
import { handleTokens } from './api/tokens';
import { handleFiles } from './api/files';
import { handleNotifications, getEmailHistory } from './api/notifications';
import { getProject } from './kv';
import { renderClientView } from './views/client';
import { renderAdminDashboard, renderAdminProject } from './views/admin';
import { renderLoginPage } from './views/login';
import { errorResponse, htmlResponse } from './utils';

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

  // ── CLIENT PORTAL /p/{token} ────────────────────────────────────────────────
  if (pathname.startsWith('/p/')) {
    return handleClientPortal(request, env, url);
  }

  // ── ADMIN LOGIN PAGE ────────────────────────────────────────────────────────
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return htmlResponse(renderLoginPage());
  }

  // ── ADMIN AREA /admin ───────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const authError = requireAdminAuth(request, env);
    if (authError) return authError;
    return handleAdminRoutes(request, env, url);
  }

  // ── API /api ────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const authError = requireAdminAuth(request, env);
    if (authError) return authError;
    return handleApiRoutes(request, env, url);
  }

  // ── Root redirect ───────────────────────────────────────────────────────────
  if (pathname === '/' || pathname === '') {
    return Response.redirect(new URL('/admin', request.url).toString(), 302);
  }

  return errorResponse('Not found', 404);
}

// ── Client portal ─────────────────────────────────────────────────────────────

async function handleClientPortal(request: Request, env: Env, url: URL): Promise<Response> {
  // POST /p/{token}/message — client sends a message
  const msgMatch = url.pathname.match(/^\/p\/([a-f0-9]{64})\/message$/);
  if (msgMatch && request.method === 'POST') {
    return handleClientMessage(request, env, msgMatch[1]);
  }

  // GET /p/{token}
  const token = getTokenFromRequest(request);
  if (!token) return htmlResponse(renderTokenError(), 403);

  const clientToken = await verifyClientToken(token, env);
  if (!clientToken) return htmlResponse(renderTokenError(), 403);

  const project = await getProject(env, clientToken.projectId);
  if (!project) return htmlResponse(renderTokenError(), 404);

  const html = await renderClientView(project, token, env);

  // Set 7-day cookie so returning visitors don't need the URL token
  return htmlResponse(html, 200, {
    'Set-Cookie': `bloom_token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 3600}; Path=/`,
  });
}

async function handleClientMessage(request: Request, env: Env, token: string): Promise<Response> {
  const clientToken = await verifyClientToken(token, env);
  if (!clientToken) return htmlResponse(renderTokenError(), 403);

  const project = await getProject(env, clientToken.projectId);
  if (!project) return htmlResponse(renderTokenError(), 404);

  let content = '';
  const contentType = request.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    const body = await request.json() as { content: string };
    content = body.content?.trim() ?? '';
  } else {
    const form = await request.formData();
    content = (form.get('content') as string)?.trim() ?? '';
  }

  if (!content) {
    return errorResponse('content is required');
  }

  // Import inline to avoid circular deps
  const { addMessage } = await import('./kv');
  const { generateId } = await import('./utils');

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

  // If JSON request, return JSON (used by fetch from client JS)
  if (contentType.includes('application/json')) {
    return new Response(JSON.stringify({ success: true, message }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Form POST redirect back to portal
  return Response.redirect(request.headers.get('Referer') ?? `/p/${token}`, 303);
}

// ── Admin routes ──────────────────────────────────────────────────────────────

async function handleAdminRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  // GET /admin — dashboard
  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    const html = await renderAdminDashboard(env);
    return htmlResponse(html);
  }

  // GET /admin/projects/{id}
  const projectMatch = url.pathname.match(/^\/admin\/projects\/([a-f0-9]{32})$/);
  if (projectMatch && request.method === 'GET') {
    const project = await getProject(env, projectMatch[1]);
    if (!project) return errorResponse('Project not found', 404);
    const html = await renderAdminProject(project, env);
    return htmlResponse(html);
  }

  return errorResponse('Not found', 404);
}

// ── API routes ────────────────────────────────────────────────────────────────

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

function renderTokenError(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lien invalide · Seed to Bloom</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { min-height: 100vh; background: #f5f0e8; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
  .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 32px rgba(26,39,68,0.08); }
  .icon { font-size: 48px; margin-bottom: 20px; }
  h1 { font-family: 'Playfair Display', serif; color: #1a2744; font-size: 22px; margin-bottom: 16px; }
  p { color: #666; line-height: 1.7; font-size: 15px; }
  a { color: #7fa688; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">🌸</div>
  <h1>Ce lien n'est plus valide</h1>
  <p>Le lien que vous avez utilisé a expiré ou a été révoqué.<br><br>
  Contactez <a href="mailto:hello@seedtobloom.fr">Cindy</a> pour obtenir un nouveau lien d'accès.</p>
</div>
</body>
</html>`;
}
