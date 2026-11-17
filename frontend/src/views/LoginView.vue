<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import { ApiError } from '../composables/useApi';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const contrasena = ref('');
const recordar = ref(false);
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const cargando = ref(false);

async function enviar(): Promise<void> {
  cargando.value = true;
  mensaje.value = 'Iniciando sesión...';
  tipo.value = 'info';
  try {
    await auth.login(email.value, contrasena.value);
    mensaje.value = '¡Bienvenido de vuelta!';
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
  <PageHero
    eyebrow="Ingreso"
    title="Iniciar sesión"
    lede="Accede a tu cuenta de FarmApp para continuar donde lo dejaste."
    compact
    centered
  />

  <section class="section reveal">
    <AppCard class="form-card">
      <form class="form-fields" @submit.prevent="enviar">
        <div class="field">
          <label for="login-email">Email</label>
          <AppInput
            id="login-email"
            v-model="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="field">
          <label for="login-pass">Contraseña</label>
          <AppInput
            id="login-pass"
            v-model="contrasena"
            type="password"
            placeholder="Tu contraseña"
            autocomplete="current-password"
            required
          />
        </div>

        <label class="check">
          <input v-model="recordar" type="checkbox" />
          Recordarme
        </label>

        <AppButton type="submit" block size="lg" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </AppButton>
      </form>

      <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>

      <p class="link">
        No tengo una cuenta, quiero <RouterLink to="/registro">registrarme</RouterLink>
      </p>
    </AppCard>
  </section>
</template>
