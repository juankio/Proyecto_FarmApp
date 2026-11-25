<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppPagination from '../components/ui/AppPagination.vue';
import AppSkeleton from '../components/ui/AppSkeleton.vue';
import MedicamentoCard from '../components/medicamentos/MedicamentoCard.vue';
import MedicamentoDetailModal from '../components/medicamentos/MedicamentoDetailModal.vue';
import { useMedicamentosStore } from '../stores/medicamentos';
import { usePaginatedQuery } from '../composables/usePaginatedQuery';
import { obtenerComparativa } from '../data/comparador_precios';
import type { Medicamento } from '../types/catalogo';

const route = useRoute();
const store = useMedicamentosStore();

const filtroReceta = ref<'todos' | 'libre' | 'receta'>('todos');
const ordenPrecio = ref<'relevancia' | 'menor-precio'>('relevancia');
const POPULARES = ['Acetaminofén', 'Ibuprofeno', 'Amoxicilina', 'Loratadina', 'Metformina', 'Omeprazol'];

function buscarSugerencia(nombre: string): void {
  busqueda.value = nombre;
  buscar();
}

const {
  items,
  total,
  page,
  busqueda,
  filtro,
  cargando,
  error,
  limit,
  buscar,
  limpiar,
  cambiarPagina,
  cargar,
} = usePaginatedQuery<Medicamento>({
  endpoint: '/medicamentos',
  limit: 12,
  buildParams: (pagina, cantidad, texto) => {
    const params = new URLSearchParams({ page: String(pagina), limit: String(cantidad) });
    if (texto) params.set('q', texto);
    if (filtroReceta.value !== 'todos') params.set('receta', filtroReceta.value);
    return params;
  },
  fetcher: async (path) => {
    const url = new URL(path, window.location.origin);
    const pagina = Number(url.searchParams.get('page') ?? '1');
    const q = url.searchParams.get('q') ?? '';
    const receta = url.searchParams.get('receta') as 'libre' | 'receta' | null;
    return store.fetchList({ page: pagina, limit: 12, q, receta: receta ?? undefined });
  },
});

watch(filtroReceta, () => {
  page.value = 1;
  cargar();
});

onMounted(() => {
  if (route.query.q) {
    busqueda.value = String(route.query.q);
    buscar();
  }
});

function abrir(medicamento: Medicamento): void {
  store.abrirDetalle(medicamento);
}

const itemsFiltrados = computed(() => {
  const list = [...items.value];

  if (ordenPrecio.value === 'menor-precio') {
    list.sort(
      (a, b) =>
        obtenerComparativa(a.nombre).mejorPrecio - obtenerComparativa(b.nombre).mejorPrecio,
    );
  }

  return list;
});

const resumen = computed(() => {
  if (cargando.value) return 'Buscando medicamentos...';
  if (!items.value.length) {
    if (filtroReceta.value === 'receta') {
      return filtro.value
        ? `Sin resultados bajo fórmula médica para “${filtro.value}”`
        : 'No hay medicamentos bajo fórmula médica';
    }
    if (filtroReceta.value === 'libre') {
      return filtro.value
        ? `Sin resultados de venta libre para “${filtro.value}”`
        : 'No hay medicamentos de venta libre';
    }
    return filtro.value ? `Sin resultados para “${filtro.value}”` : 'No hay medicamentos con estos filtros';
  }
  if (filtro.value) {
    return `${total.value} resultado${total.value === 1 ? '' : 's'} para “${filtro.value}”`;
  }
  if (filtroReceta.value === 'receta') return `${total.value} medicamentos bajo fórmula médica`;
  if (filtroReceta.value === 'libre') return `${total.value} medicamentos de venta libre`;
  return `${total.value} medicamentos en Villavicencio`;
});

function cerrarDetalle(): void {
  store.cerrarDetalle();
}
</script>

