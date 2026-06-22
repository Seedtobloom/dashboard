import type { Env } from './lib/types';
import { handleProjects } from './lib/api/projects';
import { handleSteps } from './lib/api/steps';
import { handleTasks } from './lib/api/tasks';
import { handleMessages, handleConversations } from './lib/api/messages';
import { handleTokens } from './lib/api/tokens';
import { handleFiles } from './lib/api/files';
import { handleNotifications, getEmailHistory, handleTestEmail } from './lib/api/notifications';
import { handleClientApi } from './lib/api/client';
import { errorResponse } from './lib/utils';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Secret partagé front↔back : le back n'est jamais joignable directement.
    if (!env.INTERNAL_SECRET || request.headers.get('X-Internal-Auth') !== env.INTERNAL_SECRET) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Client API (public, token-based auth handled inside handler)
      if (pathname.match(/^\/api\/client\//)) {
        return handleClientApi(request, env, url);
      }

      // Projects
      if (pathname === '/api/projects' || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
        return handleProjects(request, env, url);
      }

      // Steps
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
        return handleSteps(request, env, url);
      }

      // Tasks (espace partenaire)
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tasks/)) {
        return handleTasks(request, env, url);
      }

      // Messages
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
        return handleMessages(request, env, url);
      }

      // Conversations admin (fil unifié par email client)
      if (pathname === '/api/conversations' || pathname.match(/^\/api\/conversations\//)) {
        return handleConversations(request, env, url);
      }

      // Tokens
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) ||
          pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/) ||
          pathname.match(/^\/api\/tokens\/[a-f0-9]{64}$/) ||
          pathname === '/api/tokens/all' ||
          pathname === '/api/tokens/client' ||
          pathname.match(/^\/api\/tokens\/client\/.+$/)) {
        return handleTokens(request, env, url);
      }

      // Files
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
        return handleFiles(request, env, url);
      }

      // Email de test (depuis les Réglages)
      if (pathname === '/api/test-email') {
        return handleTestEmail(request, env);
      }

      // Notifications
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
        return handleNotifications(request, env, url);
      }

      // Email history
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
        return getEmailHistory(request, env, url);
      }

      // Hub partage (GET/PUT)
      if (pathname === '/api/hub') {
        const json = { 'Content-Type': 'application/json' };
        if (request.method === 'GET') {
          const data = await env.BLOOM_KV.get('hub_data', 'json') || { sections: [] };
          return new Response(JSON.stringify(data), { headers: json });
        }
        if (request.method === 'PUT') {
          const body = await request.json() as Record<string, unknown>;
          await env.BLOOM_KV.put('hub_data', JSON.stringify(body));
          return new Response(JSON.stringify({ ok: true }), { headers: json });
        }
        return errorResponse('Method not allowed', 405);
      }

      // Réglages studio (GET/PUT)
      if (pathname === '/api/settings') {
        const json = { 'Content-Type': 'application/json' };
        if (request.method === 'GET') {
          const data = await env.BLOOM_KV.get('studio_settings', 'json') || {};
          return new Response(JSON.stringify(data), { headers: json });
        }
        if (request.method === 'PUT') {
          const body = await request.json() as Record<string, unknown>;
          await env.BLOOM_KV.put('studio_settings', JSON.stringify(body));
          return new Response(JSON.stringify(body), { headers: json });
        }
        return errorResponse('Method not allowed', 405);
      }

      return errorResponse('Not found', 404);
    } catch (err) {
      console.error('Back worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
