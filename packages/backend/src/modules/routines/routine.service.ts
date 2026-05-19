import { prisma } from '../../common/prisma.js';
import { NotFoundError, ForbiddenError } from '../../common/errors.js';
import { paginate, type PaginationParams } from '../../common/pagination.js';
import type { createRoutineSchema, updateRoutineSchema } from '@gymfree/shared';
import type { z } from 'zod';
import type { Prisma } from '@prisma/client';

type CreateInput = z.infer<typeof createRoutineSchema>;
type UpdateInput = z.infer<typeof updateRoutineSchema>;

interface ListParams extends PaginationParams {
  difficulty?: string;
  userId: string;
}

const routineSelect = {
  id: true,
  name: true,
  description: true,
  difficulty: true,
  estimatedMin: true,
  isPublic: true,
  isPredefined: true,
  createdBy: {
    select: { id: true, username: true },
  },
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { exercises: true },
  },
} satisfies Prisma.RoutineSelect;

const routineDetailSelect = {
  id: true,
  name: true,
  description: true,
  difficulty: true,
  estimatedMin: true,
  isPublic: true,
  isPredefined: true,
  createdBy: {
    select: { id: true, username: true },
  },
  createdAt: true,
  updatedAt: true,
  exercises: {
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      orderIndex: true,
      targetSets: true,
      targetReps: true,
      targetWeight: true,
      restSeconds: true,
      notes: true,
      exercise: {
        select: {
          id: true,
          name: true,
          muscleGroup: true,
          equipment: true,
          mediaUrl: true,
          mediaType: true,
        },
      },
    },
  },
} satisfies Prisma.RoutineSelect;

export async function list(params: ListParams) {
  const where: Prisma.RoutineWhereInput = {
    isPredefined: false,
    OR: [
      { isPublic: true },
      { createdById: params.userId },
    ],
  };

  if (params.difficulty) {
    where.difficulty = params.difficulty as never;
  }

  const [routines, total] = await Promise.all([
    prisma.routine.findMany({
      where,
      select: routineSelect,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.routine.count({ where }),
  ]);

  return paginate(routines, total, params);
}

export async function getPredefined(params: Omit<ListParams, 'userId'>) {
  const where: Prisma.RoutineWhereInput = {
    isPredefined: true,
  };

  if (params.difficulty) {
    where.difficulty = params.difficulty as never;
  }

  const [routines, total] = await Promise.all([
    prisma.routine.findMany({
      where,
      select: routineSelect,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { name: 'asc' },
    }),
    prisma.routine.count({ where }),
  ]);

  return paginate(routines, total, params);
}

export async function getById(id: string, userId: string) {
  const routine = await prisma.routine.findUnique({
    where: { id },
    select: routineDetailSelect,
  });

  if (!routine) {
    throw new NotFoundError('Routine');
  }

  if (!routine.isPublic && !routine.isPredefined && routine.createdBy?.id !== userId) {
    throw new ForbiddenError('Cannot view private routine');
  }

  return routine;
}

export async function create(input: CreateInput, userId: string) {
  const routine = await prisma.routine.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      difficulty: input.difficulty as never,
      estimatedMin: input.estimatedMin ?? null,
      isPublic: input.isPublic,
      createdById: userId,
      exercises: {
        create: input.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps ?? null,
          targetWeight: ex.targetWeight ?? null,
          restSeconds: ex.restSeconds,
          notes: ex.notes ?? null,
        })),
      },
    },
    select: routineDetailSelect,
  });

  return routine;
}

export async function update(id: string, input: UpdateInput, userId: string) {
  const existing = await prisma.routine.findUnique({
    where: { id },
    select: { id: true, isPredefined: true, createdById: true },
  });

  if (!existing) {
    throw new NotFoundError('Routine');
  }

  if (existing.isPredefined) {
    throw new ForbiddenError('Cannot modify predefined routines');
  }

  if (existing.createdById !== userId) {
    throw new ForbiddenError('Cannot modify another user\'s routine');
  }

  const routine = await prisma.$transaction(async (tx) => {
    // Update basic fields
    await tx.routine.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.difficulty !== undefined && { difficulty: input.difficulty as never }),
        ...(input.estimatedMin !== undefined && { estimatedMin: input.estimatedMin }),
        ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
      },
    });

    // If exercises provided, replace all
    if (input.exercises) {
      await tx.routineExercise.deleteMany({ where: { routineId: id } });

      await tx.routineExercise.createMany({
        data: input.exercises.map((ex) => ({
          routineId: id,
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps ?? null,
          targetWeight: ex.targetWeight ?? null,
          restSeconds: ex.restSeconds,
          notes: ex.notes ?? null,
        })),
      });
    }

    return tx.routine.findUnique({
      where: { id },
      select: routineDetailSelect,
    });
  });

  return routine!;
}

export async function remove(id: string, userId: string) {
  const routine = await prisma.routine.findUnique({
    where: { id },
    select: { id: true, isPredefined: true, createdById: true },
  });

  if (!routine) {
    throw new NotFoundError('Routine');
  }

  if (routine.isPredefined) {
    throw new ForbiddenError('Cannot delete predefined routines');
  }

  if (routine.createdById !== userId) {
    throw new ForbiddenError('Cannot delete another user\'s routine');
  }

  await prisma.routine.delete({ where: { id } });
}

export async function clone(id: string, userId: string) {
  const original = await prisma.routine.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!original) {
    throw new NotFoundError('Routine');
  }

  if (!original.isPublic && !original.isPredefined) {
    throw new ForbiddenError('Cannot clone private routine');
  }

  const routine = await prisma.routine.create({
    data: {
      name: `${original.name} (copy)`,
      description: original.description,
      difficulty: original.difficulty,
      estimatedMin: original.estimatedMin,
      isPublic: false,
      createdById: userId,
      exercises: {
        create: original.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetWeight: ex.targetWeight,
          restSeconds: ex.restSeconds,
          notes: ex.notes,
        })),
      },
    },
    select: routineDetailSelect,
  });

  return routine;
}
