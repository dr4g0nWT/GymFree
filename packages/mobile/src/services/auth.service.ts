import { api } from './api';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@gymfree/shared';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(username: string, email: string, password: string) {
    const data = await api<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },

  async login(email: string, password: string) {
    const data = await api<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },

  async getMe() {
    return api<User>('/api/auth/me', { authenticated: true });
  },

  async updateMe(data: Partial<{ username: string; bio: string; experience: string; isPublic: boolean }>) {
    return api<User>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      authenticated: true,
    });
  },
};
