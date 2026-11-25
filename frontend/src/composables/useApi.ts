export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
};

export type ApiRequestOptions = RequestInit & {
  timeout?: number;
  retries?: number;
};

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_RETRIES = 2;
const BACKOFF_BASE_MS = 400;
const BACKOFF_MAX_MS = 5_000;
const MAX_RETRY_AFTER_MS = 60_000;
const ESTADOS_REINTENTABLES = new Set([408, 429, 502, 503, 504]);

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly retryAfterMs?: number,
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

function esReintentable(error: ApiError): boolean {
  if (error.status === 0) {
    return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
  }
  return ESTADOS_REINTENTABLES.has(error.status);
}

function cabeceraRetryAfter(response: Response): number | undefined {
  const valor = response.headers.get('retry-after');
  if (!valor) return undefined;
  const segundos = Number(valor);
  if (Number.isFinite(segundos)) {
    return Math.min(Math.max(segundos, 0) * 1000, MAX_RETRY_AFTER_MS);
  }
  const fecha = Date.parse(valor);
  if (Number.isNaN(fecha)) return undefined;
  return Math.min(Math.max(fecha - Date.now(), 0), MAX_RETRY_AFTER_MS);
}

function demoraDeReintento(error: ApiError, intento: number): number {
  if (error.retryAfterMs !== undefined) return error.retryAfterMs;
  const exponencial = Math.min(BACKOFF_BASE_MS * 2 ** intento, BACKOFF_MAX_MS);
  return Math.round(exponencial * (0.5 + Math.random() * 0.5));
}

function esperar(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    let id = 0;
    const finalizar = (): void => {
      window.clearTimeout(id);
      resolve();
    };
    id = window.setTimeout(() => {
      signal?.removeEventListener('abort', finalizar);
      resolve();
    }, ms);
    signal?.addEventListener('abort', finalizar, { once: true });
  });
}

async function intentoUnico<T>(path: string, options: ApiRequestOptions): Promise<T> {
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
    if (externalSignal?.aborted) throw new ApiError(0, 'ABORTED', 'Petición cancelada');
    if (controller.signal.aborted) {
      throw new ApiError(0, 'TIMEOUT', `La petición excedió el tiempo de espera (${timeout / 1000} s).`);
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }
  window.clearTimeout(timer);

  const retryAfterMs = cabeceraRetryAfter(response);
  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Respuesta inválida del servidor', retryAfterMs);
  }

  if (!body.success) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('farmapp:unauthorized'));
    }
    throw new ApiError(response.status, body.error ?? 'ERROR', body.message, retryAfterMs);
  }
  return body.data as T;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { retries = DEFAULT_RETRIES, ...opcionesIntento } = options;
  const signal = options.signal ?? undefined;
  let intento = 0;

  while (true) {
    if (signal?.aborted) throw new ApiError(0, 'ABORTED', 'Petición cancelada');
    try {
      return await intentoUnico<T>(path, opcionesIntento);
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) throw error;
      if (intento >= retries || !esReintentable(error)) throw error;
      await esperar(demoraDeReintento(error, intento), signal);
      intento++;
    }
  }
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
