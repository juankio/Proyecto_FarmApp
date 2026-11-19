import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastTipo = 'info' | 'ok' | 'error';

export type Toast = { mensaje: string; tipo: ToastTipo; visible: boolean };

export const useUiStore = defineStore('ui', () => {
  const toast = ref<Toast>({ mensaje: '', tipo: 'info', visible: false });
  const modal = ref<string | null>(null);
  const navegando = ref(false);
  let temporizador: number | undefined;

  function showToast(mensaje: string, tipo: ToastTipo = 'info', duracion = 3000): void {
    toast.value = { mensaje, tipo, visible: true };
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      toast.value = { ...toast.value, visible: false };
    }, duracion);
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

  return { toast, modal, navegando, showToast, hideToast, openModal, closeModal, setNavegando };
});