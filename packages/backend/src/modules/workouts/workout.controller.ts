import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  startWorkoutSchema,
  logSetSchema,
  updateSetSchema,
} from '@gymfree/shared';
import * as service from './workout.service.js';
import { getPaginationParams } from '../../common/pagination.js';

export async function start(request: FastifyRequest, reply: FastifyReply) {
  const data = startWorkoutSchema.parse(request.body);
  const workout = await service.startWorkout(data, request.user!.id);
  return reply.status(201).send(workout);
}

export async function getActive(request: FastifyRequest, reply: FastifyReply) {
  const workout = await service.getActiveWorkout(request.user!.id);
  return reply.send(workout);
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const workout = await service.getWorkoutById(id, request.user!.id);
  return reply.send(workout);
}

export async function getHistory(request: FastifyRequest, reply: FastifyReply) {
  const pagination = getPaginationParams(request.query as { page?: string; limit?: string });
  const result = await service.getWorkoutHistory(request.user!.id, pagination);
  return reply.send(result);
}

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  const stats = await service.getWorkoutStats(request.user!.id);
  return reply.send(stats);
}

export async function addExercise(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { exerciseId } = request.body as { exerciseId: string };
  const result = await service.addExerciseToWorkout(id, exerciseId, request.user!.id);
  return reply.status(201).send(result);
}

export async function logSet(request: FastifyRequest, reply: FastifyReply) {
  const { exerciseId } = request.params as { exerciseId: string };
  const data = logSetSchema.parse(request.body);
  const set = await service.logSet(exerciseId, data, request.user!.id);
  return reply.status(201).send(set);
}

export async function updateSet(request: FastifyRequest, reply: FastifyReply) {
  const { setId } = request.params as { setId: string };
  const data = updateSetSchema.parse(request.body);
  const set = await service.updateSet(setId, data, request.user!.id);
  return reply.send(set);
}

export async function removeSet(request: FastifyRequest, reply: FastifyReply) {
  const { setId } = request.params as { setId: string };
  await service.removeSet(setId, request.user!.id);
  return reply.status(204).send();
}

export async function complete(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const summary = await service.completeWorkout(id, request.user!.id);
  return reply.send(summary);
}
