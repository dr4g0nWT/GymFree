import type { JWT } from '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      username: string;
    } | null;
  }
}
