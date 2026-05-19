import { useAuthStore } from '../stores/auth.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiOptions extends RequestInit {
  authenticated?: boolean;
}

async function refreshToken(): Promise<string | null> {
  const { refreshToken: rt, setTokens, clearTokens } = useAuthStore.getState();
  if (!rt) {
    clearTokens();
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.accessToken, rt);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { authenticated = false, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (authenticated) {
    const { accessToken, clearTokens } = useAuthStore.getState();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  // Auto-refresh on 401
  if (res.status === 401 && authenticated) {
    const newToken = await refreshToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers,
      });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(res.status, error.message ?? 'Unknown error', error);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
