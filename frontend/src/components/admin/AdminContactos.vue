<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminPagination from './AdminPagination.vue';
import { ApiError, apiGet } from '../../composables/useApi';
import type { Contacto, Paginado } from '../../types/admin';
import { formatFecha } from '../../utils/format';

const items = ref<Contacto[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 8;
const cargando = ref(true);
const error = ref('');

async function cargar(): Promise<void> {
  cargando.value = true;
  error.value = '';
  try {
    const data = await apiGet<Paginado<Contacto>>(`/contactos?page=${page.value}&limit=${limit}`);
    items.value = data.items;
    total.value = data.total;
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar los mensajes.';
  } finally {
    cargando.value = false;
  }
}

function cambiarPagina(nueva: number): void {
  page.value = nueva;
  cargar();
}

function responder(item: Contacto): string {
  return `mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.asunto}`)}`;
}

onMounted(cargar);
</script>

<template>
  <div class="admin-card">
    <div class="admin-toolbar">
      <div>
        <h2>Mensajes de contacto</h2>
        <p class="hint">{{ total }} mensajes recibidos desde el formulario.</p>
      </div>
    </div>

    <div v-if="cargando" class="loading">Cargando mensajes...</div>

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

      <AdminPagination
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
  color: var(--blue);
  font-weight: 600;
}

.admin-meta a:hover {
  text-decoration: underline;
}
</style>
