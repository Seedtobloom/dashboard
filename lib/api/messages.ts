import type { Env, Message } from '../types';
import { getProject, getAllProjects } from '../kv';
import { getMessages, saveMessages, addMessage, getClientMessages, saveClientMessages, addClientMessage } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendMessageNotification, sendClientThreadClientNotification } from './notifications';

// --- Conversations admin au niveau espace client (par email) ---
export async function handleConversations(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // Liste de toutes les conversations (inbox)
  if (method === 'GET' && url.pathname === '/api/conversations') {
    const projects = await getAllProjects(env);
    // un enregistrement par email client
    const byEmail = new Map<string, { clientEmail: string; clientName: string; refProjectId: string }>();
    projects.forEach((p) => {
      const email = (p.clientEmail || '').toLowerCase();
      if (!email) return;
      if (!byEmail.has(email)) byEmail.set(email, { clientEmail: email, clientName: p.clientName, refProjectId: p.id });
    });
    const list = await Promise.all(
      Array.from(byEmail.values()).map(async (c) => {
        const messages = await getClientMessages(env, c.clientEmail);
        const unread = messages.filter((m) => m.author === 'client' && !m.readByAdmin).length;
        const last = messages.length ? messages[messages.length - 1] : null;
        return { ...c, unread, last, count: messages.length };
      })
    );
    list.sort((a, b) => {
      const la = a.last ? new Date(a.last.createdAt).getTime() : 0;
      const lb = b.last ? new Date(b.last.createdAt).getTime() : 0;
      return lb - la;
    });
    return jsonResponse(list);
  }

  // /api/conversations/{emailEncodé}[/read-all]
  const match = url.pathname.match(/^\/api\/conversations\/([^/]+)(\/read-all)?$/);
  if (!match) return errorResponse('Not found', 404);
  const email = decodeURIComponent(match[1]).toLowerCase();
  const isReadAll = !!match[2];

  if (method === 'PUT' && isReadAll) {
    const messages = await getClientMessages(env, email);
    messages.forEach((m) => { m.readByAdmin = true; });
    await saveClientMessages(env, email, messages);
    return jsonResponse({ success: true });
  }

  if (method === 'GET') {
    const messages = await getClientMessages(env, email);
    return jsonResponse(messages);
  }

  if (method === 'POST') {
    const body = (await request.json()) as { content: string };
    const content = body.content?.trim();
    if (!content) return errorResponse('content is required');
    const message = {
      id: generateId(),
      clientEmail: email,
      author: 'cindy' as const,
      content,
      createdAt: new Date().toISOString(),
      readByClient: false,
      readByAdmin: true,
    };
    await addClientMessage(env, message);
    // rattache un projet pour le débounce email
    const projects = await getAllProjects(env);
    const proj = projects.find((p) => (p.clientEmail || '').toLowerCase() === email);
    if (proj) await sendClientThreadClientNotification(env, email, proj.clientName, proj.id).catch(() => {});
    return jsonResponse({ success: true, message }, 201);
  }

  return errorResponse('Method not allowed', 405);
}

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
      await sendMessageNotification(env, project, message).catch(() => {});
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
