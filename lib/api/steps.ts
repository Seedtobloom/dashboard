import type { Env, Step } from '../types';
import { getProject, saveProject } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendStepNotification } from './notifications';

export async function handleSteps(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // /api/projects/{id}/steps[/{stepId}]
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/steps(?:\/([a-f0-9]{32}))?$/);
  if (!match) return errorResponse('Not found', 404);
  const [, projectId, stepId] = match;

  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);

  // GET /api/projects/{id}/steps
  if (method === 'GET' && !stepId) {
    return jsonResponse(project.steps);
  }

  // POST /api/projects/{id}/steps
  if (method === 'POST' && !stepId) {
    const body = await request.json() as Partial<Step>;
    if (!body.title) return errorResponse('title is required');

    const step: Step = {
      id: generateId(),
      title: body.title,
      description: body.description,
      status: body.status ?? 'upcoming',
      dueDate: body.dueDate,
      clientAction: body.clientAction,
      order: project.steps.length,
    };
    project.steps.push(step);
    await saveProject(env, project);
    return jsonResponse(step, 201);
  }

  // PUT /api/projects/{id}/steps/{stepId}
  if (method === 'PUT' && stepId) {
    const stepIndex = project.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return errorResponse('Step not found', 404);

    const body = await request.json() as Partial<Step>;
    const oldStatus = project.steps[stepIndex].status;
    const updated: Step = { ...project.steps[stepIndex], ...body, id: stepId };

    if (body.status === 'done' && !updated.completedAt) {
      updated.completedAt = new Date().toISOString();
    }

    project.steps[stepIndex] = updated;
    await saveProject(env, project);

    // Trigger email notifications on status change
    if (body.status && body.status !== oldStatus) {
      await sendStepNotification(env, project, updated, oldStatus).catch(() => {});
    }

    return jsonResponse(updated);
  }

  // DELETE /api/projects/{id}/steps/{stepId}
  if (method === 'DELETE' && stepId) {
    const beforeCount = project.steps.length;
    project.steps = project.steps.filter((s) => s.id !== stepId);
    if (project.steps.length === beforeCount) return errorResponse('Step not found', 404);

    // Reorder
    project.steps = project.steps.map((s, i) => ({ ...s, order: i }));
    await saveProject(env, project);
    return jsonResponse({ success: true });
  }

  // PUT /api/projects/{id}/steps/reorder
  if (method === 'PUT' && url.pathname.endsWith('/reorder')) {
    const body = await request.json() as { order: string[] };
    if (!Array.isArray(body.order)) return errorResponse('order array required');

    const stepMap = new Map(project.steps.map((s) => [s.id, s]));
    project.steps = body.order
      .map((id, index) => {
        const s = stepMap.get(id);
        if (!s) return null;
        return { ...s, order: index };
      })
      .filter((s): s is Step => s !== null);

    await saveProject(env, project);
    return jsonResponse(project.steps);
  }

  return errorResponse('Method not allowed', 405);
}
