import type { Env, Task, TaskComment } from '../types';
import { getProject, saveProject } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendTaskDoneNotification, sendTaskReviewNotification } from './notifications';

// Admin task management: /api/projects/:id/tasks(/:taskId)(/comments)
export async function handleTasks(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;
  const match = url.pathname.match(
    /^\/api\/projects\/([a-f0-9]{32})\/tasks(?:\/([a-f0-9]{32}))?(\/comments)?$/
  );
  if (!match) return errorResponse('Not found', 404);
  const [, projectId, taskId, commentsPath] = match;

  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);
  if (!Array.isArray(project.tasks)) project.tasks = [];

  // GET list
  if (method === 'GET' && !taskId) {
    return jsonResponse(project.tasks);
  }

  // POST create task
  if (method === 'POST' && !taskId) {
    const body = (await request.json()) as Partial<Task>;
    if (!body.title) return errorResponse('title is required');
    const task: Task = {
      id: generateId(),
      title: body.title,
      content: body.content ?? '',
      urgency: body.urgency ?? 'moyenne',
      dueDate: body.dueDate,
      status: body.status ?? 'todo',
      deliverableFileKey: body.deliverableFileKey,
      comments: [],
      pinned: body.pinned ?? false,
      timeSpentMinutes: body.timeSpentMinutes ?? 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    project.tasks.push(task);
    await saveProject(env, project);
    return jsonResponse(task, 201);
  }

  // POST comment
  if (method === 'POST' && taskId && commentsPath) {
    const idx = project.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return errorResponse('Task not found', 404);
    const body = (await request.json()) as { author?: string; text?: string };
    if (!body.text?.trim()) return errorResponse('text is required');
    const comment: TaskComment = {
      id: generateId(),
      author: body.author === 'client' ? 'client' : 'cindy',
      text: body.text.trim(),
      createdAt: new Date().toISOString(),
    };
    if (!Array.isArray(project.tasks[idx].comments)) project.tasks[idx].comments = [];
    project.tasks[idx].comments.push(comment);
    await saveProject(env, project);
    return jsonResponse(comment, 201);
  }

  // PUT update task
  if (method === 'PUT' && taskId) {
    const idx = project.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return errorResponse('Task not found', 404);
    const body = (await request.json()) as Partial<Task>;
    const prev = project.tasks[idx];
    const updated: Task = { ...prev, ...body, id: taskId, comments: prev.comments };
    const justDone = body.status === 'done' && prev.status !== 'done';
    const justReview = body.status === 'review' && prev.status !== 'review';
    if (justDone) updated.completedAt = new Date().toISOString();
    if (body.status && body.status !== 'done') updated.completedAt = null;
    project.tasks[idx] = updated;
    await saveProject(env, project);
    if (justDone) {
      sendTaskDoneNotification(env, project, updated.title).catch(() => {});
    } else if (justReview) {
      sendTaskReviewNotification(env, project, updated.title).catch(() => {});
    }
    return jsonResponse(updated);
  }

  // DELETE task
  if (method === 'DELETE' && taskId) {
    const before = project.tasks.length;
    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    if (project.tasks.length === before) return errorResponse('Task not found', 404);
    await saveProject(env, project);
    return jsonResponse({ success: true });
  }

  return errorResponse('Method not allowed', 405);
}
