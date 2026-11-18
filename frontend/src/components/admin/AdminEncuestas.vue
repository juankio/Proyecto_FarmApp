<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppPagination from '../ui/AppPagination.vue';
import { ApiError, apiGet } from '../../composables/useApi';
import type { Encuesta, Paginado } from '../../types/catalogo';
import { formatFecha } from '../../utils/format';

const items = ref<Encuesta[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 8;
const cargando = ref(true);
const error = ref('');

async function cargar(): Promise<void> {
  cargando.value = true;
  error.value = '';
  try {
    const data = await apiGet<Paginado<Encuesta>>(`/encuestas?page=${page.value}&limit=${limit}`);
    items.value = data.items;
    total.value = data.total;
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar las encuestas.';
  } finally {
    cargando.value = false;
  }
}

function cambiarPagina(nueva: number): void {
  page.value = nueva;
  cargar();
}

function estrellas(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

const recomendaron = computed(() => {
  if (!items.value.length) return 0;
  return Math.round((items.value.filter((e) => e.recomendaria === 1).length / items.value.length) * 100);
});

onMounted(cargar);
</script>

<template>
  <div class="admin-card">
    <div class="admin-toolbar">
      <div>
        <h2>Encuestas</h2>
        <p class="hint">
          {{ total }} respuestas · {{ recomendaron }}% de esta página recomienda FarmApp
        </p>
      </div>
    </div>

    <div v-if="cargando" class="loading">Cargando encuestas...</div>

    <template v-else>
      <div v-if="error" class="form-message error">{{ error }}</div>
      <div v-else-if="!items.length" class="empty">Todavía no hay encuestas respondidas.</div>

      <div v-else class="admin-list">
        <article v-for="item in items" :key="item.id" class="admin-item">
          <div class="admin-item-head">
            <div>
              <h3>{{ item.nombre ?? 'Anónimo' }}</h3>
              <span v-if="item.email" class="cell-sub">{{ item.email }}</span>
            </div>
            <div class="item-tags">
              <span class="stars" :aria-label="`${item.calificacion} de 5`">
                {{ estrellas(item.calificacion) }}
              </span>
              <span class="badge" :class="item.recomendaria ? 'ok' : 'warn'">
                {{ item.recomendaria ? 'Recomienda' : 'No recomienda' }}
              </span>
            </div>
          </div>
          <p>{{ item.comentario }}</p>
          <div class="admin-meta">
            <span>{{ formatFecha(item.creado_en) }}</span>
            <span>{{ item.calificacion }}/5</span>
          </div>
        </article>
      </div>

      <AppPagination
        v-if="total > limit"
        :page="page"
        :total="total"
        :limit="limit"
        @update:page="cambiarPagina"
      />
    </template>
  </div>
</template>

<style scoped>
.item-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
