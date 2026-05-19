import bcrypt from 'bcryptjs';
import { prisma } from '../../common/prisma.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../common/errors.js';
import type { registerSchema, loginSchema, updateProfileSchema } from '@gymfree/shared';
import type { z } from 'zod';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function register(input: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) {
    throw new ConflictError('Email already registered');
  }

  const existingUsername = await prisma.user.findUnique({ where: { username: input.username } });
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      experience: true,
      totalPoints: true,
      isPublic: true,
      createdAt: true,
    },
  });

  // Create empty ranking entry
  await prisma.ranking.create({
    data: { userId: user.id },
  });

  return { user };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      experience: user.experience,
      totalPoints: user.totalPoints,
      isPublic: user.isPublic,
      createdAt: user.createdAt,
    },
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      experience: true,
      totalPoints: true,
      isPublic: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

export async function getUserProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      bio: true,
      experience: true,
      totalPoints: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          workouts: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Calculate streak
  const lastWorkout = await prisma.workout.findFirst({
    where: { userId: id, endedAt: { not: null } },
    orderBy: { endedAt: 'desc' },
    select: { endedAt: true },
  });

  const currentStreak = calculateStreak(lastWorkout?.endedAt ?? null);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    experience: user.experience,
    totalPoints: user.totalPoints,
    isPublic: user.isPublic,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    workoutsCount: user._count.workouts,
    currentStreak,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateProfile(id: string, input: UpdateProfileInput) {
  if (input.username) {
    const existing = await prisma.user.findUnique({ where: { username: input.username } });
    if (existing && existing.id !== id) {
      throw new ConflictError('Username already taken');
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      bio: true,
      experience: true,
      totalPoints: true,
      isPublic: true,
      updatedAt: true,
    },
  });

  return user;
}

function calculateStreak(lastWorkoutDate: Date | null): number {
  if (!lastWorkoutDate) return 0;

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 1;
  return 0;
}
