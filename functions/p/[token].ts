import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from '../../lib/types';
import { verifyClientToken } from '../../lib/auth';

const ERROR_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lien invalide · Seed to Bloom</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f5f0e8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 4px 32px rgba(26,39,68,0.08); }
  .icon { font-size: 48px; margin-bottom: 20px; }
  h1 { font-family: 'Playfair Display', serif; color: #1a2744; font-size: 22px; margin-bottom: 16px; font-weight: 400; }
  p { color: #8090a8; line-height: 1.7; font-size: 15px; }
  a { color: #7fa688; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">🌸</div>
  <h1>Ce lien n'est plus valide</h1>
  <p>Le lien a expiré ou a été révoqué.<br><br>
  Contactez <a href="mailto:hello@seedtobloom.fr">Cindy</a> pour obtenir un nouveau lien d'accès à votre espace projet.</p>
</div>
</body>
</html>`;

export async function onRequest(ctx: EventContext<Env, 'token', unknown>): Promise<Response> {
  const { env, params } = ctx;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  // Validate token format
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return new Response(ERROR_HTML, {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const clientToken = await verifyClientToken(token, env);

  if (!clientToken) {
    return new Response(ERROR_HTML, {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Valid token — redirect to client SPA with token in query and set a 7-day cookie
  const redirectUrl = `/client.html?token=${token}`;
  const sevenDays = 7 * 24 * 60 * 60;

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      'Set-Cookie': `bloom_token=${token}; Path=/; Max-Age=${sevenDays}; HttpOnly; SameSite=Lax; Secure`,
      'Cache-Control': 'no-store',
    },
  });
}
