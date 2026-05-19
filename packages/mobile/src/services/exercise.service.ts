import { api } from './api';
import type { Exercise } from '@gymfree/shared';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ExerciseFilters {
  page?: number;
  limit?: number;
  muscleGroup?: string;
  equipment?: string;
  search?: string;
}

export const exerciseService = {
  async list(filters: ExerciseFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.muscleGroup) params.set('muscleGroup', filters.muscleGroup);
    if (filters.equipment) params.set('equipment', filters.equipment);

    const query = params.toString();
    return api<PaginatedResponse<Exercise>>(`/api/exercises${query ? `?${query}` : ''}`, {
      authenticated: true,
    });
  },

  async search(query: string, filters: ExerciseFilters = {}) {
    const params = new URLSearchParams({ q: query });
    if (filters.muscleGroup) params.set('muscleGroup', filters.muscleGroup);
    if (filters.equipment) params.set('equipment', filters.equipment);

    return api<PaginatedResponse<Exercise>>(`/api/exercises/search?${params.toString()}`, {
      authenticated: true,
    });
  },

  async getById(id: string) {
    return api<Exercise>(`/api/exercises/${id}`, { authenticated: true });
  },

  async create(data: {
    name: string;
    description?: string;
    muscleGroup: string;
    equipment?: string;
    isPublic?: boolean;
  }) {
    return api<Exercise>('/api/exercises', {
      method: 'POST',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    muscleGroup: string;
    equipment: string;
    isPublic: boolean;
  }>) {
    return api<Exercise>(`/api/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async delete(id: string) {
    return api<void>(`/api/exercises/${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },

  async getMuscleGroups() {
    return api<{ data: string[] }>('/api/exercises/muscle-groups', { authenticated: true });
  },
};
