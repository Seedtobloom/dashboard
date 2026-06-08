import type { Env, ClientToken } from '../types';
import { getProjectTokens, saveToken, addTokenToProject, getToken } from '../kv';
import { generateToken, jsonResponse, errorResponse } from '../utils';
import { getProject } from '../kv';

export async function handleTokens(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  // /api/projects/{id}/tokens[/{token}/revoke]
  const projectMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/tokens$/);
  const revokeMatch = url.pathname.match(/^\/api\/tokens\/([a-f0-9]{64})\/revoke$/);

  // GET /api/projects/{id}/tokens
  if (method === 'GET' && projectMatch) {
    const project = await getProject(env, projectMatch[1]);
    if (!project) return errorResponse('Project not found', 404);

    const tokens = await getProjectTokens(env, projectMatch[1]);
    return jsonResponse(tokens);
  }

  // POST /api/projects/{id}/tokens — generate new token
  if (method === 'POST' && projectMatch) {
    const projectId = projectMatch[1];
    const project = await getProject(env, projectId);
    if (!project) return errorResponse('Project not found', 404);

    const body = await request.json() as { label?: string; expiresAt?: string };

    const token = generateToken();
    const clientToken: ClientToken = {
      token,
      projectId,
      label: body.label,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt,
      revoked: false,
    };

    await saveToken(env, clientToken);
    await addTokenToProject(env, projectId, token);

    const baseUrl = env.PORTAL_BASE_URL || 'https://bloom-portal.workers.dev';
    return jsonResponse({ ...clientToken, url: `${baseUrl}/p/${token}` }, 201);
  }

  // POST /api/tokens/{token}/revoke
  if (method === 'POST' && revokeMatch) {
    const tokenStr = revokeMatch[1];
    const existing = await getToken(env, tokenStr);
    if (!existing) return errorResponse('Token not found', 404);

    const revoked: ClientToken = { ...existing, revoked: true };
    await saveToken(env, revoked);
    return jsonResponse({ success: true });
  }

  return errorResponse('Not found', 404);
}
