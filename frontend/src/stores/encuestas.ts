import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ApiError, apiGet, apiPost } from '../composables/useApi';
import type { Encuesta, Paginado } from '../types/catalogo';

export type EncuestaParams = { page?: number; limit?: number };

export type CreateEncuestaInput = {
  nombre?: string;
  email?: string;
  calificacion: number;
  comentario: string;
  recomendaria: boolean;
};

export type EncuestaCreada = { id: number; creadoEn: string };

function mensajeError(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export const useEncuestasStore = defineStore('encuestas', () => {
  const items = ref<Encuesta[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(20);
  const loading = ref(false);
  const error = ref('');
  let peticion = 0;

  const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / (limit.value || 1))));

  async function fetchList(params: EncuestaParams = {}): Promise<Paginado<Encuesta>> {
    const p = params.page ?? page.value;
    const l = params.limit ?? limit.value;
    page.value = p;
    limit.value = l;

    const actual = ++peticion;
    loading.value = true;
    error.value = '';

    try {
      const search = new URLSearchParams({ page: String(p), limit: String(l) });
      const data = await apiGet<Paginado<Encuesta>>(`/encuestas?${search}`);
      if (actual !== peticion) return data;
      items.value = data.items;
      total.value = data.total;
      return data;
    } catch (e) {
      if (actual === peticion) error.value = mensajeError(e, 'No se pudo cargar las encuestas.');
      throw e;
    } finally {
      if (actual === peticion) loading.value = false;
    }
  }

  async function submitEncuesta(data: CreateEncuestaInput): Promise<EncuestaCreada> {
    loading.value = true;
    error.value = '';
    try {
      const creado = await apiPost<EncuestaCreada>('/encuestas', data);
      return creado;
    } catch (e) {
      error.value = mensajeError(e, 'No se pudo registrar la encuesta.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function limpiarError(): void {
    error.value = '';
  }

  return {
    items,
    total,
    page,
    limit,
    loading,
    error,
    totalPaginas,
    fetchList,
    submitEncuesta,
    limpiarError,
  };
});