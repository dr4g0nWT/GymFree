import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../common/middleware/auth.js';
import * as controller from './workout.controller.js';

export async function workoutRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [authenticate] }, controller.start);
  app.get('/active', { preHandler: [authenticate] }, controller.getActive);
  app.get('/history', { preHandler: [authenticate] }, controller.getHistory);
  app.get('/stats', { preHandler: [authenticate] }, controller.getStats);
  app.get('/:id', { preHandler: [authenticate] }, controller.getById);

  app.post('/:id/exercises', { preHandler: [authenticate] }, controller.addExercise);
  app.post('/:exerciseId/sets', { preHandler: [authenticate] }, controller.logSet);
  app.post('/:id/complete', { preHandler: [authenticate] }, controller.complete);

  app.put('/sets/:setId', { preHandler: [authenticate] }, controller.updateSet);
  app.delete('/sets/:setId', { preHandler: [authenticate] }, controller.removeSet);
}
