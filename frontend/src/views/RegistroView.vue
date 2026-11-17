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
const nombres = ref('');
const apellidos = ref('');
const email = ref('');
const contrasena = ref('');
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const cargando = ref(false);

async function enviar(): Promise<void> {
  cargando.value = true;
  mensaje.value = 'Registrando usuario...';
  tipo.value = 'info';
  try {
    await auth.register({ nombres: nombres.value, apellidos: apellidos.value, email: email.value, contrasena: contrasena.value });
    mensaje.value = 'Registro exitoso. Ya puedes iniciar sesión.';
    tipo.value = 'ok';
    setTimeout(() => router.push('/login'), 1000);
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
    <h1>Estás a solo un paso</h1>
    <p>Regístrate y forma parte de FarmApp.</p>
    <form class="form-fields" @submit.prevent="enviar">
      <AppInput v-model="nombres" placeholder="Nombres" required />
      <AppInput v-model="apellidos" placeholder="Apellidos" required />
      <AppInput v-model="email" type="email" placeholder="Email" required />
      <AppInput v-model="contrasena" type="password" placeholder="Contraseña" required />
      <AppButton type="submit" block :disabled="cargando">Registrar</AppButton>
    </form>
    <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>
    <p class="link">¿Ya tienes cuenta? <RouterLink to="/login">Ingresa aquí</RouterLink></p>
  </AppCard>
</template>

<style scoped>
.link { margin-top: 18px; text-align: center; font-size: .88rem; }
.link a { color: var(--blue); font-weight: 600; }
</style>
