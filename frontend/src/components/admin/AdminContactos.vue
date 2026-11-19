<script setup lang="ts">
import AppPagination from '../ui/AppPagination.vue';
import AppSkeleton from '../ui/AppSkeleton.vue';
import { useContactosStore } from '@/stores/contactos';
import { usePaginatedQuery } from '@/composables/usePaginatedQuery';
import type { Contacto } from '@/types/catalogo';
import { formatFecha } from '@/utils/format';

const store = useContactosStore();

const lastParams = { page: 1, limit: 8 };
const {
  items,
  total,
  page,
  cargando,
  error,
  limit,
  cambiarPagina,
} = usePaginatedQuery<Contacto>({
  endpoint: '/contactos',
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

function responder(item: Contacto): string {
  return `mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.asunto}`)}`;
}
</script>

<template>
  <div class="admin-card">
    <div class="admin-toolbar">
      <div>
        <h2>Mensajes de contacto</h2>
        <p class="hint">{{ total }} mensajes recibidos desde el formulario.</p>
      </div>
    </div>

    <div v-if="cargando" aria-busy="true">
      <p class="sr-only" role="status">Cargando mensajes...</p>
      <div class="admin-list" aria-hidden="true">
        <article v-for="n in 4" :key="n" class="admin-item skeleton-item">
          <div class="skeleton-row">
            <div class="skeleton-stack">
              <AppSkeleton width="46%" height="14px" radius="6px" />
              <AppSkeleton width="64%" height="9px" radius="5px" />
            </div>
            <AppSkeleton width="70px" height="22px" radius="999px" />
          </div>
          <AppSkeleton width="100%" height="10px" radius="5px" />
          <AppSkeleton width="88%" height="10px" radius="5px" />
          <div class="skeleton-row">
            <AppSkeleton width="118px" height="9px" radius="5px" />
            <AppSkeleton width="132px" height="9px" radius="5px" />
          </div>
        </article>
      </div>
    </div>

    <template v-else>
      <div v-if="error" class="form-message error">{{ error }}</div>
      <div v-else-if="!items.length" class="empty">No hay mensajes de contacto todavía.</div>

      <div v-else class="admin-list">
        <article v-for="item in items" :key="item.id" class="admin-item">
          <div class="admin-item-head">
            <div>
              <h3>{{ item.asunto }}</h3>
              <span class="cell-sub">{{ item.nombre }} · {{ item.email }}</span>
            </div>
            <span class="badge" :class="item.leido ? 'ok' : 'new'">
              {{ item.leido ? 'Leído' : 'Nuevo' }}
            </span>
          </div>
          <p>{{ item.mensaje }}</p>
          <div class="admin-meta">
            <span>{{ formatFecha(item.creado_en) }}</span>
            <a :href="responder(item)">Responder por correo</a>
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
.admin-meta a {
  color: var(--blue-deep);
  font-weight: 600;
}

.admin-meta a:hover {
  text-decoration: underline;
}
</style>