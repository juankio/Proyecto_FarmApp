export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
};

export type ApiRequestOptions = RequestInit & {
  timeout?: number;
};

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function baseUrl(): string {
  const env = import.meta.env.VITE_API_BASE;
  if (typeof env === 'string' && env.trim()) {
    const base = env.trim().replace(/\/$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  }
  return '/api';
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  const externalSignal = fetchOptions.signal;
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...fetchOptions,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch {
    window.clearTimeout(timer);
    if (controller.signal.aborted) {
      throw new ApiError(0, 'TIMEOUT', 'La petición excedió el tiempo de espera (10 s).');
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }
  window.clearTimeout(timer);

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Respuesta inválida del servidor');
  }

  if (!body.success) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('farmapp:unauthorized'));
    }
    throw new ApiError(response.status, body.error ?? 'ERROR', body.message);
  }
  return body.data as T;
}

export function apiGet<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(path: string, data: unknown, options?: ApiRequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'POST', body: JSON.stringify(data) });
}

export function apiPut<T>(path: string, data: unknown, options?: ApiRequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(data) });
}

export function apiDelete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'DELETE' });
}