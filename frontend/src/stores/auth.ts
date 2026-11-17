import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiGet, apiPost, clearToken, getToken, setToken } from '../composables/useApi';

export type Usuario = {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: 'usuario' | 'admin';
  creado_en?: string;
};

type LoginData = { token: string; usuario: Usuario };

const TOKEN_KEY = 'farmapp_token';
const USER_KEY = 'farmapp_user';

function leerUsuario(): Usuario | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken());
  const user = ref<Usuario | null>(leerUsuario());

  const isAuthenticated = computed(() => Boolean(token.value));
  const isAdmin = computed(() => user.value?.rol === 'admin');

  function persistir(usuario: Usuario | null): void {
    user.value = usuario;
    if (usuario) sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
    else sessionStorage.removeItem(USER_KEY);
  }

  async function login(email: string, contrasena: string): Promise<void> {
    const data = await apiPost<LoginData>('/auth/login', { email, contrasena });
    token.value = data.token;
    setToken(data.token);
    persistir(data.usuario);
  }

  async function register(payload: {
    nombres: string;
    apellidos: string;
    email: string;
    contrasena: string;
  }): Promise<void> {
    await apiPost('/auth/register', payload);
  }

  async function fetchMe(): Promise<Usuario> {
    const usuario = await apiGet<Usuario>('/auth/me');
    persistir(usuario);
    return usuario;
  }

  function logout(): void {
    token.value = null;
    clearToken();
    persistir(null);
  }

  return { token, user, isAuthenticated, isAdmin, login, register, fetchMe, logout };
});
