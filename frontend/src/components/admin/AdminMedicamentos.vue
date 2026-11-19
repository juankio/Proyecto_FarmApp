<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import AdminTable from './AdminTable.vue';
import AdminMedicamentoDialogs from './AdminMedicamentoDialogs.vue';
import { ApiError, apiDelete, apiGet } from '../../composables/useApi';
import type { Medicamento, Paginado } from '../../types/catalogo';

const items = ref<Medicamento[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 10;
const busqueda = ref('');
const filtro = ref('');
const cargando = ref(true);
const error = ref('');

const dialogo = ref(false);
const editando = ref<Medicamento | null>(null);
const aEliminar = ref<Medicamento | null>(null);
const eliminando = ref(false);

async function cargar(): Promise<void> {
  cargando.value = true;
  const inicio = performance.now();
  error.value = '';
  try {
    const query = new URLSearchParams({ page: String(page.value), limit: String(limit) });
    if (filtro.value) query.set('q', filtro.value);
    const data = await apiGet<Paginado<Medicamento>>(`/medicamentos?${query}`);
    items.value = data.items;
    total.value = data.total;
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar los medicamentos.';
  } finally {
    const restante = Math.max(0, 300 - (performance.now() - inicio));
    if (restante > 0) await new Promise((resolve) => setTimeout(resolve, restante));
    cargando.value = false;
  }
}

function buscar(): void {
  page.value = 1;
  filtro.value = busqueda.value.trim();
  cargar();
}

function limpiar(): void {
  busqueda.value = '';
  filtro.value = '';
  page.value = 1;
  cargar();
}

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
    await apiDelete(`/medicamentos/${aEliminar.value.id}`);
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

function cambiarPagina(nueva: number): void {
  page.value = nueva;
  cargar();
}

onMounted(cargar);
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
      @update:page="cambiarPagina"
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