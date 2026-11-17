const TOKEN_KEY = 'farmapp_token';

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`/api${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Respuesta inválida del servidor');
  }

  if (!body.success) {
    if (response.status === 401) clearToken();
    throw new ApiError(response.status, body.error, body.message);
  }
  return body.data;
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, data) {
  return request(path, { method: 'POST', body: JSON.stringify(data) });
}

export function showMessage(container, text, kind = 'info') {
  if (!container) return;
  container.textContent = text;
  container.className = `form-message ${kind}`;
  container.hidden = false;
}
