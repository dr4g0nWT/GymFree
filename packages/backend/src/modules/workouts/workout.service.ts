import { prisma } from '../../common/prisma.js';
import { NotFoundError, ForbiddenError } from '../../common/errors.js';
import { paginate, type PaginationParams } from '../../common/pagination.js';
import type { startWorkoutSchema, logSetSchema, updateSetSchema } from '@gymfree/shared';
import type { z } from 'zod';

type StartInput = z.infer<typeof startWorkoutSchema>;
type LogSetInput = z.infer<typeof logSetSchema>;
type UpdateSetInput = z.infer<typeof updateSetSchema>;

const workoutDetailSelect = {
  id: true,
  userId: true,
  routine: {
    select: { id: true, name: true },
  },
  startedAt: true,
  endedAt: true,
  durationMin: true,
  notes: true,
  isGymbros: true,
  exercises: {
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      orderIndex: true,
      exercise: {
        select: {
          id: true,
          name: true,
          muscleGroup: true,
          equipment: true,
        },
      },
      sets: {
        orderBy: { setNumber: 'asc' },
        select: {
          id: true,
          setNumber: true,
          weightKg: true,
          reps: true,
          isCompleted: true,
          rpe: true,
          createdAt: true,
        },
      },
    },
  },
} as const;

const workoutSummarySelect = {
  id: true,
  routine: {
    select: { id: true, name: true },
  },
  startedAt: true,
  endedAt: true,
  durationMin: true,
  notes: true,
  isGymbros: true,
  _count: {
    select: {
      exercises: true,
    },
  },
} as const;

export async function startWorkout(input: StartInput, userId: string) {
  // If a routine is specified, copy its exercises
  let exercises: Array<{
    exerciseId: string;
    orderIndex: number;
  }> = [];

  if (input.routineId) {
    const routine = await prisma.routine.findUnique({
      where: { id: input.routineId },
      select: {
        id: true,
        isPublic: true,
        isPredefined: true,
        createdById: true,
        exercises: {
          orderBy: { orderIndex: 'asc' },
          select: {
            exerciseId: true,
            orderIndex: true,
          },
        },
      },
    });

    if (!routine) {
      throw new NotFoundError('Routine');
    }

    if (!routine.isPublic && !routine.isPredefined && routine.createdById !== userId) {
      throw new ForbiddenError('Cannot use private routine');
    }

    exercises = routine.exercises.map((e) => ({
      exerciseId: e.exerciseId,
      orderIndex: e.orderIndex,
    }));
  }

  const workout = await prisma.workout.create({
    data: {
      userId,
      routineId: input.routineId ?? null,
      notes: input.notes ?? null,
      exercises: {
        create: exercises.map((e) => ({
          exerciseId: e.exerciseId,
          orderIndex: e.orderIndex,
        })),
      },
    },
    select: workoutDetailSelect,
  });

  return calculateWorkoutSummary(workout as WorkoutRaw);
}

export async function getActiveWorkout(userId: string) {
  const workout = await prisma.workout.findFirst({
    where: { userId, endedAt: null },
    select: workoutDetailSelect,
  });

  if (!workout) {
    return null;
  }

  return calculateWorkoutSummary(workout as unknown as WorkoutRaw);
}

export async function getWorkoutById(id: string, userId: string) {
  const workout = await prisma.workout.findUnique({
    where: { id },
    select: workoutDetailSelect,
  });

  if (!workout) throw new NotFoundError('Workout');
  if (workout.userId !== userId) throw new ForbiddenError('Cannot view another user\'s workout');

  return calculateWorkoutSummary(workout as unknown as WorkoutRaw);
}

export async function getWorkoutHistory(userId: string, params: PaginationParams) {
  const where = { userId, endedAt: { not: null } };

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where,
      select: workoutSummarySelect,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { startedAt: 'desc' },
    }),
    prisma.workout.count({ where }),
  ]);

  return paginate(workouts, total, params);
}

