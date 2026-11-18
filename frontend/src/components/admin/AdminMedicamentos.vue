<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import AdminDialog from './AdminDialog.vue';
import AppPagination from '../ui/AppPagination.vue';
import AppSkeleton from '../ui/AppSkeleton.vue';
import MedicamentoForm from './MedicamentoForm.vue';
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

    <div v-if="cargando" aria-busy="true">
      <p class="sr-only" role="status">Cargando medicamentos...</p>
      <div class="table-scroll" aria-hidden="true">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Laboratorio</th>
              <th>Presentación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 6" :key="n">
              <td>
                <AppSkeleton width="72%" height="13px" radius="5px" />
                <AppSkeleton width="44%" height="9px" radius="5px" style="margin-top: 7px" />
              </td>
              <td><AppSkeleton width="84%" height="11px" radius="5px" /></td>
              <td><AppSkeleton width="64%" height="11px" radius="5px" /></td>
              <td>
                <div class="row-actions">
                  <AppSkeleton width="58px" height="28px" radius="9px" />
                  <AppSkeleton width="58px" height="28px" radius="9px" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template v-else>
      <div v-if="error" class="form-message error">{{ error }}</div>

      <div v-if="!items.length && !error" class="empty">
        No hay medicamentos que coincidan con la búsqueda.
      </div>

      <div v-else-if="items.length" class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Laboratorio</th>
              <th>Presentación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <span class="cell-title">{{ item.nombre }}</span>
                <span v-if="item.concentracion" class="cell-sub">{{ item.concentracion }}</span>
              </td>
              <td>{{ item.laboratorio }}</td>
              <td>{{ item.presentacion }}</td>
              <td>
                <div class="row-actions">
                  <button type="button" class="btn-mini" @click="abrirEditar(item)">Editar</button>
                  <button type="button" class="btn-mini danger" @click="aEliminar = item">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

  <AdminDialog
    :open="dialogo"
    :title="editando ? 'Editar medicamento' : 'Nuevo medicamento'"
    @close="dialogo = false"
  >
    <MedicamentoForm
      v-if="dialogo"
      :medicamento="editando"
      @saved="guardado"
      @close="dialogo = false"
    />
  </AdminDialog>

  <AdminDialog
    :open="Boolean(aEliminar)"
    title="Eliminar medicamento"
    width="420px"
    @close="aEliminar = null"
  >
    <p class="confirm-text">
      ¿Eliminar <strong>{{ aEliminar?.nombre }}</strong>? Esta acción no se puede deshacer.
    </p>
    <div class="form-actions">
      <AppButton variant="secondary" @click="aEliminar = null">Cancelar</AppButton>
      <AppButton variant="danger" :disabled="eliminando" @click="confirmarEliminar">
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
