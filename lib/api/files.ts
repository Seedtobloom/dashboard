import type { Env, ProjectFile } from '../types';
import { getProjectFiles, addProjectFile, saveProjectFiles } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { getProject } from '../kv';

export async function handleFiles(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // /api/projects/{id}/files[/{fileKey}]
  const listMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files$/);
  const fileMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files\/(.+)$/);
  // /api/projects/{id}/files/{key}/download
  const downloadMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files\/(.+)\/download$/);

  if (!listMatch && !fileMatch && !downloadMatch) return errorResponse('Not found', 404);

  const projectId = (downloadMatch ?? fileMatch ?? listMatch)![1];
  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);

  // GET /api/projects/{id}/files
  if (method === 'GET' && listMatch) {
    const files = await getProjectFiles(env, projectId);
    return jsonResponse(files);
  }

  // POST /api/projects/{id}/files — upload
  if (method === 'POST' && listMatch) {
    const contentType = request.headers.get('Content-Type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return errorResponse('multipart/form-data required');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) ?? 'document';

    if (!file) return errorResponse('file is required');

    const key = `${projectId}/${generateId()}-${file.name}`;
    await env.BLOOM_R2.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    const projectFile: ProjectFile = {
      key,
      name: file.name,
      size: file.size,
      type: file.type,
      category: category as ProjectFile['category'],
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'cindy',
    };

    await addProjectFile(env, projectId, projectFile);
    return jsonResponse(projectFile, 201);
  }

  // GET /api/projects/{id}/files/{key}/download — signed URL (1h expiry)
  if (method === 'GET' && downloadMatch) {
    const fileKey = decodeURIComponent(downloadMatch[2]);
    const obj = await env.BLOOM_R2.get(fileKey);
    if (!obj) return errorResponse('File not found', 404);

    // Stream directly — R2 signed URLs require Workers R2 binding workaround
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('Content-Disposition', `attachment; filename="${fileKey.split('/').pop()}"`);
    headers.set('Cache-Control', 'private, max-age=3600');

    return new Response(obj.body, { headers });
  }

  // DELETE /api/projects/{id}/files/{key}
  if (method === 'DELETE' && fileMatch) {
    const fileKey = decodeURIComponent(fileMatch[2]);
    await env.BLOOM_R2.delete(fileKey);

    const files = await getProjectFiles(env, projectId);
    const updated = files.filter((f) => f.key !== fileKey);
    await saveProjectFiles(env, projectId, updated);

    return jsonResponse({ success: true });
  }

  return errorResponse('Method not allowed', 405);
}