export async function getWorkoutStats(userId: string) {
  const completedWorkouts = await prisma.workout.findMany({
    where: { userId, endedAt: { not: null } },
    select: {
      id: true,
      durationMin: true,
      exercises: {
        select: {
          exercise: { select: { muscleGroup: true } },
          sets: {
            select: { weightKg: true, reps: true },
          },
        },
      },
    },
  });

  let totalVolume = 0;
  let totalDuration = 0;
  const muscleDistribution: Record<string, number> = {};

  for (const w of completedWorkouts) {
    totalDuration += w.durationMin ?? 0;
    for (const ex of w.exercises) {
      const muscle = ex.exercise.muscleGroup;
      muscleDistribution[muscle] = (muscleDistribution[muscle] ?? 0) + 1;
      for (const set of ex.sets) {
        totalVolume += (set.weightKg ?? 0) * (set.reps ?? 0);
      }
    }
  }

  // Calculate streaks
  const lastWorkout = await prisma.workout.findFirst({
    where: { userId, endedAt: { not: null } },
    orderBy: { endedAt: 'desc' },
    select: { endedAt: true },
  });

  const currentStreak = lastWorkout?.endedAt
    ? calculateStreak(lastWorkout.endedAt)
    : 0;

  return {
    totalWorkouts: completedWorkouts.length,
    totalVolume,
    totalDuration,
    currentStreak,
    longestStreak: 0, // TODO: calculate properly
    personalRecords: 0, // TODO: PR tracking
    weeklyWorkouts: 0, // TODO: weekly aggregation
    muscleDistribution,
  };
}

export async function addExerciseToWorkout(workoutId: string, exerciseId: string, userId: string) {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    select: { userId: true, endedAt: true },
  });

  if (!workout) throw new NotFoundError('Workout');
  if (workout.userId !== userId) throw new ForbiddenError('Cannot modify another user\'s workout');
  if (workout.endedAt) throw new ForbiddenError('Cannot modify completed workout');

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) throw new NotFoundError('Exercise');

  // Get max order index
  const maxOrder = await prisma.workoutExercise.findFirst({
    where: { workoutId },
    orderBy: { orderIndex: 'desc' },
    select: { orderIndex: true },
  });

  const result = await prisma.workoutExercise.create({
    data: {
      workoutId,
      exerciseId,
      orderIndex: (maxOrder?.orderIndex ?? -1) + 1,
    },
    select: {
      id: true,
      orderIndex: true,
      exercise: {
        select: {
          id: true,
          name: true,
          muscleGroup: true,
          equipment: true,
        },
      },
      sets: true,
    },
  });

  return result;
}

export async function logSet(workoutExerciseId: string, input: LogSetInput, userId: string) {
  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    select: {
      workout: { select: { userId: true, endedAt: true } },
    },
  });

  if (!we) throw new NotFoundError('WorkoutExercise');
  if (we.workout.userId !== userId) throw new ForbiddenError('Cannot modify another user\'s workout');
  if (we.workout.endedAt) throw new ForbiddenError('Cannot modify completed workout');

  const set = await prisma.workoutSet.create({
    data: {
      workoutExerciseId,
      setNumber: input.setNumber,
      weightKg: input.weightKg ?? null,
      reps: input.reps ?? null,
      isCompleted: input.isCompleted,
      rpe: input.rpe ?? null,
    },
  });

  return set;
}

export async function updateSet(setId: string, input: UpdateSetInput, userId: string) {
  const existing = await prisma.workoutSet.findUnique({
    where: { id: setId },
    select: {
      workoutExercise: {
        select: {
          workout: { select: { userId: true, endedAt: true } },
        },
      },
    },
  });

  if (!existing) throw new NotFoundError('Set');
  if (existing.workoutExercise.workout.userId !== userId) {
    throw new ForbiddenError('Cannot modify another user\'s set');
  }
  if (existing.workoutExercise.workout.endedAt) {
    throw new ForbiddenError('Cannot modify completed workout');
  }

  const set = await prisma.workoutSet.update({
    where: { id: setId },
    data: {
      ...(input.weightKg !== undefined && { weightKg: input.weightKg }),
      ...(input.reps !== undefined && { reps: input.reps }),
      ...(input.isCompleted !== undefined && { isCompleted: input.isCompleted }),
      ...(input.rpe !== undefined && { rpe: input.rpe }),
    },
  });

  return set;
}

export async function removeSet(setId: string, userId: string) {
  const existing = await prisma.workoutSet.findUnique({
    where: { id: setId },
    select: {
      workoutExercise: {
        select: {
          workout: { select: { userId: true, endedAt: true } },
        },
      },
    },
  });

  if (!existing) throw new NotFoundError('Set');
  if (existing.workoutExercise.workout.userId !== userId) {
    throw new ForbiddenError('Cannot modify another user\'s set');
  }

  await prisma.workoutSet.delete({ where: { id: setId } });
}

