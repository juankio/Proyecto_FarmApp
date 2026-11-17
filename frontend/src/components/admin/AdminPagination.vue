<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ page: number; total: number; limit: number }>();
const emit = defineEmits<{ 'update:page': [page: number] }>();

const paginas = computed(() => Math.max(1, Math.ceil(props.total / props.limit)));
const desde = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.limit + 1));
const hasta = computed(() => Math.min(props.page * props.limit, props.total));

function ir(page: number): void {
  if (page < 1 || page > paginas.value || page === props.page) return;
  emit('update:page', page);
}
</script>

<template>
  <div class="pager">
    <span>{{ desde }}–{{ hasta }} de {{ total }}</span>
    <div class="pager-actions">
      <button type="button" :disabled="page <= 1" @click="ir(page - 1)">Anterior</button>
      <button type="button" :disabled="page >= paginas" @click="ir(page + 1)">Siguiente</button>
    </div>
  </div>
</template>
