<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import { ApiError, apiPost } from '../composables/useApi';

const nombre = ref('');
const email = ref('');
const asunto = ref('');
const mensaje = ref('');
const estado = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');

async function enviar(): Promise<void> {
  estado.value = 'Enviando mensaje...';
  tipo.value = 'info';
  try {
    await apiPost('/contactos', { nombre: nombre.value, email: email.value, asunto: asunto.value, mensaje: mensaje.value });
    estado.value = 'Mensaje enviado. Gracias por escribirnos.';
    tipo.value = 'ok';
    nombre.value = ''; email.value = ''; asunto.value = ''; mensaje.value = '';
  } catch (error) {
    estado.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  }
}
</script>

<template>
  <AppCard class="form-card">
    <h1>Escríbenos</h1>
    <p>¿Tienes una pregunta o sugerencia? Te leemos.</p>
    <form class="form-fields" @submit.prevent="enviar">
      <AppInput v-model="nombre" placeholder="Nombre" required />
      <AppInput v-model="email" type="email" placeholder="Email" required />
      <AppInput v-model="asunto" placeholder="Asunto" required />
      <textarea v-model="mensaje" class="app-textarea" placeholder="Mensaje" minlength="10" required></textarea>
      <AppButton type="submit" block>Enviar mensaje</AppButton>
    </form>
    <div v-if="estado" class="form-message" :class="tipo">{{ estado }}</div>
  </AppCard>
</template>
