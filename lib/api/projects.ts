import type { Env, Project } from '../types';
import { getProject, saveProject, getAllProjects, addProjectToIndex, removeProjectFromIndex } from '../kv';
import { generateId } from '../utils';
import { jsonResponse, errorResponse } from '../utils';

export async function handleProjects(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // GET /api/projects
  if (method === 'GET' && url.pathname === '/api/projects') {
    const projects = await getAllProjects(env);
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return jsonResponse(projects);
  }

  // POST /api/projects
  if (method === 'POST' && url.pathname === '/api/projects') {
    const body = await request.json() as Partial<Project>;
    if (!body.clientName || !body.projectTitle) {
      return errorResponse('clientName and projectTitle are required');
    }

    const project: Project = {
      id: generateId(),
      clientName: body.clientName,
      clientEmail: body.clientEmail ?? '',
      projectTitle: body.projectTitle,
      description: body.description ?? '',
      type: body.type ?? 'custom',
      status: 'discovery',
      startDate: body.startDate ?? new Date().toISOString().split('T')[0],
      deadline: body.deadline,
      steps: Array.isArray(body.steps) ? body.steps : [],
      practicalInfo: { sections: Array.isArray(body.sections) ? body.sections : [] },
      meetingLink: body.meetingLink,
      bannerUrl: body.bannerUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProject(env, project);
    await addProjectToIndex(env, project.id);
    return jsonResponse(project, 201);
  }

  // Match /api/projects/{id}
  const idMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})$/);
  if (!idMatch) return errorResponse('Not found', 404);
  const id = idMatch[1];

  // GET /api/projects/{id}
  if (method === 'GET') {
    const project = await getProject(env, id);
    if (!project) return errorResponse('Project not found', 404);
    return jsonResponse(project);
  }

  // PUT or PATCH /api/projects/{id}
  if (method === 'PUT' || method === 'PATCH') {
    const existing = await getProject(env, id);
    if (!existing) return errorResponse('Project not found', 404);

    const body = await request.json() as Partial<Project>;
    const updated: Project = {
      ...existing,
      ...body,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    await saveProject(env, updated);
    return jsonResponse(updated);
  }

  // DELETE /api/projects/{id}
  if (method === 'DELETE') {
    const existing = await getProject(env, id);
    if (!existing) return errorResponse('Project not found', 404);

    await env.BLOOM_KV.delete(`project:${id}`);
    await removeProjectFromIndex(env, id);
    return jsonResponse({ success: true });
  }

  return errorResponse('Method not allowed', 405);
}
