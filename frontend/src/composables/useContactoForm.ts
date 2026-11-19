import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ApiError } from './useApi';
import { isEmail, minLength, required } from '@/utils/validators';
import { useAuthStore } from '@/stores/auth';
import { useContactosStore } from '@/stores/contactos';

export type ContactoFormEstado = 'info' | 'ok' | 'error';

export function useContactoForm() {
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const store = useContactosStore();

  const nombre = ref(auth.user ? `${auth.user.nombres} ${auth.user.apellidos}` : '');
  const email = ref(auth.user?.email ?? '');
  const asunto = ref(typeof route.query.asunto === 'string' ? route.query.asunto : '');
  const mensaje = ref(typeof route.query.mensaje === 'string' ? route.query.mensaje : '');
  const estado = ref('');
  const tipo = ref<ContactoFormEstado>('info');

  const enviando = store.loading;
  const loading = store.loading;
  const success = computed(() => tipo.value === 'ok');
  const error = computed(() => (tipo.value === 'error' ? estado.value : ''));

  function validar(): string | null {
    if (!required(nombre.value)) return 'El nombre es obligatorio.';
    if (!required(email.value)) return 'El email es obligatorio.';
    if (!isEmail(email.value)) return 'El email no es válido.';
    if (!required(asunto.value)) return 'El asunto es obligatorio.';
    if (!minLength(mensaje.value, 10)) {
      return 'El mensaje debe tener al menos 10 caracteres.';
    }
    return null;
  }

  async function enviar(): Promise<void> {
    const problema = validar();
    if (problema) {
      estado.value = problema;
      tipo.value = 'error';
      return;
    }
    estado.value = 'Enviando mensaje...';
    tipo.value = 'info';
    try {
      await store.submitContacto({
        nombre: nombre.value,
        email: email.value,
        asunto: asunto.value,
        mensaje: mensaje.value,
      });
      estado.value = 'Mensaje enviado. Gracias por escribirnos, te responderemos pronto.';
      tipo.value = 'ok';
      nombre.value = '';
      email.value = '';
      asunto.value = '';
      mensaje.value = '';
      if (route.query.asunto || route.query.mensaje) router.replace('/contactos');
    } catch (e) {
      estado.value = e instanceof ApiError ? e.message : store.error || 'Ocurrió un error inesperado';
      tipo.value = 'error';
    }
  }

  const submit = enviar;
  const validate = validar;

  return {
    nombre,
    email,
    asunto,
    mensaje,
    estado,
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
