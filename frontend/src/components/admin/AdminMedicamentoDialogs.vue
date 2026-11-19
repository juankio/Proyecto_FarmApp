<script setup lang="ts">
import AppButton from '../ui/AppButton.vue';
import AdminDialog from './AdminDialog.vue';
import MedicamentoForm from './MedicamentoForm.vue';
import type { Medicamento } from '../../types/catalogo';

defineProps<{
  dialogo: boolean;
  editando: Medicamento | null;
  aEliminar: Medicamento | null;
  eliminando: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:dialogo', value: boolean): void;
  (e: 'saved'): void;
  (e: 'delete'): void;
  (e: 'cancel-delete'): void;
}>();
</script>

<template>
  <AdminDialog
    :open="dialogo"
    :title="editando ? 'Editar medicamento' : 'Nuevo medicamento'"
    @close="emit('update:dialogo', false)"
  >
    <MedicamentoForm
      v-if="dialogo"
      :medicamento="editando"
      @saved="emit('saved')"
      @close="emit('update:dialogo', false)"
    />
  </AdminDialog>

  <AdminDialog
    :open="Boolean(aEliminar)"
    title="Eliminar medicamento"
    width="420px"
    @close="emit('cancel-delete')"
  >
    <p class="confirm-text">
      ¿Eliminar <strong>{{ aEliminar?.nombre }}</strong>? Esta acción no se puede deshacer.
    </p>
    <div class="form-actions">
      <AppButton variant="secondary" @click="emit('cancel-delete')">Cancelar</AppButton>
      <AppButton variant="danger" :disabled="eliminando" @click="emit('delete')">
        {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
      </AppButton>
    </div>
  </AdminDialog>
</template>

<style scoped>
.confirm-text {
  font-size: 0.94rem;
  color: var(--ink-soft);
  line-height: 1.55;
}
</style>