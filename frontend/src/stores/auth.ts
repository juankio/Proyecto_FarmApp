import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiPost, clearToken, getToken, setToken } from '../composables/useApi';

export type Usuario = { id: number; nombres: string; apellidos: string; email: string; rol: 'usuario' | 'admin' };
type LoginData = { token: string; usuario: Usuario };

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken());
  const user = ref<Usuario | null>(null);
  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(email: string, contrasena: string): Promise<void> {
    const data = await apiPost<LoginData>('/auth/login', { email, contrasena });
    token.value = data.token;
    user.value = data.usuario;
    setToken(data.token);
  }

  async function register(payload: {
    nombres: string; apellidos: string; email: string; contrasena: string;
  }): Promise<void> {
    await apiPost('/auth/register', payload);
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    clearToken();
  }

  return { token, user, isAuthenticated, login, register, logout };
});