export async function completeWorkout(id: string, userId: string) {
  const workout = await prisma.workout.findUnique({
    where: { id },
    select: {
      userId: true,
      endedAt: true,
      startedAt: true,
      exercises: {
        select: {
          exerciseId: true,
          sets: {
            select: {
              weightKg: true,
              reps: true,
              isCompleted: true,
            },
          },
        },
      },
    },
  });

  if (!workout) throw new NotFoundError('Workout');
  if (workout.userId !== userId) throw new ForbiddenError('Cannot complete another user\'s workout');
  if (workout.endedAt) throw new ForbiddenError('Workout already completed');

  const durationMin = Math.round(
    (Date.now() - workout.startedAt.getTime()) / 60000,
  );

  // Calculate totals
  let totalVolume = 0;
  let totalSets = 0;
  let completedSets = 0;
  const prExercises: string[] = [];

  for (const ex of workout.exercises) {
    for (const set of ex.sets) {
      totalSets++;
      if (set.isCompleted) {
        completedSets++;
        totalVolume += (set.weightKg ?? 0) * (set.reps ?? 0);

        // Check PR (simple: highest weight * reps for this exercise)
        const previous = await prisma.workoutSet.findFirst({
          where: {
            workoutExercise: {
              exerciseId: ex.exerciseId,
              workout: { userId, id: { not: id } },
            },
            isCompleted: true,
          },
          orderBy: [{ weightKg: 'desc' }, { reps: 'desc' }],
          select: { weightKg: true, reps: true },
        });

        const current = (set.weightKg ?? 0) * (set.reps ?? 0);
        const prev = (previous?.weightKg ?? 0) * (previous?.reps ?? 0);
        if (current > prev && current > 0) {
          prExercises.push(ex.exerciseId);
        }
      }
    }
  }

  // Update workout
  const updated = await prisma.workout.update({
    where: { id },
    data: {
      endedAt: new Date(),
      durationMin,
    },
    select: workoutDetailSelect,
  });

  // Calculate points
  const setPoints = completedSets * 10;
  const prPoints = prExercises.length * 50;
  const totalPoints = setPoints + prPoints;

  // Update user points
  await prisma.user.update({
    where: { id: userId },
    data: { totalPoints: { increment: totalPoints } },
  });

  // Update ranking
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const weeklyWorkouts = await prisma.workout.count({
    where: { userId, endedAt: { not: null, gte: weekStart } },
  });

  const monthlyWorkouts = await prisma.workout.count({
    where: { userId, endedAt: { not: null, gte: monthStart } },
  });

  await prisma.ranking.upsert({
    where: { userId },
    create: { userId, totalPoints, weekPoints: totalPoints, monthPoints: totalPoints },
    update: {
      totalPoints: { increment: totalPoints },
      weekPoints: totalPoints, // Simplified: real calc would sum
      monthPoints: totalPoints,
    },
  });

  return {
    workout: calculateWorkoutSummary(updated as unknown as WorkoutRaw),
    summary: {
      durationMin,
      totalVolume,
      totalSets,
      completedSets,
      totalPoints,
      newPRs: prExercises.length,
    },
  };
}

// ── Helpers ──

interface WorkoutRaw {
  id: string;
  routine: { id: string; name: string } | null;
  startedAt: Date;
  endedAt: Date | null;
  durationMin: number | null;
  notes: string | null;
  isGymbros: boolean;
  exercises: Array<{
    id: string;
    orderIndex: number;
    exercise: { id: string; name: string; muscleGroup: string; equipment: string | null };
    sets: Array<{
      id: string;
      setNumber: number;
      weightKg: number | null;
      reps: number | null;
      isCompleted: boolean;
      rpe: number | null;
      createdAt: Date;
    }>;
  }>;
}

function calculateWorkoutSummary(w: WorkoutRaw) {
  let totalVolume = 0;
  let totalSets = 0;
  let completedSets = 0;

  for (const ex of w.exercises) {
    for (const set of ex.sets) {
      totalSets++;
      if (set.isCompleted) {
        completedSets++;
        totalVolume += (set.weightKg ?? 0) * (set.reps ?? 0);
      }
    }
  }

  return {
    ...w,
    stats: {
      totalVolume,
      totalSets,
      completedSets,
    },
  };
}

function calculateStreak(date: Date): number {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 1) return 1;
  return 0;
}
