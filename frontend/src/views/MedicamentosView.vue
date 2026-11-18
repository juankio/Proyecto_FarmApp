<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppModal from '../components/ui/AppModal.vue';
import AppPagination from '../components/ui/AppPagination.vue';
import AppSkeleton from '../components/ui/AppSkeleton.vue';
import { ApiError, apiGet } from '../composables/useApi';
import type { Medicamento, Paginado } from '../types/catalogo';
import { site } from '../data/site';

const limit = 12;

const items = ref<Medicamento[]>([]);
const total = ref(0);
const page = ref(1);
const busqueda = ref('');
const filtro = ref('');
const cargando = ref(true);
const error = ref('');
const seleccionado = ref<Medicamento | null>(null);

let temporizador: number | undefined;
let peticion = 0;

async function cargar(): Promise<void> {
  const actual = ++peticion;
  cargando.value = true;
  error.value = '';

  const params = new URLSearchParams({ page: String(page.value), limit: String(limit) });
  if (filtro.value) params.set('q', filtro.value);

  try {
    const data = await apiGet<Paginado<Medicamento>>(`/medicamentos?${params}`);
    if (actual !== peticion) return;
    items.value = data.items;
    total.value = data.total;
  } catch (e) {
    if (actual !== peticion) return;
    error.value = e instanceof ApiError ? e.message : 'No se pudo cargar el catálogo.';
  } finally {
    if (actual === peticion) cargando.value = false;
  }
}

function buscar(): void {
  window.clearTimeout(temporizador);
  filtro.value = busqueda.value.trim();
  page.value = 1;
  cargar();
}

function limpiar(): void {
  busqueda.value = '';
  buscar();
}

function cambiarPagina(nueva: number): void {
  page.value = nueva;
  cargar();
}

function abrir(medicamento: Medicamento): void {
  seleccionado.value = medicamento;
}

function dosis(medicamento: Medicamento): string {
  return [medicamento.presentacion, medicamento.concentracion].filter(Boolean).join(' · ');
}

function consulta(medicamento: Medicamento): {
  path: string;
  query: { asunto: string; mensaje: string };
} {
  const laboratorio =
    medicamento.laboratorio === 'Genérico' ? '' : ` de ${medicamento.laboratorio}`;
  return {
    path: '/contactos',
    query: {
      asunto: `Consulta sobre ${medicamento.nombre}`,
      mensaje: `Hola, quiero consultar por ${medicamento.nombre} (${dosis(medicamento)})${laboratorio}. ¿Me pueden orientar?`,
    },
  };
}

const resumen = computed(() => {
  if (cargando.value) return 'Buscando medicamentos...';
  if (!total.value) {
    return filtro.value ? `Sin resultados para “${filtro.value}”` : 'El catálogo está vacío';
  }
  if (filtro.value) {
    return `${total.value} resultado${total.value === 1 ? '' : 's'} para “${filtro.value}”`;
  }
  return `${total.value} medicamentos disponibles`;
});

watch(busqueda, (valor) => {
  window.clearTimeout(temporizador);
  if (valor.trim() === filtro.value) return;
  temporizador = window.setTimeout(() => {
    filtro.value = valor.trim();
    page.value = 1;
    cargar();
  }, 380);
});

onMounted(cargar);
onBeforeUnmount(() => window.clearTimeout(temporizador));
</script>

