<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import { ApiError } from '../composables/useApi';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const contrasena = ref('');
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const cargando = ref(false);

const destino = computed(() =>
  typeof route.query.redirect === 'string' ? route.query.redirect : '/',
);

let redireccionTimer: number | undefined;

function programarRedireccion(callback: () => void, delay: number): void {
  window.clearTimeout(redireccionTimer);
  redireccionTimer = window.setTimeout(callback, delay);
}

async function enviar(): Promise<void> {
  cargando.value = true;
  mensaje.value = 'Iniciando sesión...';
  tipo.value = 'info';

  try {
    await auth.login(email.value, contrasena.value);

    if (destino.value.startsWith('/admin') && !auth.isAdmin) {
      mensaje.value = 'Tu cuenta no tiene permisos de administrador.';
      tipo.value = 'error';
      programarRedireccion(() => router.push('/?denied=1'), 1400);
      return;
    }

    mensaje.value = '¡Bienvenido de vuelta!';
    tipo.value = 'ok';
    programarRedireccion(() => router.push(destino.value), 700);
  } catch (error) {
    mensaje.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  } finally {
    cargando.value = false;
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(redireccionTimer);
});
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
