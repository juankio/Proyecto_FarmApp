<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import AdminTable from './AdminTable.vue';
import AdminMedicamentoDialogs from './AdminMedicamentoDialogs.vue';
import { useMedicamentosStore } from '@/stores/medicamentos';
import { usePaginatedQuery } from '@/composables/usePaginatedQuery';
import type { Medicamento } from '@/types/catalogo';
import { ApiError } from '@/composables/useApi';

const store = useMedicamentosStore();

const lastParams = { page: 1, limit: 10, filtro: '' };
const {
  items,
  total,
  page,
  busqueda,
  filtro,
  cargando,
  error,
  limit,
  cargar,
  buscar,
  limpiar,
  cambiarPagina,
} = usePaginatedQuery<Medicamento>({
  endpoint: '/medicamentos',
  limit: 10,
  buildParams: (p, l, f) => {
    lastParams.page = p;
    lastParams.limit = l;
    lastParams.filtro = f;
    const params = new URLSearchParams({ page: String(p), limit: String(l) });
    if (f) params.set('q', f);
    return params;
  },
  fetcher: async () => {
    await store.fetchList({ page: lastParams.page, limit: lastParams.limit, q: lastParams.filtro });
    return { items: store.items, total: store.total };
  },
});

const dialogo = ref(false);
const editando = ref<Medicamento | null>(null);
const aEliminar = ref<Medicamento | null>(null);
const eliminando = ref(false);

function abrirNuevo(): void {
  editando.value = null;
  dialogo.value = true;
}

function abrirEditar(item: Medicamento): void {
  editando.value = item;
  dialogo.value = true;
}

async function confirmarEliminar(): Promise<void> {
  if (!aEliminar.value) return;
  eliminando.value = true;
  try {
    await store.eliminar(aEliminar.value.id);
    aEliminar.value = null;
    if (items.value.length === 1 && page.value > 1) page.value -= 1;
    await cargar();
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudo eliminar el medicamento.';
  } finally {
    eliminando.value = false;
  }
}

function guardado(): void {
  dialogo.value = false;
  cargar();
}

function cambiarPaginaWrapper(nueva: number): void {
  cambiarPagina(nueva);
}
</script>

<template>
  <div class="admin-card">
    <div class="admin-toolbar">
      <div>
        <h2>Medicamentos</h2>
        <p class="hint">Crea, edita o elimina el catálogo que ve el sitio.</p>
      </div>
      <AppButton size="sm" @click="abrirNuevo">Nuevo medicamento</AppButton>
    </div>

    <form class="admin-search" @submit.prevent="buscar">
      <AppInput v-model="busqueda" placeholder="Buscar por nombre o laboratorio" />
      <AppButton type="submit" size="sm" variant="secondary">Buscar</AppButton>
      <button v-if="filtro" type="button" class="btn-mini" @click="limpiar">Limpiar</button>
    </form>

    <AdminTable
      :items="items"
      :total="total"
      :page="page"
      :limit="limit"
      :cargando="cargando"
      :error="error"
      @edit="abrirEditar"
      @delete="(item) => (aEliminar = item)"
      @update:page="cambiarPaginaWrapper"
    />
  </div>

  <AdminMedicamentoDialogs
    :dialogo="dialogo"
    :editando="editando"
    :a-eliminar="aEliminar"
    :eliminando="eliminando"
    @update:dialogo="(v) => (dialogo = v)"
    @saved="guardado"
    @delete="confirmarEliminar"
    @cancel-delete="aEliminar = null"
  />
</template>