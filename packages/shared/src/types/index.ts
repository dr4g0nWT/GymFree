import type {
  MUSCLE_GROUPS,
  EQUIPMENT,
  DIFFICULTY,
  EXPERIENCE_LEVEL,
  WORKOUT_STATUS,
  SESSION_STATUS,
  MEDIA_TYPE,
} from '../constants/index.js';

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export type Equipment = (typeof EQUIPMENT)[number];
export type Difficulty = (typeof DIFFICULTY)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVEL)[number];
export type WorkoutStatus = (typeof WORKOUT_STATUS)[number];
export type SessionStatus = (typeof SESSION_STATUS)[number];
export type MediaType = (typeof MEDIA_TYPE)[number];

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  experience: ExperienceLevel;
  totalPoints: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  workoutsCount: number;
  currentStreak: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: MuscleGroup;
  equipment: Equipment | null;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  isPublic: boolean;
  isPredefined: boolean;
  createdBy: Pick<User, 'id' | 'username'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  estimatedMin: number | null;
  isPublic: boolean;
  isPredefined: boolean;
  createdBy: Pick<User, 'id' | 'username'> | null;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  orderIndex: number;
  targetSets: number;
  targetReps: number | null;
  targetWeight: number | null;
  restSeconds: number;
  notes: string | null;
}

export interface Workout {
  id: string;
  userId: string;
  routineId: string | null;
  routine: Routine | null;
  startedAt: string;
  endedAt: string | null;
  durationMin: number | null;
  notes: string | null;
  isGymbros: boolean;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  orderIndex: number;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  isCompleted: boolean;
  rpe: number | null;
  createdAt: string;
}

export interface GymbrosSession {
  id: string;
  host: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  partner: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  workoutId: string | null;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
  bonusPoints: number;
  photos: GymbrosPhoto[];
}

export interface GymbrosPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  verified: boolean;
  createdAt: string;
}

export interface Ranking {
  userId: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  totalPoints: number;
  weekPoints: number;
  monthPoints: number;
  rank: number | null;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: number;
  weeklyWorkouts: number;
  muscleDistribution: Record<MuscleGroup, number>;
}
