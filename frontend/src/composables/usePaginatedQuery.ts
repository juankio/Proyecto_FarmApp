import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { apiGet } from './useApi';

export type PaginatedResponse<T> = { items: T[]; total: number };

export interface UsePaginatedQueryOptions<T> {
  endpoint: string;
  limit?: number;
  delay?: number;
  minLoadingMs?: number;
  buildParams?: (page: number, limit: number, filtro: string) => URLSearchParams;
  fetcher?: (path: string) => Promise<PaginatedResponse<T>>;
}

export function usePaginatedQuery<T>(options: UsePaginatedQueryOptions<T>) {
  const limit = options.limit ?? 12;
  const delay = options.delay ?? 380;
  const minLoadingMs = options.minLoadingMs ?? 300;
  const fetcher = options.fetcher ?? ((path: string) => apiGet<PaginatedResponse<T>>(path));
  const items = ref<T[]>([]);
  const total = ref(0);
  const page = ref(1);
  const busqueda = ref('');
  const filtro = ref('');
  const cargando = ref(true);
  const error = ref('');
  let temporizador: number | undefined;
  let peticion = 0;

  async function cargar(): Promise<void> {
    const actual = ++peticion;
    cargando.value = true;
    const inicio = performance.now();
    error.value = '';
    const params = options.buildParams?.(page.value, limit, filtro.value) ?? (() => {
      const p = new URLSearchParams({ page: String(page.value), limit: String(limit) });
      if (filtro.value) p.set('q', filtro.value);
      return p;
    })();
    try {
      const data = await fetcher(`${options.endpoint}?${params}`);
      if (actual !== peticion) return;
      items.value = data.items;
      total.value = data.total;
    } catch (e) {
      if (actual !== peticion) return;
      error.value = e instanceof Error ? e.message : 'No se pudieron cargar los datos.';
    } finally {
      if (actual === peticion) {
        const restante = Math.max(0, minLoadingMs - (performance.now() - inicio));
        if (restante > 0) await new Promise((resolve) => setTimeout(resolve, restante));
        cargando.value = false;
      }
    }
  }

  function buscar(): void {
    window.clearTimeout(temporizador);
    filtro.value = busqueda.value.trim();
    page.value = 1;
    cargar();
  }
  function limpiar(): void { busqueda.value = ''; buscar(); }
  function cambiarPagina(nueva: number): void { page.value = nueva; cargar(); }

  watch(busqueda, (valor) => {
    window.clearTimeout(temporizador);
    if (valor.trim() === filtro.value) return;
    temporizador = window.setTimeout(() => {
      filtro.value = valor.trim();
      page.value = 1;
      cargar();
    }, delay);
  });

  onMounted(cargar);
  onBeforeUnmount(() => window.clearTimeout(temporizador));

  return { items, total, page, busqueda, filtro, cargando, error, limit, cargar, buscar, limpiar, cambiarPagina };
}