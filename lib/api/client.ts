import type { Env } from '../types';
import { verifyClientToken } from '../auth';
import { getProject, getMessages, getProjectFiles } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { addMessage } from '../kv';

// GET /api/client/{token} — public, verifies token, returns project data
// POST /api/client/{token}/message — post a message as client
export async function handleClientApi(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // Match /api/client/{token}[/message]
  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message)?$/);
  if (!match) return errorResponse('Not found', 404);

  const [, tokenStr, subPath] = match;

  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken) return errorResponse('Invalid or expired token', 403);

  const project = await getProject(env, clientToken.projectId);
  if (!project) return errorResponse('Project not found', 404);

  // GET /api/client/{token} — return project data
  if (method === 'GET' && !subPath) {
    const messages = await getMessages(env, project.id);
    const files = await getProjectFiles(env, project.id);
    return jsonResponse({ project, messages, files });
  }

  // POST /api/client/{token}/message
  if (method === 'POST' && subPath === '/message') {
    const body = await request.json() as { content: string };
    const content = body.content?.trim();
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
