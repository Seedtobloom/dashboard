import type { Env } from '../types';
import { verifyClientToken } from '../auth';
import type { Project } from '../types';
import { getProject, getMessages, getProjectFiles, getProjectsByEmail, addMessage, saveProject, getClientMessages, saveClientMessages, addClientMessage } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendAdminMessageNotification, sendClientThreadAdminNotification } from './notifications';

// Liste des projets autorisés pour un token (cloisonnement strict).
async function allowedProjects(env: Env, clientToken: { clientEmail?: string; projectId?: string }): Promise<Project[]> {
  if (clientToken.clientEmail) {
    return getProjectsByEmail(env, clientToken.clientEmail);
  }
  if (clientToken.projectId) {
    const p = await getProject(env, clientToken.projectId);
    return p ? [p] : [];
  }
  return [];
}

// Téléchargement fichier côté client : /api/client/{token}/files/{fileKey}/download
async function clientFileDownload(
  env: Env,
  projects: Project[],
  fileKey: string
): Promise<Response> {
  // Le fichier appartient-il à un projet autorisé ? (la clé R2 commence par {projectId}/)
  const ownerId = fileKey.split('/')[0];
  const project = projects.find((p) => p.id === ownerId);
  if (!project) return errorResponse('File not found', 404);
  const files = await getProjectFiles(env, project.id);
  if (!files.some((f) => f.key === fileKey)) return errorResponse('File not found', 404);

  const obj = await env.BLOOM_R2.get(fileKey);
  if (!obj) return errorResponse('File not found', 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Content-Disposition', `attachment; filename="${fileKey.split('/').pop()}"`);
  headers.set('Cache-Control', 'private, max-age=3600');
  return new Response(obj.body, { headers });
}

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

  // Téléchargement de fichier : /api/client/{token}/files/{fileKey}/download
  const dl = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/files\/(.+)\/download$/);
  if (dl) {
    const clientToken = await verifyClientToken(dl[1], env);
    if (!clientToken) return errorResponse('Invalid or expired token', 403);
    const projects = await allowedProjects(env, clientToken);
    const fileKey = decodeURIComponent(dl[2]);
    return clientFileDownload(env, projects, fileKey);
  }

  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/conversation|\/message|\/tasks(?:\/([a-f0-9]{32})\/comments)?)?$/);
  if (!match) return errorResponse('Not found', 404);

  const [, tokenStr, subPathRaw, taskCommentId] = match;
  const subPath = subPathRaw && subPathRaw.indexOf('/tasks') === 0 ? '/tasks' : subPathRaw;
  const isTaskComment = !!(subPathRaw && subPathRaw.indexOf('/comments') !== -1);

  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken) return errorResponse('Invalid or expired token', 403);

  const projects = await allowedProjects(env, clientToken);
  projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Email de rattachement du fil client (token email, sinon email du projet).
  const threadEmail = (clientToken.clientEmail || projects[0]?.clientEmail || '').toLowerCase();
  const clientName = projects[0]?.clientName || '';
  const refProjectId = projects[0]?.id || '';

  // GET liste (projets + fil de conversation unifié)
  if (method === 'GET' && !subPath) {
    const projectsData = await Promise.all(
      projects.map(async (project) => {
        const messages = await getMessages(env, project.id);
        const files = await getProjectFiles(env, project.id);
        return { project, messages, files };
      })
    );
    const conversation = threadEmail ? await getClientMessages(env, threadEmail) : [];
    if (clientToken.clientEmail) {
      return jsonResponse({ type: 'client', clientName, projects: projectsData, conversation });
    }
    // Token projet seul : conserve le format simple + conversation rattachée.
    const single = projectsData[0];
    if (!single) return errorResponse('Project not found', 404);
    return jsonResponse({ project: single.project, messages: single.messages, files: single.files, conversation });
  }

  // Conversation unifiée espace client
  if (subPath === '/conversation') {
    if (!threadEmail) return errorResponse('No client thread available', 404);
    if (method === 'GET') {
      const conversation = await getClientMessages(env, threadEmail);
      // marque lu côté client
      let changed = false;
      conversation.forEach((m) => { if (m.author === 'cindy' && !m.readByClient) { m.readByClient = true; changed = true; } });
      if (changed) await saveClientMessages(env, threadEmail, conversation);
      return jsonResponse(conversation);
    }
    if (method === 'POST') {
      const body = (await request.json()) as { content: string };
      const content = body.content?.trim();
      if (!content) return errorResponse('content is required');
      const message = {
        id: generateId(),
        clientEmail: threadEmail,
        author: 'client' as const,
        content,
        createdAt: new Date().toISOString(),
        readByClient: true,
        readByAdmin: false,
      };
      await addClientMessage(env, message);
      if (refProjectId) sendClientThreadAdminNotification(env, threadEmail, clientName, refProjectId).catch(() => {});
      return jsonResponse({ success: true, message }, 201);
    }
    return errorResponse('Method not allowed', 405);
  }

  // Message par projet (rétro-compat) — vérifie l'appartenance au token.
  if (method === 'POST' && subPath === '/message') {
    const body = (await request.json()) as { content: string; projectId?: string };
    const projectId = body.projectId || url.searchParams.get('projectId') || projects[0]?.id;
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
    const projectId = peek.projectId || url.searchParams.get('projectId') || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return errorResponse('Project not found', 404);
    return clientTaskOp(request, env, project, isTaskComment, taskCommentId);
  }

  return errorResponse('Method not allowed', 405);
}
