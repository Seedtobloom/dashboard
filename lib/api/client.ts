import type { Env } from '../types';
import { verifyClientToken } from '../auth';
import { getProject, getMessages, getProjectFiles, getProjectsByEmail, addMessage } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendAdminMessageNotification } from './notifications';

export async function handleClientApi(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message)?$/);
  if (!match) return errorResponse('Not found', 404);

  const [, tokenStr, subPath] = match;

  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken) return errorResponse('Invalid or expired token', 403);

  // Client-level token (linked to email, shows all projects)
  if (clientToken.clientEmail) {
    const projects = await getProjectsByEmail(env, clientToken.clientEmail);
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (method === 'GET' && !subPath) {
      const projectsData = await Promise.all(
        projects.map(async (project) => {
          const messages = await getMessages(env, project.id);
          const files = await getProjectFiles(env, project.id);
          return { project, messages, files };
        })
      );
      const clientName = projects[0]?.clientName || '';
      return jsonResponse({ type: 'client', clientName, projects: projectsData });
    }

    if (method === 'POST' && subPath === '/message') {
      const body = (await request.json()) as { content: string; projectId: string };
      const projectId = body.projectId || url.searchParams.get('projectId');
      if (!projectId) return errorResponse('projectId is required');

      const project = projects.find((p) => p.id === projectId);
      if (!project) return errorResponse('Project not found', 404);

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
      sendAdminMessageNotification(env, project, message).catch(() => {});
      return jsonResponse({ success: true, message }, 201);
    }

    return errorResponse('Method not allowed', 405);
  }

  // Single-project token (backward compat)
  if (!clientToken.projectId) return errorResponse('Invalid token', 500);

  const project = await getProject(env, clientToken.projectId);
  if (!project) return errorResponse('Project not found', 404);

  if (method === 'GET' && !subPath) {
    const messages = await getMessages(env, project.id);
    const files = await getProjectFiles(env, project.id);
    return jsonResponse({ project, messages, files });
  }

  if (method === 'POST' && subPath === '/message') {
    const body = (await request.json()) as { content: string };
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
    sendAdminMessageNotification(env, project, message).catch(() => {});
    return jsonResponse({ success: true, message }, 201);
  }

  return errorResponse('Method not allowed', 405);
}
