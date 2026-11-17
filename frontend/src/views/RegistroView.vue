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

const nombres = ref('');
const apellidos = ref('');
const email = ref('');
const contrasena = ref('');
const terminos = ref(false);
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const cargando = ref(false);

async function enviar(): Promise<void> {
  if (!terminos.value) {
    mensaje.value = 'Debes aceptar los términos y condiciones.';
    tipo.value = 'error';
    return;
  }
  cargando.value = true;
  mensaje.value = 'Registrando usuario...';
  tipo.value = 'info';
  try {
    await auth.register({
      nombres: nombres.value,
      apellidos: apellidos.value,
      email: email.value,
      contrasena: contrasena.value,
    });
    mensaje.value = 'Registro exitoso. Ya puedes iniciar sesión.';
    tipo.value = 'ok';
    setTimeout(() => router.push('/login'), 1100);
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
    eyebrow="Crear cuenta"
    title="Estás a solo un paso"
    lede="Regístrate y forma parte de FarmApp. Guarda tus datos y accede a una experiencia más personalizada."
    compact
    centered
  />

  <section class="section reveal">
    <AppCard class="form-card">
      <form class="form-fields" @submit.prevent="enviar">
        <div class="field">
          <label for="reg-nombres">Nombres</label>
          <AppInput id="reg-nombres" v-model="nombres" placeholder="Tus nombres" required />
        </div>
        <div class="field">
          <label for="reg-apellidos">Apellidos</label>
          <AppInput id="reg-apellidos" v-model="apellidos" placeholder="Tus apellidos" required />
        </div>
        <div class="field">
          <label for="reg-email">Email</label>
          <AppInput
            id="reg-email"
            v-model="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="field">
          <label for="reg-pass">Contraseña</label>
          <AppInput
            id="reg-pass"
            v-model="contrasena"
            type="password"
            placeholder="Mínimo 8 caracteres, una mayúscula y un número"
            autocomplete="new-password"
            required
          />
        </div>

        <label class="check">
          <input v-model="terminos" type="checkbox" />
          Estoy de acuerdo con los términos y condiciones
        </label>

        <AppButton type="submit" block size="lg" :disabled="cargando">
          {{ cargando ? 'Registrando...' : 'Registrar' }}
        </AppButton>
      </form>

      <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>

      <p class="link">
        ¿Ya tienes una cuenta? <RouterLink to="/login">Ingresa aquí</RouterLink>
      </p>
    </AppCard>
  </section>
</template>
