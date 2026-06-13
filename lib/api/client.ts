import type { Env } from '../types';
import { verifyClientToken } from '../auth';
import type { Project } from '../types';
import { getProject, getMessages, getProjectFiles, getProjectsByEmail, addMessage, saveProject } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendAdminMessageNotification } from './notifications';

async function clientTaskOp(
  request: Request,
  env: Env,
  project: Project,
  isTaskComment: boolean,
  taskCommentId: string | undefined
): Promise<Response> {
  if (!Array.isArray(project.tasks)) project.tasks = [];
  const body = (await request.json()) as Record<string, any>;
  if (isTaskComment) {
    const idx = project.tasks.findIndex((t) => t.id === taskCommentId);
    if (idx === -1) return errorResponse('Task not found', 404);
    if (!body.text?.trim()) return errorResponse('text is required');
    const comment = {
      id: generateId(),
      author: 'client' as const,
      text: body.text.trim(),
      createdAt: new Date().toISOString(),
    };
    if (!Array.isArray(project.tasks[idx].comments)) project.tasks[idx].comments = [];
    project.tasks[idx].comments.push(comment);
    await saveProject(env, project);
    return jsonResponse(comment, 201);
  }
  if (!body.title?.trim()) return errorResponse('title is required');
  const task = {
    id: generateId(),
    title: body.title.trim(),
    content: body.content ?? '',
    urgency: (body.urgency ?? 'moyenne') as 'basse' | 'moyenne' | 'haute',
    dueDate: body.dueDate,
    status: 'todo' as const,
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  project.tasks.push(task);
  await saveProject(env, project);
  return jsonResponse(task, 201);
}

export async function handleClientApi(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message|\/tasks(?:\/([a-f0-9]{32})\/comments)?)?$/);
  if (!match) return errorResponse('Not found', 404);

  const [, tokenStr, subPathRaw, taskCommentId] = match;
  const subPath = subPathRaw && subPathRaw.indexOf('/tasks') === 0 ? '/tasks' : subPathRaw;
  const isTaskComment = !!(subPathRaw && subPathRaw.indexOf('/comments') !== -1);

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

    if (method === 'POST' && subPath === '/tasks') {
      const peek = (await request.clone().json().catch(() => ({}))) as Record<string, any>;
      const projectId = peek.projectId || url.searchParams.get('projectId');
      const project = projects.find((p) => p.id === projectId);
      if (!project) return errorResponse('Project not found', 404);
      return clientTaskOp(request, env, project, isTaskComment, taskCommentId);
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

  if (method === 'POST' && subPath === '/tasks') {
    return clientTaskOp(request, env, project, isTaskComment, taskCommentId);
  }

  return errorResponse('Method not allowed', 405);
}
