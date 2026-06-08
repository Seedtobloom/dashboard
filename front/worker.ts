import type { FrontEnv } from './wFront';
import { handleRequest } from './wFront';

export default {
  async fetch(request: Request, env: FrontEnv): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      console.error('Unhandled error:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
