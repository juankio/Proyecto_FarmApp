<script setup lang="ts">
import { computed } from 'vue';
import AppPagination from '../ui/AppPagination.vue';
import AppSkeleton from '../ui/AppSkeleton.vue';
import { useEncuestasStore } from '@/stores/encuestas';
import { usePaginatedQuery } from '@/composables/usePaginatedQuery';
import type { Encuesta } from '@/types/catalogo';
import { formatFecha } from '@/utils/format';

const store = useEncuestasStore();

const lastParams = { page: 1, limit: 8 };
const {
  items,
  total,
  page,
  cargando,
  error,
  limit,
  cambiarPagina,
} = usePaginatedQuery<Encuesta>({
  endpoint: '/encuestas',
  limit: 8,
  buildParams: (p, l) => {
    lastParams.page = p;
    lastParams.limit = l;
    return new URLSearchParams({ page: String(p), limit: String(l) });
  },
  fetcher: async () => {
    await store.fetchList({ page: lastParams.page, limit: lastParams.limit });
    return { items: store.items, total: store.total };
  },
});

function estrellas(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

const recomendaron = computed(() => {
  if (!items.value.length) return 0;
  return Math.round((items.value.filter((e) => e.recomendaria === 1).length / items.value.length) * 100);
});
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

    <div v-if="cargando" aria-busy="true">
      <p class="sr-only" role="status">Cargando encuestas...</p>
      <div class="admin-list" aria-hidden="true">
        <article v-for="n in 4" :key="n" class="admin-item skeleton-item">
          <div class="skeleton-row">
            <div class="skeleton-stack">
              <AppSkeleton width="132px" height="14px" radius="6px" />
              <AppSkeleton width="94px" height="9px" radius="5px" />
            </div>
            <div class="skeleton-tags">
              <AppSkeleton width="78px" height="14px" radius="6px" />
              <AppSkeleton width="86px" height="22px" radius="999px" />
            </div>
          </div>
          <AppSkeleton width="100%" height="10px" radius="5px" />
          <AppSkeleton width="84%" height="10px" radius="5px" />
          <div class="skeleton-row">
            <AppSkeleton width="118px" height="9px" radius="5px" />
            <AppSkeleton width="52px" height="9px" radius="5px" />
          </div>
        </article>
      </div>
    </div>

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