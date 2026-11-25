import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from '../composables/useApi';
import type { Medicamento, Paginado } from '../types/catalogo';

export type MedicamentoParams = {
  page?: number;
  limit?: number;
  q?: string;
  receta?: 'libre' | 'receta';
};

export type CreateMedicamentoInput = {
  nombre: string;
  laboratorio: string;
  presentacion: string;
  concentracion?: string;
  descripcion?: string;
  imagenUrl?: string;
};

export type UpdateMedicamentoInput = Partial<CreateMedicamentoInput>;

function mensajeError(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export const useMedicamentosStore = defineStore('medicamentos', () => {
  const items = ref<Medicamento[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(20);
  const query = ref('');
  const loading = ref(false);
  const error = ref('');
  const seleccionado = ref<Medicamento | null>(null);
  let peticion = 0;

  const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / (limit.value || 1))));
  const medicamentoPorId = computed(() => (id: number) => items.value.find((m) => m.id === id));
  const filtrados = computed(() =>
    query.value.trim()
      ? items.value.filter((m) => {
          const q = query.value.trim().toLowerCase();
          return m.nombre.toLowerCase().includes(q) || m.laboratorio.toLowerCase().includes(q);
        })
      : items.value,
  );

  async function fetchList(params: MedicamentoParams = {}): Promise<Paginado<Medicamento>> {
    const p = params.page ?? page.value;
    const l = params.limit ?? limit.value;
    const q = params.q ?? query.value;
    const receta = params.receta;
    page.value = p;
    limit.value = l;
    query.value = q;

    const actual = ++peticion;
    loading.value = true;
    error.value = '';

    try {
      const search = new URLSearchParams({ page: String(p), limit: String(l) });
      if (q) search.set('q', q);
      if (receta) search.set('receta', receta);
      const data = await apiGet<Paginado<Medicamento>>(`/medicamentos?${search}`);
      if (actual !== peticion) return data;
      items.value = data.items;
      total.value = data.total;
      return data;
    } catch (e) {
      if (actual === peticion) error.value = mensajeError(e, 'No se pudo cargar el catálogo.');
      throw e;
    } finally {
      if (actual === peticion) loading.value = false;
    }
  }

  async function create(data: CreateMedicamentoInput): Promise<Medicamento> {
    loading.value = true;
    error.value = '';
    try {
      const med = await apiPost<Medicamento>('/medicamentos', data);
      items.value = [med, ...items.value];
      total.value += 1;
      return med;
    } catch (e) {
      error.value = mensajeError(e, 'No se pudo crear el medicamento.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, data: UpdateMedicamentoInput): Promise<Medicamento> {
    loading.value = true;
    error.value = '';
    try {
      const med = await apiPut<Medicamento>(`/medicamentos/${id}`, data);
      items.value = items.value.map((m) => (m.id === id ? med : m));
      return med;
    } catch (e) {
      error.value = mensajeError(e, 'No se pudo actualizar el medicamento.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function eliminar(id: number): Promise<void> {
    loading.value = true;
    error.value = '';
    try {
      await apiDelete<{ id: number }>(`/medicamentos/${id}`);
      items.value = items.value.filter((m) => m.id !== id);
      total.value = Math.max(0, total.value - 1);
    } catch (e) {
      error.value = mensajeError(e, 'No se pudo eliminar el medicamento.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function limpiarError(): void {
    error.value = '';
  }

  function abrirDetalle(medicamento: Medicamento): void {
    seleccionado.value = medicamento;
  }

  function cerrarDetalle(): void {
    seleccionado.value = null;
  }

  return {
    items,
    total,
    page,
    limit,
    query,
    loading,
    error,
    seleccionado,
    totalPaginas,
    medicamentoPorId,
    filtrados,
    fetchList,
    create,
    update,
    eliminar,
    delete: eliminar,
    limpiarError,
    abrirDetalle,
    cerrarDetalle,
  };
});