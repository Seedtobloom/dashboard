import type { Env, Message } from '../types';
import { getProject } from '../kv';
import { getMessages, saveMessages, addMessage } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendMessageNotification } from './notifications';

export async function handleMessages(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // /api/projects/{id}/messages[/{msgId}/read]
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/messages(?:\/([a-f0-9]{32})\/(read))?$/);
  if (!match) return errorResponse('Not found', 404);
  const [, projectId, msgId, action] = match;

  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);

  // GET /api/projects/{id}/messages
  if (method === 'GET' && !msgId) {
    const messages = await getMessages(env, projectId);
    return jsonResponse(messages);
  }

  // POST /api/projects/{id}/messages
  if (method === 'POST' && !msgId) {
    const body = await request.json() as { content: string; author: 'cindy' | 'client' };
    if (!body.content?.trim()) return errorResponse('content is required');
    if (!['cindy', 'client'].includes(body.author)) return errorResponse('invalid author');

    const message: Message = {
      id: generateId(),
      projectId,
      author: body.author,
      content: body.content.trim(),
      createdAt: new Date().toISOString(),
      readByClient: body.author === 'client',
      readByAdmin: body.author === 'cindy',
    };

    await addMessage(env, message);

    // Notify client when Cindy replies
    if (body.author === 'cindy') {
      sendMessageNotification(env, project, message).catch(() => {});
    }

    return jsonResponse(message, 201);
  }

  // PUT /api/projects/{id}/messages/{msgId}/read
  if (method === 'PUT' && msgId && action === 'read') {
    const messages = await getMessages(env, projectId);
    const body = await request.json() as { by: 'client' | 'admin' };

    const updated = messages.map((m) => {
      if (m.id !== msgId) return m;
      if (body.by === 'client') return { ...m, readByClient: true };
      if (body.by === 'admin') return { ...m, readByAdmin: true };
      return m;
    });

    await saveMessages(env, projectId, updated);
    return jsonResponse({ success: true });
  }

  // PUT /api/projects/{id}/messages/read-all (mark all as read by admin)
  if (method === 'PUT' && url.pathname.endsWith('/read-all')) {
    const messages = await getMessages(env, projectId);
    const updated = messages.map((m) => ({ ...m, readByAdmin: true }));
    await saveMessages(env, projectId, updated);
    return jsonResponse({ success: true });
  }

  return errorResponse('Method not allowed', 405);
}