<template>
  <PageHero
    eyebrow="Precios y Disponibilidad en Villavicencio"
    title="Catálogo de Medicamentos"
    lede="Compara precios entre droguerías de Villavicencio, consulta si requieren prescripción médica y encuentra la opción más económica y cercana a tu barrio."
    compact
    centered
  />

  <section class="section reveal">
    <div class="catalog-tools">
      <form class="catalog-search" role="search" @submit.prevent="buscar">
        <AppInput v-model="busqueda" placeholder="Buscar por nombre o laboratorio" aria-label="Buscar medicamentos" />
        <AppButton type="submit" variant="secondary">Buscar</AppButton>
      </form>
      <div class="catalog-meta">
        <p class="catalog-count" aria-live="polite">{{ resumen }}</p>
        <button v-if="filtro" type="button" class="catalog-clear" @click="limpiar">Ver todos</button>
      </div>
    </div>

    <!-- Barra de Filtros de Prescripción y Orden de Precio -->
    <div class="filter-strip">
      <div class="rx-chips">
        <button
          type="button"
          class="rx-chip"
          :class="{ active: filtroReceta === 'todos' }"
          @click="filtroReceta = 'todos'"
        >
          Todos los tipos
        </button>
        <button
          type="button"
          class="rx-chip rx-chip--libre"
          :class="{ active: filtroReceta === 'libre' }"
          @click="filtroReceta = 'libre'"
        >
          <span class="chip-badge dot-libre" />
          Venta Libre
        </button>
        <button
          type="button"
          class="rx-chip rx-chip--receta"
          :class="{ active: filtroReceta === 'receta' }"
          @click="filtroReceta = 'receta'"
        >
          <span class="chip-badge dot-receta" />
          Bajo Fórmula Médica
        </button>
      </div>

      <div class="sort-wrap">
        <label for="sort-select" class="sort-label">Ordenar:</label>
        <select id="sort-select" v-model="ordenPrecio" class="sort-select">
          <option value="relevancia">Nombre (A-Z)</option>
          <option value="menor-precio">Menor precio en Villavicencio</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="form-message error">{{ error }}</div>
    <p v-if="cargando" class="sr-only" role="status">Cargando medicamentos...</p>

    <div v-if="cargando" class="catalog-grid" aria-busy="true">
      <div v-for="n in 6" :key="n" class="med-card skeleton" aria-hidden="true">
        <div class="skeleton-top">
          <AppSkeleton width="46px" height="46px" radius="14px" />
          <AppSkeleton width="72px" height="20px" radius="999px" />
        </div>
        <AppSkeleton width="68%" height="21px" radius="7px" />
        <AppSkeleton width="44%" height="11px" radius="6px" />
        <AppSkeleton width="100%" height="10px" radius="5px" />
        <AppSkeleton width="92%" height="10px" radius="5px" />
        <AppSkeleton width="62%" height="10px" radius="5px" />
        <div class="skeleton-actions">
          <AppSkeleton width="88px" height="12px" radius="6px" />
          <AppSkeleton width="102px" height="34px" radius="12px" />
        </div>
      </div>
    </div>

    <div v-else-if="!itemsFiltrados.length && !error" class="catalog-empty">
      <span class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" stroke-linecap="round" />
        </svg>
      </span>
      <h2>No encontramos ese medicamento</h2>
      <p>Prueba con otro nombre o revisa el catálogo completo de Villavicencio.</p>
      <div class="sugerencias-busqueda">
        <span>Prueba con:</span>
        <button v-for="nombre in POPULARES" :key="nombre" type="button" @click="buscarSugerencia(nombre)">
          {{ nombre }}
        </button>
      </div>
      <AppButton @click="limpiar">Ver todos</AppButton>
    </div>

    <template v-else>
      <div class="catalog-grid">
        <MedicamentoCard v-for="med in itemsFiltrados" :key="med.id" :medicamento="med" @open="abrir" />
      </div>
      <AppPagination v-if="total > limit" :page="page" :total="total" :limit="limit" @update:page="cambiarPagina" />
      <p class="catalog-note">
        FarmApp no comercializa medicamentos: compara precios y te conecta con droguerías autorizadas en Villavicencio.
        Los medicamentos que requieren fórmula necesitan prescripción médica certificada.
      </p>
    </template>
  </section>

  <MedicamentoDetailModal @close="cerrarDetalle" />
</template>

<style scoped>
.catalog-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 20px;
  margin-bottom: 14px;
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-sm);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
}

.catalog-search {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: min(100%, 320px);
  max-width: 520px;
}

.catalog-search :deep(.app-input) {
  flex: 1;
}

.catalog-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.catalog-count {
  font-size: 0.82rem;
  color: var(--muted);
}

.catalog-clear {
  padding: 6px 10px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: rgba(90, 200, 250, 0.12);
  color: var(--aqua);
  font-family: var(--font);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.catalog-clear:hover {
  background: rgba(10, 132, 255, 0.18);
}

/* Strip de Filtros y Orden */
.filter-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
  padding: 8px 12px;
  border-radius: 14px;
  background: var(--glass);
  border: 1px solid var(--line-soft);
}

.rx-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rx-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s;
}

.rx-chip:hover {
  border-color: var(--blue-bright);
  color: var(--ink);
}

.rx-chip.active {
  background: var(--nav-active-bg);
  border-color: var(--blue);
  color: var(--ink);
}

.chip-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-libre { background: #30d158; }
.dot-receta { background: #ff453a; }

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 600;
}

.sort-select {
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
}

[data-theme="light"] .sort-select {
  background: #ffffff;
  color: #0b1220;
  border-color: rgba(15, 23, 42, 0.14);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 18px;
}

.med-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: var(--radius-md);
  min-height: 250px;
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-sm);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  backdrop-filter: blur(22px) saturate(180%);
}

.skeleton {
  gap: 9px;
}

.skeleton-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 5px;
}

.skeleton-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
}

.catalog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: clamp(34px, 6vw, 64px);
  border-radius: var(--radius-lg);
  text-align: center;
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-sm);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background: rgba(90, 200, 250, 0.12);
  color: var(--aqua);
}

.empty-icon svg {
  width: 30px;
  height: 30px;
}

.sugerencias-busqueda {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.sugerencias-busqueda span {
  font-size: 0.76rem;
  color: var(--muted);
}

.sugerencias-busqueda button {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  background: var(--bg-2);
  color: var(--verde-texto);
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
}

.sugerencias-busqueda button:hover {
  border-color: var(--verde);
}

.catalog-empty h2 {
  font-size: 1.2rem;
}

.catalog-empty p {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.catalog-note {
  margin-top: 24px;
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--muted);
  text-align: center;
  max-width: 70ch;
  margin-inline: auto;
}

@media (max-width: 620px) {
  .catalog-tools {
    flex-direction: column;
    align-items: stretch;
  }
  .catalog-search {
    flex-direction: column;
    max-width: none;
  }
  .catalog-search :deep(.app-button) {
    width: 100%;
  }
  .catalog-meta {
    justify-content: space-between;
  }
  .filter-strip {
    flex-direction: column;
    align-items: flex-start;
  }
  .sort-wrap {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
