import type { Env, ClientToken } from './types';

export async function verifyClientToken(
  token: string,
  env: Env
): Promise<ClientToken | null> {
  const data = await env.BLOOM_KV.get(`token:${token}`);
  if (!data) return null;

  const clientToken: ClientToken = JSON.parse(data);

  if (clientToken.revoked) return null;

  if (clientToken.expiresAt && new Date(clientToken.expiresAt) < new Date()) {
    return null;
  }

  // Update lastUsedAt without blocking the response
  const updated = { ...clientToken, lastUsedAt: new Date().toISOString() };
  env.BLOOM_KV.put(`token:${token}`, JSON.stringify(updated));

  return clientToken;
}


export function getTokenFromRequest(request: Request): string | null {
  const url = new URL(request.url);

  // Check URL path: /p/{token}
  const pathMatch = url.pathname.match(/^\/p\/([a-f0-9]{64})$/);
  if (pathMatch) return pathMatch[1];

  // Check query param
  const tokenParam = url.searchParams.get('token');
  if (tokenParam) return tokenParam;

  // Check cookie
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const match = cookie.match(/bloom_token=([a-f0-9]{64})/);
    if (match) return match[1];
  }

  return null;
}
