import { computed, ref } from 'vue';
import { ApiError } from './useApi';
import { isEmail, minLength } from '@/utils/validators';
import { useEncuestasStore } from '@/stores/encuestas';

export type EncuestaFormEstado = 'info' | 'ok' | 'error';

export function useEncuestaForm() {
  const store = useEncuestasStore();

  const nombre = ref('');
  const email = ref('');
  const calificacion = ref('');
  const comentario = ref('');
  const recomendaria = ref(false);
  const mensaje = ref('');
  const tipo = ref<EncuestaFormEstado>('info');

  const enviando = store.loading;
  const loading = store.loading;
  const success = computed(() => tipo.value === 'ok');
  const error = computed(() => (tipo.value === 'error' ? mensaje.value : ''));

  function validar(): string | null {
    const valor = Number(calificacion.value);
    if (!calificacion.value || Number.isNaN(valor) || valor < 1 || valor > 5) {
      return 'Selecciona una calificación.';
    }
    if (!minLength(comentario.value, 10)) {
      return 'El comentario debe tener al menos 10 caracteres.';
    }
    if (email.value.trim() && !isEmail(email.value)) {
      return 'El email no es válido.';
    }
    return null;
  }

  async function enviar(): Promise<void> {
    const problema = validar();
    if (problema) {
      mensaje.value = problema;
      tipo.value = 'error';
      return;
    }
    mensaje.value = 'Registrando tu opinión...';
    tipo.value = 'info';
    try {
      await store.submitEncuesta({
        nombre: nombre.value || undefined,
        email: email.value || undefined,
        calificacion: Number(calificacion.value),
        comentario: comentario.value,
        recomendaria: recomendaria.value,
      });
      mensaje.value = '¡Gracias por participar en la encuesta! Tu opinión nos ayuda a mejorar.';
      tipo.value = 'ok';
      nombre.value = '';
      email.value = '';
      calificacion.value = '';
      comentario.value = '';
      recomendaria.value = false;
    } catch (e) {
      mensaje.value = e instanceof ApiError ? e.message : store.error || 'Ocurrió un error inesperado';
      tipo.value = 'error';
    }
  }

  const submit = enviar;
  const validate = validar;

  return {
    nombre,
    email,
    calificacion,
    comentario,
    recomendaria,
    mensaje,
    tipo,
    enviando,
    loading,
    success,
    error,
    enviar,
    submit,
    validar,
    validate,
  };
}
