import type { FastifyRequest, FastifyReply } from 'fastify';
import { createExerciseSchema, updateExerciseSchema, searchExercisesSchema } from '@gymfree/shared';
import * as service from './exercise.service.js';
import { getPaginationParams } from '../../common/pagination.js';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const pagination = getPaginationParams(request.query as { page?: string; limit?: string });
  const { muscleGroup, equipment } = request.query as {
    muscleGroup?: string;
    equipment?: string;
  };

  const result = await service.list({
    ...pagination,
    muscleGroup,
    equipment,
    userId: request.user!.id,
  });

  return reply.send(result);
}

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { q, muscleGroup, equipment } = request.query as {
    q?: string;
    muscleGroup?: string;
    equipment?: string;
  };

  if (!q) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'VALIDATION_ERROR',
      message: 'Search query (q) is required',
    });
  }

  const pagination = getPaginationParams(request.query as { page?: string; limit?: string });

  const result = await service.search({
    q,
    ...pagination,
    muscleGroup,
    equipment,
    userId: request.user!.id,
  });

  return reply.send(result);
}

export async function getMuscleGroups(_request: FastifyRequest, reply: FastifyReply) {
  const groups = await service.getMuscleGroups();
  return reply.send({ data: groups });
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const exercise = await service.getById(id);
  return reply.send(exercise);
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = createExerciseSchema.parse(request.body);
  const exercise = await service.create(data, request.user!.id);
  return reply.status(201).send(exercise);
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const data = updateExerciseSchema.parse(request.body);
  const exercise = await service.update(id, data, request.user!.id);
  return reply.send(exercise);
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await service.remove(id, request.user!.id);
  return reply.status(204).send();
}
