import { api } from './api';
import type { Workout, WorkoutSet } from '@gymfree/shared';

interface WorkoutSummary {
  durationMin: number;
  totalVolume: number;
  totalSets: number;
  completedSets: number;
  totalPoints: number;
  newPRs: number;
}

interface WorkoutWithSummary extends Workout {
  stats: {
    totalVolume: number;
    totalSets: number;
    completedSets: number;
  };
  summary?: WorkoutSummary;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: number;
  weeklyWorkouts: number;
  muscleDistribution: Record<string, number>;
}

export const workoutService = {
  async startWorkout(routineId?: string, notes?: string) {
    return api<WorkoutWithSummary>('/api/workouts', {
      method: 'POST',
      body: JSON.stringify({ routineId, notes }),
      authenticated: true,
    });
  },

  async getActiveWorkout() {
    return api<WorkoutWithSummary | null>('/api/workouts/active', {
      authenticated: true,
    });
  },

  async getWorkoutById(id: string) {
    return api<WorkoutWithSummary>(`/api/workouts/${id}`, {
      authenticated: true,
    });
  },

  async addExercise(workoutId: string, exerciseId: string) {
    return api<WorkoutWithSummary>(`/api/workouts/${workoutId}/exercises`, {
      method: 'POST',
      body: JSON.stringify({ exerciseId }),
      authenticated: true,
    });
  },

  async logSet(workoutExerciseId: string, data: {
    setNumber: number;
    weightKg?: number;
    reps?: number;
    isCompleted?: boolean;
    rpe?: number;
  }) {
    return api<WorkoutSet>(`/api/workouts/${workoutExerciseId}/sets`, {
      method: 'POST',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async updateSet(setId: string, data: Partial<{
    weightKg: number;
    reps: number;
    isCompleted: boolean;
    rpe: number;
  }>) {
    return api<WorkoutSet>(`/api/workouts/sets/${setId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async deleteSet(setId: string) {
    return api<void>(`/api/workouts/sets/${setId}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },

  async completeWorkout(workoutId: string) {
    return api<{ workout: WorkoutWithSummary; summary: WorkoutSummary }>(
      `/api/workouts/${workoutId}/complete`,
      { method: 'POST', authenticated: true }
    );
  },

  async getHistory(page = 1, limit = 20) {
    return api<PaginatedResponse<Workout>>(
      `/api/workouts/history?page=${page}&limit=${limit}`,
      { authenticated: true }
    );
  },

  async getStats() {
    return api<WorkoutStats>('/api/workouts/stats', {
      authenticated: true,
    });
  },
};
