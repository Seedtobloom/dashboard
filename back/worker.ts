import type { Env } from './types';
import { handleRequest } from './wBack';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const response = await handleRequest(request, env);

      // Attach security headers to every response
      const headers = new Headers(response.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (err) {
      console.error('Unhandled error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
