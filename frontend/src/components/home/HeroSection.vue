<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '../layout/PageHero.vue';
import AppButton from '../ui/AppButton.vue';
import HeroVisual from './HeroVisual.vue';
import { COMPARATIVA_MEDICAMENTOS } from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';

const route = useRoute();
const router = useRouter();

const query = ref('');
const inputFocused = ref(false);

const CHIPS_RAPIDOS = ['Acetaminofén', 'Ibuprofeno', 'Amoxicilina', 'Loratadina'];

const sugerencias = computed(() => {
  const q = query.value.trim().toLowerCase();
  const list = Object.values(COMPARATIVA_MEDICAMENTOS);
  if (!q) return list.slice(0, 4);
  return list.filter((m) => m.medicamentoNombre.toLowerCase().includes(q)).slice(0, 4);
});

function buscar(term?: string): void {
  const valor = (term ?? query.value).trim();
  if (valor) {
    router.push({ path: '/medicamentos', query: { q: valor } });
  } else {
    router.push('/medicamentos');
  }
}

function scrollToRadar(): void {
  const el = document.getElementById('radar-mapa');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    router.push('/ubicaciones');
  }
}

function onBlur(): void {
  setTimeout(() => {
    inputFocused.value = false;
  }, 250);
}
</script>

<template>
  <PageHero
    eyebrow="Salud y ahorro en Villavicencio"
    title="Encuentra tus medicamentos al mejor precio y más cerca de ti."
    lede="Comparamos precios reales entre droguerías y boticarios de la ciudad. Ubica la farmacia de turno, pide a domicilio y paga menos por tu fórmula."
  >
    <template #actions>
      <div class="hero-search-wrapper">
        <form class="hero-search-form" @submit.prevent="buscar()">
          <span class="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.4" y2="16.4" />
            </svg>
          </span>
          <input
            v-model="query"
            type="search"
            placeholder="Acetaminofén, Ibuprofeno, Losartán…"
            aria-label="Buscar medicamento para comparar precios"
            @focus="inputFocused = true"
            @blur="onBlur"
          />
          <button type="submit" class="hero-search-btn">
            <span>Comparar</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="4" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </button>
        </form>

        <div v-if="inputFocused && sugerencias.length > 0" class="hero-sug-box">
          <div class="sug-header">Frecuentes en Villavicencio</div>
          <div
            v-for="sug in sugerencias"
            :key="sug.medicamentoNombre"
            class="sug-item"
            @mousedown="buscar(sug.medicamentoNombre)"
          >
            <div class="sug-left">
              <strong>{{ sug.medicamentoNombre }}</strong>
              <span class="sug-badge" :class="sug.requiereReceta ? 'badge-receta' : 'badge-libre'">
                {{ sug.requiereReceta ? 'Con fórmula' : 'Venta libre' }}
              </span>
            </div>
            <div class="sug-right">
              <small>Desde</small>
              <span class="sug-price">{{ formatPrecioCop(sug.mejorPrecio) }}</span>
            </div>
          </div>
        </div>

        <div class="hero-chips-bar">
          <span class="chips-hint">Populares</span>
          <button
            v-for="chip in CHIPS_RAPIDOS"
            :key="chip"
            type="button"
            class="chip-pill"
            @click="buscar(chip)"
          >
            {{ chip }}
          </button>
        </div>
      </div>

      <div class="hero-buttons">
        <AppButton size="lg" variant="primary" @click="scrollToRadar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 5.2-8 12-8 12s-8-6.8-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          Ver mapa de farmacias
        </AppButton>
        <AppButton size="lg" variant="secondary" @click="$router.push('/ubicaciones')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <line x1="8" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="8" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.2" />
            <circle cx="4" cy="12" r="1.2" />
            <circle cx="4" cy="18" r="1.2" />
          </svg>
          Directorio de sedes
        </AppButton>
      </div>
    </template>

    <template #media>
      <HeroVisual />
    </template>
  </PageHero>

  <div v-if="route.query.denied" class="denied form-message error">
    No tienes permisos para acceder al panel de administración.
  </div>
</template>

<style scoped>
.hero-search-wrapper {
  position: relative;
  width: 100%;
  max-width: 560px;
  margin-bottom: 18px;
}

.hero-search-form {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-1);
  padding: 6px 6px 6px 4px;
  border-radius: 14px;
  border: 1.5px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(22, 36, 29, 0.9);
  transition: box-shadow 0.18s var(--ease), transform 0.18s var(--ease);
}

.hero-search-form:focus-within {
  transform: translate(-1px, -1px);
  box-shadow: 6px 6px 0 rgba(31, 107, 79, 0.85);
}

.search-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  color: var(--verde);
  flex: 0 0 auto;
}

.input-container,
.hero-search-form input {
  flex: 1;
}

.hero-search-form input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: 0.94rem;
  font-family: inherit;
  padding: 10px 4px;
  outline: none;
  min-width: 0;
}

.hero-search-form input::placeholder {
  color: var(--muted-2);
}

.hero-search-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 10px;
  background: var(--verde);
  color: var(--sobre-acento);
  font-family: inherit;
  font-weight: 700;
  font-size: 0.88rem;
  border: 1px solid var(--verde-deep);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.18s var(--ease), transform 0.18s var(--ease);
}

.hero-search-btn:hover {
  background: var(--verde-deep);
  transform: translateY(-1px);
}

.hero-search-btn svg {
  transition: transform 0.18s var(--ease);
}

.hero-search-btn:hover svg {
  transform: translateX(3px);
}

.hero-chips-bar {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.chips-hint {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-right: 4px;
}

.chip-pill {
  padding: 3px 2px;
  background: none;
  border: 0;
  border-bottom: 1px dashed rgba(31, 107, 79, 0.4);
  border-radius: 0;
  color: var(--ink-soft);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.chip-pill:hover {
  color: var(--verde);
  border-color: var(--verde);
}

.hero-sug-box {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  border-radius: 14px;
  background: var(--bg-1);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-md);
  z-index: 100;
  overflow: hidden;
}

.sug-header {
  padding: 12px 16px 8px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
  border-bottom: 1px solid var(--line-soft);
}

.sug-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  cursor: pointer;
  transition: background 0.18s;
  border-bottom: 1px solid var(--line-soft);
}

.sug-item:last-child {
  border-bottom: none;
}

.sug-item:hover {
  background: rgba(31, 107, 79, 0.06);
}

.sug-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.sug-left strong {
  font-size: 0.9rem;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sug-badge {
  font-size: 0.64rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  white-space: nowrap;
}

.badge-libre {
  background: rgba(31, 107, 79, 0.12);
  color: var(--verde-deep);
}

.badge-receta {
  background: rgba(192, 90, 50, 0.14);
  color: #8f3e1d;
}

.sug-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 0 0 auto;
}

.sug-right small {
  font-size: 0.64rem;
  color: var(--muted);
}

.sug-price {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-buttons :deep(.app-button svg) {
  flex: 0 0 auto;
}

.denied {
  margin-top: 16px;
}

@media (max-width: 620px) {
  .hero-search-form {
    flex-wrap: wrap;
    border-radius: 14px;
  }
  .hero-search-btn {
    width: 100%;
    justify-content: center;
    border-radius: 9px;
  }
  .hero-buttons,
  .hero-buttons :deep(.app-button) {
    width: 100%;
  }
}
</style>
