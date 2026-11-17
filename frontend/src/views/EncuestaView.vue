<script setup lang="ts">
import { ref } from 'vue';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import { ApiError, apiPost } from '../composables/useApi';

const nombre = ref('');
const email = ref('');
const calificacion = ref('');
const comentario = ref('');
const recomendaria = ref(false);
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const enviando = ref(false);

async function enviar(): Promise<void> {
  enviando.value = true;
  mensaje.value = 'Registrando tu opinión...';
  tipo.value = 'info';
  try {
    await apiPost('/encuestas', {
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
  } catch (error) {
    mensaje.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <PageHero
    eyebrow="Tu opinión cuenta"
    title="Participa en nuestra encuesta"
    lede="Tu opinión es muy importante para nosotros. Completa esta encuesta para ayudarnos a mejorar y brindar un mejor servicio."
    compact
    centered
  />

  <section class="section reveal">
    <AppCard class="form-card">
      <form class="form-fields" @submit.prevent="enviar">
        <div class="field">
          <label for="encuesta-nombre">Nombre (opcional)</label>
          <AppInput id="encuesta-nombre" v-model="nombre" placeholder="Tu nombre" maxlength="80" />
        </div>

        <div class="field">
          <label for="encuesta-email">Email (opcional)</label>
          <AppInput
            id="encuesta-email"
            v-model="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            maxlength="120"
          />
        </div>

        <div class="field">
          <label for="encuesta-calificacion">¿Cómo calificas FarmApp?</label>
          <select id="encuesta-calificacion" v-model="calificacion" class="app-input" required>
            <option value="" disabled>Selecciona una opción</option>
            <option value="1">1 · Deficiente</option>
            <option value="2">2 · Regular</option>
            <option value="3">3 · Aceptable</option>
            <option value="4">4 · Buena</option>
            <option value="5">5 · Excelente</option>
          </select>
        </div>

        <div class="field">
          <label for="encuesta-comentario">Cuéntanos tu opinión</label>
          <textarea
            id="encuesta-comentario"
            v-model="comentario"
            class="app-textarea"
            placeholder="¿Qué te gusta? ¿Qué podríamos mejorar?"
            minlength="10"
            maxlength="1000"
            required
          />
        </div>

        <label class="check">
          <input v-model="recomendaria" type="checkbox" />
          Recomendaría FarmApp a otra persona
        </label>

        <AppButton type="submit" block size="lg" :disabled="enviando">
          {{ enviando ? 'Enviando...' : 'Enviar encuesta' }}
        </AppButton>
      </form>

      <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>
    </AppCard>
  </section>
</template>