<template>
  <PageHero
    eyebrow="Catálogo"
    title="Medicamentos"
    lede="Consulta el catálogo de FarmApp: presentaciones, concentraciones y para qué sirve cada medicamento. Si tienes dudas, escríbenos y te orientamos."
    compact
    centered
  />

  <section class="section reveal">
    <div class="catalog-tools glass">
      <form class="catalog-search" role="search" @submit.prevent="buscar">
        <AppInput
          v-model="busqueda"
          placeholder="Buscar por nombre o laboratorio"
          aria-label="Buscar medicamentos"
        />
        <AppButton type="submit" variant="secondary">Buscar</AppButton>
      </form>
      <div class="catalog-meta">
        <p class="catalog-count" aria-live="polite">{{ resumen }}</p>
        <button v-if="filtro" type="button" class="catalog-clear" @click="limpiar">
          Ver todos
        </button>
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

    <div v-else-if="!items.length && !error" class="catalog-empty glass">
      <span class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" stroke-linecap="round" />
        </svg>
      </span>
      <h2>No encontramos ese medicamento</h2>
      <p>Prueba con otro nombre o revisa el catálogo completo.</p>
      <AppButton @click="limpiar">Ver todos</AppButton>
    </div>

    <template v-else>
      <div class="catalog-grid">
        <article v-for="med in items" :key="med.id" class="med-card glass">
          <div class="med-top">
            <span class="med-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path
                  d="M10.6 3.4a5 5 0 0 1 7.1 7.1l-7.2 7.1a5 5 0 0 1-7.1-7.1l7.2-7.1Z"
                  stroke-linecap="round"
                />
                <path d="m6.9 6.9 7.2 7.2" stroke-linecap="round" />
              </svg>
            </span>
            <span class="med-lab">{{ med.laboratorio }}</span>
          </div>

          <h3>{{ med.nombre }}</h3>
          <p class="med-dose">{{ dosis(med) }}</p>
          <p class="med-desc">{{ med.descripcion ?? 'Sin descripción registrada.' }}</p>

          <div class="med-actions">
            <button type="button" class="med-link" @click="abrir(med)">
              Ver detalle <span aria-hidden="true">→</span>
            </button>
            <RouterLink :to="consulta(med)">
              <AppButton size="sm">Consultar</AppButton>
            </RouterLink>
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

      <p class="catalog-note">
        FarmApp no comercializa medicamentos. La información es de referencia y no reemplaza la
        consulta médica. Los medicamentos que requieren fórmula necesitan prescripción.
        ¿Buscas más detalle?
        <a href="https://www.vademecum.es/medicamentos-a_1" target="_blank" rel="noopener">
          Consulta el vademécum
        </a>.
      </p>
    </template>
  </section>

  <AppModal
    :open="Boolean(seleccionado)"
    :title="seleccionado?.nombre ?? ''"
    close-variant="secondary"
    @close="seleccionado = null"
  >
    <div v-if="seleccionado" class="detalle">
      <div class="detalle-facts">
        <div>
          <span>Laboratorio</span>
          <strong>{{ seleccionado.laboratorio }}</strong>
        </div>
        <div>
          <span>Presentación</span>
          <strong>{{ seleccionado.presentacion }}</strong>
        </div>
        <div>
          <span>Concentración</span>
          <strong>{{ seleccionado.concentracion ?? 'No registrada' }}</strong>
        </div>
      </div>

      <p class="detalle-desc">
        {{ seleccionado.descripcion ?? 'Este medicamento aún no tiene descripción registrada.' }}
      </p>

      <div class="detalle-actions">
        <RouterLink :to="consulta(seleccionado)">
          <AppButton block>Consultar disponibilidad</AppButton>
        </RouterLink>
        <a :href="site.redes.whatsapp" target="_blank" rel="noopener">
          <AppButton variant="secondary" block>Escribir por WhatsApp</AppButton>
        </a>
      </div>

      <p class="detalle-note">
        FarmApp no vende medicamentos: te orientamos y te conectamos con los canales de atención.
      </p>
    </div>
  </AppModal>
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
  margin-bottom: 22px;
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
  border: 0;
  border-radius: 9px;
  background: rgba(10, 132, 255, 0.1);
  color: var(--blue-deep);
  font-family: var(--font);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.catalog-clear:hover {
  background: rgba(10, 132, 255, 0.18);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.med-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: var(--radius);
  background: var(--glass);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--depth-sm);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.med-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--inset), var(--depth);
}

.med-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.med-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.16), rgba(126, 224, 192, 0.24));
  border: 1px solid rgba(255, 255, 255, 0.8);
  color: var(--blue-deep);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.med-icon svg {
  width: 24px;
  height: 24px;
}

.med-lab {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(12, 74, 112, 0.1);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.med-card h3 {
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.med-dose {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue-deep);
}

.med-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 10px;
  font-size: 0.88rem;
  color: var(--ink-soft);
}

.med-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 18px;
}

.med-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--blue-deep);
  font-family: var(--font);
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
}

.med-link span {
  display: inline-block;
  transition: transform 0.2s var(--ease);
}

.med-link:hover span {
  transform: translateX(3px);
}

.catalog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: clamp(34px, 6vw, 64px);
  border-radius: var(--radius-lg);
  text-align: center;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background: rgba(10, 132, 255, 0.1);
  color: var(--blue-deep);
}

.empty-icon svg {
  width: 30px;
  height: 30px;
}

.catalog-empty h2 {
  font-size: 1.2rem;
}

.catalog-empty p {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.catalog-note {
  margin-top: 20px;
  font-size: 0.76rem;
  line-height: 1.6;
  color: var(--muted);
  text-align: center;
  max-width: 70ch;
  margin-inline: auto;
}

.catalog-note a {
  color: var(--blue-deep);
  font-weight: 600;
}

.catalog-note a:hover {
  text-decoration: underline;
}

.detalle-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.detalle-facts div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(10, 132, 255, 0.06);
  border: 1px solid rgba(10, 132, 255, 0.1);
}

.detalle-facts span {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.detalle-facts strong {
  font-size: 0.82rem;
  color: var(--ink);
}

.detalle-desc {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--ink-soft);
}

.detalle-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.detalle-actions :deep(.app-button) {
  width: 100%;
}

.detalle-note {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(12, 74, 112, 0.1);
  font-size: 0.76rem;
  line-height: 1.55;
  color: var(--muted);
}

.skeleton {
  gap: 9px;
  min-height: 250px;
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

  .detalle-facts {
    grid-template-columns: 1fr;
  }
}
</style>
