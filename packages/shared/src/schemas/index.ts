import { z } from 'zod';
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
  DIFFICULTY,
  EXPERIENCE_LEVEL,
  MEDIA_TYPE,
} from '../constants/index.js';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  bio: z.string().max(500).optional(),
  experience: z.enum(EXPERIENCE_LEVEL).optional(),
  isPublic: z.boolean().optional(),
  avatarUrl: z.string().url().optional(),
});

export const createExerciseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional(),
  muscleGroup: z.enum(MUSCLE_GROUPS),
  equipment: z.enum(EQUIPMENT).optional(),
  mediaType: z.enum(MEDIA_TYPE).optional(),
  isPublic: z.boolean().default(true),
});

export const updateExerciseSchema = createExerciseSchema.partial();

export const createRoutineSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional(),
  difficulty: z.enum(DIFFICULTY).default('BEGINNER'),
  estimatedMin: z.number().int().positive().optional(),
  isPublic: z.boolean().default(true),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string(),
        orderIndex: z.number().int().min(0),
        targetSets: z.number().int().positive().default(3),
        targetReps: z.number().int().positive().optional(),
        targetWeight: z.number().positive().optional(),
        restSeconds: z.number().int().positive().default(90),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1, 'At least one exercise is required'),
});

export const updateRoutineSchema = createRoutineSchema.partial();

export const startWorkoutSchema = z.object({
  routineId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const logSetSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  weightKg: z.number().min(0).optional(),
  reps: z.number().int().min(0).optional(),
  isCompleted: z.boolean().default(false),
  rpe: z.number().int().min(1).max(10).optional(),
});

export const updateSetSchema = z.object({
  weightKg: z.number().min(0).optional(),
  reps: z.number().int().min(0).optional(),
  isCompleted: z.boolean().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
});

export const createGymbrosSessionSchema = z.object({
  partnerUsername: z.string(),
  workoutId: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchExercisesSchema = z.object({
  q: z.string().min(1).max(100),
  muscleGroup: z.enum(MUSCLE_GROUPS).optional(),
  equipment: z.enum(EQUIPMENT).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
