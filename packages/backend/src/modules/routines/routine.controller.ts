import type { FastifyRequest, FastifyReply } from 'fastify';
import { createRoutineSchema, updateRoutineSchema } from '@gymfree/shared';
import * as service from './routine.service.js';
import { getPaginationParams } from '../../common/pagination.js';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const pagination = getPaginationParams(request.query as { page?: string; limit?: string });
  const { difficulty } = request.query as { difficulty?: string };

  const result = await service.list({
    ...pagination,
    difficulty,
    userId: request.user!.id,
  });

  return reply.send(result);
}

export async function getPredefined(request: FastifyRequest, reply: FastifyReply) {
  const pagination = getPaginationParams(request.query as { page?: string; limit?: string });
  const { difficulty } = request.query as { difficulty?: string };

  const result = await service.getPredefined({
    ...pagination,
    difficulty,
  });

  return reply.send(result);
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const routine = await service.getById(request.params.id, request.user!.id);
  return reply.send(routine);
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = createRoutineSchema.parse(request.body);
  const routine = await service.create(data, request.user!.id);
  return reply.status(201).send(routine);
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const data = updateRoutineSchema.parse(request.body);
  const routine = await service.update(request.params.id, data, request.user!.id);
  return reply.send(routine);
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await service.remove(request.params.id, request.user!.id);
  return reply.status(204).send();
}

export async function clone(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const routine = await service.clone(request.params.id, request.user!.id);
  return reply.status(201).send(routine);
}
