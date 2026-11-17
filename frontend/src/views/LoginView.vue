<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import { ApiError } from '../composables/useApi';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const email = ref('');
const contrasena = ref('');
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const cargando = ref(false);

async function enviar(): Promise<void> {
  cargando.value = true;
  mensaje.value = 'Iniciando sesión...';
  tipo.value = 'info';
  try {
    await auth.login(email.value, contrasena.value);
    mensaje.value = '¡Bienvenido!';
    tipo.value = 'ok';
    setTimeout(() => router.push('/'), 800);
  } catch (error) {
    mensaje.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <AppCard class="form-card">
    <h1>Iniciar sesión</h1>
    <p>Accede a tu cuenta de FarmApp.</p>
    <form class="form-fields" @submit.prevent="enviar">
      <AppInput v-model="email" type="email" placeholder="Email" required />
      <AppInput v-model="contrasena" type="password" placeholder="Contraseña" required />
      <AppButton type="submit" block :disabled="cargando">Acceder</AppButton>
    </form>
    <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>
    <p class="link">¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
  </AppCard>
</template>

<style scoped>
.link { margin-top: 18px; text-align: center; font-size: .88rem; }
.link a { color: var(--blue); font-weight: 600; }
</style>
