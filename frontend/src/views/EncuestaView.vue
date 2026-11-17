<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import { ApiError, apiPost } from '../composables/useApi';

const nombre = ref('');
const email = ref('');
const calificacion = ref('5');
const comentario = ref('');
const recomendaria = ref(true);
const mensaje = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');

async function enviar(): Promise<void> {
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
    mensaje.value = '¡Gracias por participar en la encuesta!';
    tipo.value = 'ok';
    nombre.value = ''; email.value = ''; comentario.value = '';
  } catch (error) {
    mensaje.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  }
}
</script>

<template>
  <AppCard class="form-card">
    <h1>Encuesta FarmApp</h1>
    <p>Tu opinión es muy importante para nosotros.</p>
    <form class="form-fields" @submit.prevent="enviar">
      <AppInput v-model="nombre" placeholder="Nombre (opcional)" />
      <AppInput v-model="email" type="email" placeholder="Email (opcional)" />
      <select v-model="calificacion" class="app-input">
        <option value="5">5 - Excelente</option>
        <option value="4">4 - Buena</option>
        <option value="3">3 - Aceptable</option>
        <option value="2">2 - Regular</option>
        <option value="1">1 - Deficiente</option>
      </select>
      <textarea v-model="comentario" class="app-textarea" placeholder="Cuéntanos tu opinión" minlength="10" required></textarea>
      <label class="check"><input v-model="recomendaria" type="checkbox" /> Recomendaría FarmApp</label>
      <AppButton type="submit" block>Enviar encuesta</AppButton>
    </form>
    <div v-if="mensaje" class="form-message" :class="tipo">{{ mensaje }}</div>
  </AppCard>
</template>

<style scoped>
.check { display: flex; align-items: center; gap: 8px; font-size: .9rem; color: var(--muted); }
.check input { width: 18px; height: 18px; }
</style>
