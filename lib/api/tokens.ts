import type { Env, ClientToken } from '../types';
import { getProjectTokens, saveToken, addTokenToProject, getToken, addClientEmailToken, getClientEmailTokens, deleteToken, getAllProjects } from '../kv';
import { generateToken, jsonResponse, errorResponse } from '../utils';
import { getProject } from '../kv';

export async function handleTokens(request: Request, env: Env, url: URL): Promise<Response> {
  const method = request.method;

  const projectMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/tokens$/);
  const revokeMatch = url.pathname.match(/^\/api\/tokens\/([a-f0-9]{64})\/revoke$/);
  const deleteMatch = url.pathname.match(/^\/api\/tokens\/([a-f0-9]{64})$/);
  const clientTokenMatch = url.pathname === '/api/tokens/client';

  // GET /api/tokens/all — tous les tokens enrichis (1 seul appel pour la page "Espaces clients")
  if (method === 'GET' && url.pathname === '/api/tokens/all') {
    const projects = await getAllProjects(env);
    const baseUrl = env.PORTAL_BASE_URL || 'https://bloom-portal.seedtobloom.workers.dev';

    // Tokens rattachés à un projet
    const projectTokenLists = await Promise.all(projects.map(async (p) => {
      const toks = await getProjectTokens(env, p.id);
      return toks.map((t) => ({
        ...t,
        url: `${baseUrl}/p/${t.token}`,
        projectTitle: p.projectTitle,
        clientName: p.clientName,
        clientEmail: p.clientEmail,
        projectId: p.id,
        projectStatus: p.status,
        projectType: p.type,
      }));
    }));

    // Tokens par email (espace multi-projets)
    const emailMap: Record<string, string> = {};
    for (const p of projects) {
      if (p.clientEmail) emailMap[p.clientEmail.toLowerCase()] = p.clientName;
    }
    const emailTokenLists = await Promise.all(Object.keys(emailMap).map(async (email) => {
      const toks = await getClientEmailTokens(env, email);
      return toks.map((t) => ({
        ...t,
        url: `${baseUrl}/p/${t.token}`,
        projectTitle: 'Espace multi-projets',
        clientName: emailMap[email],
        isClientSpace: true,
      }));
    }));

    // Fusion + dédoublonnage par token
    const seen: Record<string, boolean> = {};
    const tokens = ([] as Record<string, unknown>[])
      .concat(...projectTokenLists, ...emailTokenLists)
      .filter((t) => {
        const k = t.token as string;
        if (seen[k]) return false;
        seen[k] = true;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

    return jsonResponse(tokens);
  }

  // GET /api/projects/{id}/tokens
  if (method === 'GET' && projectMatch) {
    const project = await getProject(env, projectMatch[1]);
    if (!project) return errorResponse('Project not found', 404);
    const tokens = await getProjectTokens(env, projectMatch[1]);
    return jsonResponse(tokens);
  }

  // POST /api/projects/{id}/tokens — generate project-specific token
  if (method === 'POST' && projectMatch) {
    const projectId = projectMatch[1];
    const project = await getProject(env, projectId);
    if (!project) return errorResponse('Project not found', 404);

    const body = (await request.json()) as { label?: string; expiresAt?: string };
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

    const baseUrl = env.PORTAL_BASE_URL || 'https://bloom-portal.seedtobloom.workers.dev';
    return jsonResponse({ ...clientToken, url: `${baseUrl}/p/${token}` }, 201);
  }

  // POST /api/tokens/client — generate client-level token (all projects for an email)
  if (method === 'POST' && clientTokenMatch) {
    const body = (await request.json()) as { clientEmail: string; label?: string; expiresAt?: string };
    if (!body.clientEmail) return errorResponse('clientEmail is required');

    const token = generateToken();
    const clientToken: ClientToken = {
      token,
      clientEmail: body.clientEmail.toLowerCase(),
      label: body.label || body.clientEmail,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt,
      revoked: false,
    };

    await saveToken(env, clientToken);
    await addClientEmailToken(env, body.clientEmail.toLowerCase(), token);

    const baseUrl = env.PORTAL_BASE_URL || 'https://bloom-portal.seedtobloom.workers.dev';
    return jsonResponse({ ...clientToken, url: `${baseUrl}/p/${token}` }, 201);
  }

  // GET /api/tokens/client/{email} — get client-level tokens for an email
  const clientEmailMatch = url.pathname.match(/^\/api\/tokens\/client\/(.+)$/);
  if (method === 'GET' && clientEmailMatch) {
    const email = decodeURIComponent(clientEmailMatch[1]);
    const tokens = await getClientEmailTokens(env, email);
    const baseUrl = env.PORTAL_BASE_URL || 'https://bloom-portal.seedtobloom.workers.dev';
    return jsonResponse(tokens.map(t => ({ ...t, url: `${baseUrl}/p/${t.token}` })));
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

  // DELETE /api/tokens/{token} — suppression définitive du lien d'accès
  if (method === 'DELETE' && deleteMatch) {
    const tokenStr = deleteMatch[1];
    const existing = await getToken(env, tokenStr);
    // Idempotent : si le token n'existe plus, on considère la suppression réussie
    if (existing) await deleteToken(env, existing);
    return jsonResponse({ success: true });
  }

  return errorResponse('Not found', 404);
}
