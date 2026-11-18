<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '../ui/AppInput.vue';
import AppButton from '../ui/AppButton.vue';
import { ApiError, apiPost, apiPut } from '../../composables/useApi';
import type { Medicamento } from '../../types/catalogo';

const props = defineProps<{ medicamento: Medicamento | null }>();
const emit = defineEmits<{ saved: []; close: [] }>();

const form = ref({
  nombre: props.medicamento?.nombre ?? '',
  laboratorio: props.medicamento?.laboratorio ?? '',
  presentacion: props.medicamento?.presentacion ?? '',
  concentracion: props.medicamento?.concentracion ?? '',
  descripcion: props.medicamento?.descripcion ?? '',
  imagenUrl: props.medicamento?.imagen_url ?? '',
});

const guardando = ref(false);
const error = ref('');

function limpiar(valor: string): string {
  return valor.trim();
}

async function guardar(): Promise<void> {
  error.value = '';

  if (!limpiar(form.value.nombre) || !limpiar(form.value.laboratorio) || !limpiar(form.value.presentacion)) {
    error.value = 'Nombre, laboratorio y presentación son obligatorios.';
    return;
  }

  const payload: Record<string, string> = {
    nombre: limpiar(form.value.nombre),
    laboratorio: limpiar(form.value.laboratorio),
    presentacion: limpiar(form.value.presentacion),
    concentracion: limpiar(form.value.concentracion),
    descripcion: limpiar(form.value.descripcion),
  };

  const imagen = limpiar(form.value.imagenUrl);
  if (imagen) payload.imagenUrl = imagen;

  guardando.value = true;
  try {
    if (props.medicamento) {
      await apiPut(`/medicamentos/${props.medicamento.id}`, payload);
    } else {
      await apiPost('/medicamentos', payload);
    }
    emit('saved');
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudo guardar el medicamento.';
  } finally {
    guardando.value = false;
  }
}
</script>

<template>
  <form class="med-form" @submit.prevent="guardar">
    <div class="grid-two">
      <div class="field">
        <label for="med-nombre">Nombre</label>
        <AppInput id="med-nombre" v-model="form.nombre" placeholder="Acetaminofén" required />
      </div>
      <div class="field">
        <label for="med-lab">Laboratorio</label>
        <AppInput id="med-lab" v-model="form.laboratorio" placeholder="Genfar" required />
      </div>
    </div>

    <div class="grid-two">
      <div class="field">
        <label for="med-pres">Presentación</label>
        <AppInput id="med-pres" v-model="form.presentacion" placeholder="Tabletas 500 mg" required />
      </div>
      <div class="field">
        <label for="med-conc">Concentración</label>
        <AppInput id="med-conc" v-model="form.concentracion" placeholder="500 mg" />
      </div>
    </div>

    <div class="field">
      <label for="med-desc">Descripción</label>
      <textarea
        id="med-desc"
        v-model="form.descripcion"
        class="app-textarea"
        rows="3"
        placeholder="Para qué sirve, indicaciones o notas de uso."
      />
    </div>

    <div class="field">
      <label for="med-img">Imagen (URL)</label>
      <AppInput
        id="med-img"
        v-model="form.imagenUrl"
        type="url"
        placeholder="https://res.cloudinary.com/..."
      />
      <small class="mini-hint">Opcional. Debe ser una URL pública válida.</small>
    </div>

    <div v-if="error" class="form-message error">{{ error }}</div>

    <div class="form-actions">
      <AppButton variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton type="submit" :disabled="guardando">
        {{ guardando ? 'Guardando...' : medicamento ? 'Guardar cambios' : 'Crear medicamento' }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.med-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.mini-hint {
  font-size: 0.74rem;
  color: var(--muted);
}

@media (max-width: 560px) {
  .grid-two {
    grid-template-columns: 1fr;
  }
}
</style>
