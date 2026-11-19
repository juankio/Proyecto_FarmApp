<script setup lang="ts">
import AppPagination from '../ui/AppPagination.vue';
import AppSkeleton from '../ui/AppSkeleton.vue';
import type { Medicamento } from '../../types/catalogo';

defineProps<{
  items: Medicamento[];
  total: number;
  page: number;
  limit: number;
  cargando: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'edit', item: Medicamento): void;
  (e: 'delete', item: Medicamento): void;
  (e: 'update:page', page: number): void;
}>();
</script>

<template>
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
                <button type="button" class="btn-mini" @click="emit('edit', item)">Editar</button>
                <button type="button" class="btn-mini danger" @click="emit('delete', item)">
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
      @update:page="(n: number) => emit('update:page', n)"
    />
  </template>
</template>