import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiGet = vi.fn();
const apiPost = vi.fn();

vi.mock('../composables/useApi', () => ({
  apiGet: (...args: any[]) => apiGet(...args),
  apiPost: (...args: any[]) => apiPost(...args),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

import { useAuthStore } from './auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiGet.mockReset();
    apiPost.mockReset();
  });

  it('estado inicial no autenticado', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isAdmin).toBe(false);
    expect(store.user).toBeNull();
  });

  it('setUser actualiza estado', () => {
    const store = useAuthStore();
    store.setUser({ id: 1, nombres: 'A', apellidos: 'B', email: 'a@b.com', rol: 'admin' });
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(true);
  });

  it('login llama apiPost y fetchMe', async () => {
    apiPost.mockResolvedValue(undefined);
    apiGet.mockResolvedValue({ id: 2, nombres: 'U', apellidos: 'X', email: 'u@x.com', rol: 'usuario' });
    const store = useAuthStore();
    await store.login('u@x.com', 'clave');
    expect(apiPost).toHaveBeenCalledWith('/auth/login', { email: 'u@x.com', contrasena: 'clave' });
    expect(store.user?.email).toBe('u@x.com');
  });

  it('fetchMe valida respuesta', async () => {
    apiGet.mockResolvedValue({ id: 3, nombres: 'Z', apellidos: 'Z', email: 'z@z.com', rol: 'usuario' });
    const store = useAuthStore();
    const u = await store.fetchMe();
    expect(u.email).toBe('z@z.com');
  });

  it('fetchMe lanza si respuesta inválida', async () => {
    apiGet.mockResolvedValue({ foo: 'bar' });
    const store = useAuthStore();
    await expect(store.fetchMe()).rejects.toThrow('Respuesta de usuario inválida');
  });

  it('register setea usuario si respuesta válida', async () => {
    apiPost.mockResolvedValue({ id: 4, nombres: 'N', apellidos: 'A', email: 'n@a.com', rol: 'usuario' });
    const store = useAuthStore();
    await store.register({ nombres: 'N', apellidos: 'A', email: 'n@a.com', contrasena: 'clave' });
    expect(store.user?.email).toBe('n@a.com');
  });

  it('register no lanza si respuesta inválida (backend cookie)', async () => {
    apiPost.mockResolvedValue({ invalid: true });
    const store = useAuthStore();
    await expect(store.register({ nombres: 'N', apellidos: 'A', email: 'n@a.com', contrasena: 'clave' })).resolves.toBeUndefined();
    expect(store.user).toBeNull();
  });

  it('logout limpia user aunque backend falle', async () => {
    apiPost.mockRejectedValue(new Error('boom'));
    const store = useAuthStore();
    store.setUser({ id: 5, nombres: 'X', apellidos: 'Y', email: 'x@y.com', rol: 'usuario' });
    await store.logout();
    expect(store.user).toBeNull();
  });

  it('logout llama endpoint', async () => {
    apiPost.mockResolvedValue(undefined);
    const store = useAuthStore();
    store.setUser({ id: 6, nombres: 'X', apellidos: 'Y', email: 'x@y.com', rol: 'usuario' });
    await store.logout();
    expect(apiPost).toHaveBeenCalledWith('/auth/logout', {});
    expect(store.user).toBeNull();
  });
});