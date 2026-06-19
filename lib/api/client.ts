import type { Env, Project, MaintenanceTicket, Task, ProjectFile } from '../types';
import { verifyClientToken } from '../auth';
import { getProject, getMessages, getProjectFiles, getProjectsByEmail, addMessage, saveProject, getClientMessages, saveClientMessages, addClientMessage, addProjectFile } from '../kv';
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
  const task: Task = {
    id: generateId(),
    title: body.title.trim(),
    content: body.content ?? '',
    urgency: (body.urgency ?? 'moyenne'),
    dueDate: body.dueDate,
    status: 'todo' as const,
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  if (body.startDate) task.startDate = body.startDate;
  if (body.pole) task.pole = body.pole;
  if (body.properties && typeof body.properties === 'object') task.properties = body.properties;
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

  // Tickets route: /api/client/{token}/tickets[/{ticketId}]
  const ticketMatch = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/tickets(?:\/([a-f0-9]{32}))?$/);
  if (ticketMatch) {
    const clientToken = await verifyClientToken(ticketMatch[1], env);
    if (!clientToken) return errorResponse('Invalid or expired token', 403);
    const projects = await allowedProjects(env, clientToken);
    const projectId = (await request.clone().json().catch(() => ({} as Record<string, any>)) as Record<string, any>).projectId
      || url.searchParams.get('projectId')
      || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return errorResponse('Project not found', 404);
    const ticketId = ticketMatch[2];

    if (!Array.isArray(project.tickets)) project.tickets = [];

    if (method === 'POST' && !ticketId) {
      const body = (await request.json()) as Record<string, any>;
      if (!body.title?.trim()) return errorResponse('title is required');
      const ticket: MaintenanceTicket = {
        id: generateId(),
        title: body.title.trim(),
        description: (body.description || '').trim(),
        priority: body.priority || 'moyenne',
        category: body.category || '',
        status: 'open',
        attachments: Array.isArray(body.attachments) ? body.attachments : [],
        createdAt: new Date().toISOString(),
      };
      project.tickets.unshift(ticket);
      await saveProject(env, project);
      return jsonResponse(ticket, 201);
    }

    if (method === 'PATCH' && ticketId) {
      const body = (await request.json()) as Record<string, any>;
      const tickets = project.tickets!;
      const idx = tickets.findIndex((t) => t.id === ticketId);
      if (idx === -1) return errorResponse('Ticket not found', 404);
      if (typeof body.title === 'string' && body.title.trim()) tickets[idx].title = body.title.trim();
      if (typeof body.description === 'string') tickets[idx].description = body.description;
      if (body.priority) tickets[idx].priority = body.priority;
      if (body.category !== undefined) tickets[idx].category = body.category;
      if (Array.isArray(body.attachments)) tickets[idx].attachments = body.attachments;
      if (body.status) tickets[idx].status = body.status;
      if (body.status === 'done' || body.status === 'closed') tickets[idx].resolvedAt = new Date().toISOString();
      if (body.status && body.status !== 'done' && body.status !== 'closed') tickets[idx].resolvedAt = undefined;
      await saveProject(env, project);
      return jsonResponse(tickets[idx]);
    }

    if (method === 'DELETE' && ticketId) {
      const before = project.tickets.length;
      project.tickets = project.tickets.filter((t) => t.id !== ticketId);
      if (project.tickets.length === before) return errorResponse('Ticket not found', 404);
      await saveProject(env, project);
      return jsonResponse({ ok: true });
    }

    return errorResponse('Method not allowed', 405);
  }

  // Upload fichier côté client : POST /api/client/{token}/files
  const filesUploadMatch = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/files$/);
  if (filesUploadMatch && method === 'POST') {
    const clientToken = await verifyClientToken(filesUploadMatch[1], env);
    if (!clientToken) return errorResponse('Invalid or expired token', 403);
    const projects = await allowedProjects(env, clientToken);
    const contentType = request.headers.get('Content-Type') ?? '';
    if (!contentType.includes('multipart/form-data')) return errorResponse('multipart/form-data required');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = (formData.get('projectId') as string) || url.searchParams.get('projectId') || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId) || projects[0];
    if (!project) return errorResponse('Project not found', 404);
    if (!file) return errorResponse('file is required');
    const key = `${project.id}/${generateId()}-${file.name}`;
    await env.BLOOM_R2.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    const projectFile: ProjectFile = {
      key, name: file.name, size: file.size, type: file.type,
      category: 'document', uploadedAt: new Date().toISOString(), uploadedBy: 'client',
    };
    await addProjectFile(env, project.id, projectFile);
    return jsonResponse(projectFile, 201);
  }

  // Conseils & retours côté client : /api/client/{token}/counsels|feedbacks[/{id}]
  const crMatch = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/(counsels|feedbacks)(?:\/([a-f0-9]{32}))?$/);
  if (crMatch) {
    const clientToken = await verifyClientToken(crMatch[1], env);
    if (!clientToken) return errorResponse('Invalid or expired token', 403);
    const projects = await allowedProjects(env, clientToken);
    const field = crMatch[2] as 'counsels' | 'feedbacks';
    const itemId = crMatch[3];
    const body = (await request.clone().json().catch(() => ({} as Record<string, any>))) as Record<string, any>;
    const projectId = body.projectId || url.searchParams.get('projectId') || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId) || projects[0];
    if (!project) return errorResponse('Project not found', 404);
    const arr: any[] = Array.isArray((project as any)[field]) ? (project as any)[field] : [];

    if (method === 'POST' && !itemId) {
      const item = field === 'counsels'
        ? { id: generateId(), title: (body.title || '').trim(), body: (body.body || '').trim(), badge: body.badge || '', author: 'client', createdAt: new Date().toISOString() }
        : { id: generateId(), author: project.clientName || 'Client', content: (body.content || '').trim(), createdAt: new Date().toISOString() };
      if (field === 'counsels' && !(item as any).title) return errorResponse('title is required');
      if (field === 'feedbacks' && !(item as any).content) return errorResponse('content is required');
      arr.unshift(item);
      (project as any)[field] = arr;
      await saveProject(env, project);
      return jsonResponse(item, 201);
    }
    if (method === 'DELETE' && itemId) {
      (project as any)[field] = arr.filter((x) => x.id !== itemId);
      await saveProject(env, project);
      return jsonResponse({ ok: true });
    }
    return errorResponse('Method not allowed', 405);
  }

  // Steps route: /api/client/{token}/steps/{stepId}
  const stepsMatch = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/steps\/([a-f0-9]{32})$/);
  if (stepsMatch) {
    const clientToken = await verifyClientToken(stepsMatch[1], env);
    if (!clientToken) return errorResponse('Invalid or expired token', 403);
    const projects = await allowedProjects(env, clientToken);
    const stepId = stepsMatch[2];

    if (method === 'PATCH') {
      const body = (await request.json()) as Record<string, any>;
      const project = projects.find((p) => p.id === body.projectId) || projects[0];
      if (!project) return errorResponse('Project not found', 404);
      const steps = project.steps || [];
      const stepIdx = steps.findIndex((s: any) => s.id === stepId);
      if (stepIdx === -1) return errorResponse('Step not found', 404);
      if (body.pageBlocks !== undefined) steps[stepIdx].pageBlocks = body.pageBlocks;
      project.steps = steps;
      await saveProject(env, project);
      return jsonResponse(steps[stepIdx]);
    }

    return errorResponse('Method not allowed', 405);
  }

  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/conversation|\/message|\/tasks(?:\/([a-f0-9]{32})(\/comments)?)?)?$/);
  if (!match) return errorResponse('Not found', 404);

  const [, tokenStr, subPathRaw, taskIdFromPath, commentsSuffix] = match;
  const subPath = subPathRaw && subPathRaw.indexOf('/tasks') === 0 ? '/tasks' : subPathRaw;
  const isTaskComment = !!(commentsSuffix);
  const patchTaskId = taskIdFromPath && !commentsSuffix ? taskIdFromPath : null;

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

  // PATCH /api/client/:token/tasks/:taskId — mise à jour partielle par le client (propriétés, contenu, statut, temps)
  if (method === 'PATCH' && subPath === '/tasks' && patchTaskId) {
    const body = (await request.json().catch(() => ({}))) as Record<string, any>;
    const projectId = body.projectId || url.searchParams.get('projectId') || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId) || projects[0];
    if (!project) return errorResponse('Project not found', 404);
    const idx = (project.tasks || []).findIndex((t) => t.id === patchTaskId);
    if (idx === -1) return errorResponse('Task not found', 404);
    const prev = project.tasks[idx];
    const allowed = ['content', 'status', 'timeSpentMinutes', 'properties', 'title', 'urgency', 'dueDate', 'startDate', 'pole', 'pinned', 'archived', 'livrableUrl', 'deliverableFileKey'] as const;
    const patch: Record<string, any> = {};
    allowed.forEach((k) => { if (k in body) patch[k] = body[k]; });
    if (patch.properties && typeof patch.properties === 'object') {
      patch.properties = Object.assign({}, prev.properties || {}, patch.properties);
    }
    if (patch.status === 'done' && !prev.completedAt) patch.completedAt = new Date().toISOString();
    if (patch.status && patch.status !== 'done') patch.completedAt = null;
    project.tasks[idx] = Object.assign({}, prev, patch);
    await saveProject(env, project);
    return jsonResponse(project.tasks[idx]);
  }

  if (method === 'POST' && subPath === '/tasks') {
    const peek = (await request.clone().json().catch(() => ({}))) as Record<string, any>;
    const projectId = peek.projectId || url.searchParams.get('projectId') || projects[0]?.id;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return errorResponse('Project not found', 404);
    return clientTaskOp(request, env, project, isTaskComment, taskIdFromPath);
  }

  return errorResponse('Method not allowed', 405);
}
