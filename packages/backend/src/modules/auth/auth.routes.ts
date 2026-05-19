import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../common/middleware/auth.js';
import * as controller from './auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', controller.register);
  app.post('/login', controller.login);
  app.post('/refresh', controller.refresh);

  app.get('/me', { preHandler: [authenticate] }, controller.me);
  app.put('/me', { preHandler: [authenticate] }, controller.updateMe);
}
