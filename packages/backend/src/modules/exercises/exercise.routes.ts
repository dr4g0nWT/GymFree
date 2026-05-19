import type { FastifyInstance } from 'fastify';
import { authenticate, optionalAuth } from '../../common/middleware/auth.js';
import * as controller from './exercise.controller.js';

export async function exerciseRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, controller.list);
  app.get('/muscle-groups', { preHandler: [authenticate] }, controller.getMuscleGroups);
  app.get('/search', { preHandler: [authenticate] }, controller.search);
  app.get('/:id', { preHandler: [authenticate] }, controller.getById);
  app.post('/', { preHandler: [authenticate] }, controller.create);
  app.put('/:id', { preHandler: [authenticate] }, controller.update);
  app.delete('/:id', { preHandler: [authenticate] }, controller.remove);
}
