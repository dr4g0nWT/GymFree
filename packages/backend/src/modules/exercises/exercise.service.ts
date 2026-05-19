import { prisma } from '../../common/prisma.js';
import { NotFoundError, ForbiddenError } from '../../common/errors.js';
import { paginate, type PaginationParams } from '../../common/pagination.js';
import { MUSCLE_GROUPS } from '@gymfree/shared';
import type { createExerciseSchema, updateExerciseSchema } from '@gymfree/shared';
import type { z } from 'zod';
import type { Prisma } from '@prisma/client';

type CreateInput = z.infer<typeof createExerciseSchema>;
type UpdateInput = z.infer<typeof updateExerciseSchema>;

interface ListParams extends PaginationParams {
  muscleGroup?: string;
  equipment?: string;
  userId: string;
}

interface SearchParams extends ListParams {
  q: string;
}

const exerciseSelect = {
  id: true,
  name: true,
  description: true,
  muscleGroup: true,
  equipment: true,
  mediaUrl: true,
  mediaType: true,
  isPublic: true,
  isPredefined: true,
  createdById: true,
  createdBy: {
    select: { id: true, username: true },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ExerciseSelect;

export async function list(params: ListParams) {
  const where: Prisma.ExerciseWhereInput = {
    OR: [
      { isPublic: true },
      { createdById: params.userId },
    ],
  };

  if (params.muscleGroup) {
    where.muscleGroup = params.muscleGroup as never;
  }

  if (params.equipment) {
    where.equipment = params.equipment as never;
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      select: exerciseSelect,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { name: 'asc' },
    }),
    prisma.exercise.count({ where }),
  ]);

  return paginate(exercises, total, params);
}

export async function search(params: SearchParams) {
  const where: Prisma.ExerciseWhereInput = {
    AND: [
      {
        OR: [
          { name: { contains: params.q, mode: 'insensitive' } },
          { description: { contains: params.q, mode: 'insensitive' } },
        ],
      },
      {
        OR: [
          { isPublic: true },
          { createdById: params.userId },
        ],
      },
    ],
  };

  if (params.muscleGroup) {
    where.muscleGroup = params.muscleGroup as never;
  }

  if (params.equipment) {
    where.equipment = params.equipment as never;
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      select: exerciseSelect,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { name: 'asc' },
    }),
    prisma.exercise.count({ where }),
  ]);

  return paginate(exercises, total, params);
}

export async function getMuscleGroups() {
  return MUSCLE_GROUPS;
}

export async function getById(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    select: exerciseSelect,
  });

  if (!exercise) {
    throw new NotFoundError('Exercise');
  }

  return exercise;
}

export async function create(input: CreateInput, userId: string) {
  const exercise = await prisma.exercise.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      muscleGroup: input.muscleGroup as never,
      equipment: (input.equipment as never) ?? null,
      mediaType: (input.mediaType as never) ?? null,
      isPublic: input.isPublic,
      createdById: userId,
    },
    select: exerciseSelect,
  });

  return exercise;
}

export async function update(id: string, input: UpdateInput, userId: string) {
  const exercise = await prisma.exercise.findUnique({ where: { id } });

  if (!exercise) {
    throw new NotFoundError('Exercise');
  }

  if (exercise.isPredefined) {
    throw new ForbiddenError('Cannot modify predefined exercises');
  }

  if (exercise.createdById && exercise.createdById !== userId) {
    throw new ForbiddenError('Cannot modify another user\'s exercise');
  }

  const updated = await prisma.exercise.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.muscleGroup !== undefined && { muscleGroup: input.muscleGroup as never }),
      ...(input.equipment !== undefined && { equipment: input.equipment as never }),
      ...(input.mediaType !== undefined && { mediaType: input.mediaType as never }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
    },
    select: exerciseSelect,
  });

  return updated;
}

export async function remove(id: string, userId: string) {
  const exercise = await prisma.exercise.findUnique({ where: { id } });

  if (!exercise) {
    throw new NotFoundError('Exercise');
  }

  if (exercise.isPredefined) {
    throw new ForbiddenError('Cannot delete predefined exercises');
  }

  if (exercise.createdById && exercise.createdById !== userId) {
    throw new ForbiddenError('Cannot delete another user\'s exercise');
  }

  await prisma.exercise.delete({ where: { id } });
}
