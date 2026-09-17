// The seam between this app and the Go backend.
//
// In dev, requests go to a same-origin `/api` path that Vite proxies to the
// backend (see vite.config.ts), so there's no CORS in the loop. In
// production the two are deployed separately, so the base URL comes from
// the environment and the backend must send real CORS headers.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init?.method ?? 'GET'} ${path} failed: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
