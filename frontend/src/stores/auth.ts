import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiGet, apiPost } from '../composables/useApi';

export type Usuario = {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: 'usuario' | 'admin';
  creado_en?: string;
};

function esUsuario(value: unknown): value is Usuario {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.nombres === 'string' &&
    typeof v.apellidos === 'string' &&
    typeof v.email === 'string' &&
    (v.rol === 'usuario' || v.rol === 'admin') &&
    (v.creado_en === undefined || typeof v.creado_en === 'string')
  );
}

function validarUsuario(value: unknown): Usuario {
  if (!esUsuario(value)) {
    throw new Error('Respuesta de usuario inválida');
  }
  return value;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Usuario | null>(null);

  const isAuthenticated = computed(() => Boolean(user.value));
  const isAdmin = computed(() => user.value?.rol === 'admin');

  function setUser(usuario: Usuario | null): void {
    user.value = usuario;
  }

  async function login(email: string, contrasena: string): Promise<void> {
    await apiPost('/auth/login', { email, contrasena });
    await fetchMe();
  }

  async function register(payload: {
    nombres: string;
    apellidos: string;
    email: string;
    contrasena: string;
  }): Promise<void> {
    const data = await apiPost<unknown>('/auth/register', payload);
    try {
      setUser(validarUsuario(data));
    } catch {
      // El backend establece la cookie; el estado se resuelve con fetchMe si aplica.
    }
  }

  async function fetchMe(): Promise<Usuario> {
    const usuario = await apiGet<unknown>('/auth/me');
    const validado = validarUsuario(usuario);
    setUser(validado);
    return validado;
  }

  async function logout(): Promise<void> {
    try {
      await apiPost('/auth/logout', {});
    } catch {
      // Limpieza local aunque el backend falle.
    } finally {
      setUser(null);
    }
  }

  return { user, isAuthenticated, isAdmin, login, register, fetchMe, logout, setUser };
});