import type { Env } from './lib/types';
import { handleProjects } from './lib/api/projects';
import { handleSteps } from './lib/api/steps';
import { handleMessages } from './lib/api/messages';
import { handleTokens } from './lib/api/tokens';
import { handleFiles } from './lib/api/files';
import { handleNotifications, getEmailHistory } from './lib/api/notifications';
import { handleClientApi } from './lib/api/client';
import { errorResponse } from './lib/utils';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

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

      // Messages
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
        return handleMessages(request, env, url);
      }

      // Tokens
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) ||
          pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/) ||
          pathname === '/api/tokens/client' ||
          pathname.match(/^\/api\/tokens\/client\/.+$/)) {
        return handleTokens(request, env, url);
      }

      // Files
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
        return handleFiles(request, env, url);
      }

      // Notifications
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
        return handleNotifications(request, env, url);
      }

      // Email history
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
        return getEmailHistory(request, env, url);
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
