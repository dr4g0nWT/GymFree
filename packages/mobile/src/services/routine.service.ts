import { api } from './api';
import type { Routine } from '@gymfree/shared';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface RoutineFilters {
  page?: number;
  limit?: number;
  difficulty?: string;
}

interface CreateRoutineInput {
  name: string;
  description?: string;
  difficulty: string;
  estimatedMin?: number;
  isPublic?: boolean;
  exercises: Array<{
    exerciseId: string;
    orderIndex: number;
    targetSets: number;
    targetReps?: number;
    restSeconds: number;
    notes?: string;
  }>;
}

export const routineService = {
  async list(filters: RoutineFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.difficulty) params.set('difficulty', filters.difficulty);

    const query = params.toString();
    return api<PaginatedResponse<Routine>>(`/api/routines${query ? `?${query}` : ''}`, {
      authenticated: true,
    });
  },

  async getPredefined(filters: RoutineFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.difficulty) params.set('difficulty', filters.difficulty);

    const query = params.toString();
    return api<PaginatedResponse<Routine>>(`/api/routines/predefined${query ? `?${query}` : ''}`, {
      authenticated: true,
    });
  },

  async getById(id: string) {
    return api<Routine>(`/api/routines/${id}`, { authenticated: true });
  },

  async create(data: CreateRoutineInput) {
    return api<Routine>('/api/routines', {
      method: 'POST',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async update(id: string, data: Partial<CreateRoutineInput>) {
    return api<Routine>(`/api/routines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },

  async delete(id: string) {
    return api<void>(`/api/routines/${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },

  async clone(id: string) {
    return api<Routine>(`/api/routines/${id}/clone`, {
      method: 'POST',
      authenticated: true,
    });
  },
};
