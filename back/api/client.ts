import type { Env } from '../types';
import { verifyClientToken } from '../auth';
import { getProject, getMessages, getProjectFiles, addMessage } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';

/**
 * Public client API — authenticated by token only, no admin Basic Auth.
 *
 * GET  /api/client/{token}          → { project, messages, files }
 * POST /api/client/{token}/message  → post a message as client
 */
export async function handleClientApi(request: Request, env: Env, url: URL): Promise<Response> {
  const tokenMatch = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message)?$/);
  if (!tokenMatch) return errorResponse('Not found', 404);

  const tokenStr = tokenMatch[1];
  const isMessage = tokenMatch[2] === '/message';

  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken) return errorResponse('Invalid or expired token', 403);

  const project = await getProject(env, clientToken.projectId);
  if (!project) return errorResponse('Project not found', 404);

  // GET /api/client/{token} — return full project data for client portal SPA
  if (request.method === 'GET' && !isMessage) {
    const messages = await getMessages(env, project.id);
    const files = await getProjectFiles(env, project.id);

    // Mark messages as read by client
    return jsonResponse({ project, messages, files });
  }

  // POST /api/client/{token}/message — client sends a message
  if (request.method === 'POST' && isMessage) {
    const body = await request.json() as { content: string };
    const content = body.content?.trim() ?? '';
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
    return jsonResponse({ success: true, message }, 201);
  }

  return errorResponse('Method not allowed', 405);
}
