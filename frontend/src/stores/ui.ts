import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export type ToastTipo = 'info' | 'ok' | 'error';

export type Toast = { mensaje: string; tipo: ToastTipo; visible: boolean };

export type Theme = 'light' | 'dark';

const CLAVE_TEMA = 'farmapp-theme';

function esTema(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export const useUiStore = defineStore('ui', () => {
  const toast = ref<Toast>({ mensaje: '', tipo: 'info', visible: false });
  const modal = ref<string | null>(null);
  const navegando = ref(false);
  const theme = ref<Theme>('light');
  let temporizador: number | undefined;

  const isDark = computed(() => theme.value === 'dark');

  function aplicarTema(t: Theme): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  }

  function persistirTema(t: Theme): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(CLAVE_TEMA, t);
    } catch {
      // Ignorar errores de almacenamiento (modo privado, etc.).
    }
  }

  function setTheme(t: Theme): void {
    theme.value = t;
    aplicarTema(t);
    persistirTema(t);
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  }

  function initTheme(): void {
    let elegido: Theme = 'light';
    try {
      if (typeof localStorage !== 'undefined') {
        const guardado = localStorage.getItem(CLAVE_TEMA);
        if (esTema(guardado)) {
          elegido = guardado;
        }
        // Tema claro por defecto: no se respeta prefers-color-scheme automáticamente.
      }
    } catch {
      elegido = 'light';
    }
    setTheme(elegido);
  }

  function showToast(mensaje: string, tipo: ToastTipo = 'info', duracion = 3000): void {
    toast.value = { mensaje, tipo, visible: true };
    if (typeof window !== 'undefined') {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(() => {
        toast.value = { ...toast.value, visible: false };
      }, duracion);
    }
  }

  function hideToast(): void {
    toast.value = { ...toast.value, visible: false };
  }

  function openModal(nombre: string): void {
    modal.value = nombre;
  }

  function closeModal(): void {
    modal.value = null;
  }

  function setNavegando(valor: boolean): void {
    navegando.value = valor;
  }

  return {
    toast,
    modal,
    navegando,
    theme,
    isDark,
    showToast,
    hideToast,
    openModal,
    closeModal,
    setNavegando,
    initTheme,
    toggleTheme,
    setTheme,
  };
});