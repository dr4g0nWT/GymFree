import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../common/middleware/auth.js';
import * as controller from './routine.controller.js';

export async function routineRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, controller.list);
  app.get('/predefined', { preHandler: [authenticate] }, controller.getPredefined);
  app.get('/:id', { preHandler: [authenticate] }, controller.getById);
  app.post('/', { preHandler: [authenticate] }, controller.create);
  app.put('/:id', { preHandler: [authenticate] }, controller.update);
  app.delete('/:id', { preHandler: [authenticate] }, controller.remove);
  app.post('/:id/clone', { preHandler: [authenticate] }, controller.clone);
}
