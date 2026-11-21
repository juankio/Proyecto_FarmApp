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
    eyebrow="Salud y Ahorro en Villavicencio"
    title="Encuentra tus medicamentos al mejor precio y más cerca de ti."
    lede="Compara precios en tiempo real entre droguerías y boticarios de Villavicencio, localiza farmacias de turno 24 horas y ahorra hasta un 45% en tus fórmulas."
  >
    <template #actions>
      <!-- Buscador Flotante Estilo Airbnb con Sugerencias Inteligentes -->
      <div class="hero-search-wrapper">
        <form class="hero-search-form" @submit.prevent="buscar()">
          <div class="input-container">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="query"
              type="search"
              placeholder="¿Qué medicamento buscas? (ej. Acetaminofén, Ibuprofeno...)"
              aria-label="Buscar medicamento para comparar precios"
              @focus="inputFocused = true"
              @blur="onBlur"
            />
          </div>
          <button type="submit" class="hero-search-btn">
            <span>🔍 Comparar</span>
          </button>
        </form>

        <!-- Dropdown de Sugerencias con Precios Mínimos en Villavicencio -->
        <div v-if="inputFocused && sugerencias.length > 0" class="hero-sug-box">
          <div class="sug-header">Medicamentos frecuentes en Villavicencio</div>
          <div
            v-for="sug in sugerencias"
            :key="sug.medicamentoNombre"
            class="sug-item"
            @mousedown="buscar(sug.medicamentoNombre)"
          >
            <div class="sug-left">
              <strong>{{ sug.medicamentoNombre }}</strong>
              <span class="sug-badge" :class="sug.requiereReceta ? 'badge-receta' : 'badge-libre'">
                {{ sug.requiereReceta ? 'Bajo Fórmula' : 'Venta Libre' }}
              </span>
            </div>
            <div class="sug-right">
              <small>Desde</small>
              <span class="sug-price">{{ formatPrecioCop(sug.mejorPrecio) }}</span>
            </div>
          </div>
        </div>

        <!-- Chips Rápidos de Acceso -->
        <div class="hero-chips-bar">
          <span class="chips-hint">Populares:</span>
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

      <!-- Botones de Acción Hero -->
      <div class="hero-buttons">
        <AppButton size="lg" variant="primary" @click="scrollToRadar">
          📍 Ver Mapa de Farmacias
        </AppButton>
        <AppButton size="lg" variant="secondary" @click="$router.push('/ubicaciones')">
          Directorio de Sedes
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
  max-width: 580px;
  margin-bottom: 16px;
}

.hero-search-form {
  display: flex;
  gap: 8px;
  background: var(--glass-strong);
  padding: 6px;
  border-radius: 999px;
  border: 1px solid var(--line);
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.4), var(--inset);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.hero-search-form:focus-within {
  border-color: var(--blue-bright);
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.25), 0 16px 36px -10px rgba(0, 0, 0, 0.4);
}

[data-theme="light"] .hero-search-form {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.14);
  box-shadow: 0 16px 36px -10px rgba(10, 132, 255, 0.12), inset 0 1px 0 #ffffff;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 16px;
  flex: 1;
}

.input-container svg {
  color: var(--muted);
  flex-shrink: 0;
}

.input-container input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: 0.96rem;
  font-family: inherit;
  outline: none;
}

.hero-search-btn {
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(150deg, #3d9bff, var(--blue-deep));
  color: #ffffff;
  font-weight: 750;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 14px -3px rgba(10, 132, 255, 0.6);
}

.hero-search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px -3px rgba(10, 132, 255, 0.7);
}

/* Chips Populares */
.hero-chips-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.chips-hint {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--muted);
}

.chip-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}

.chip-pill:hover {
  background: var(--line-soft);
  color: var(--ink);
  border-color: var(--blue-bright);
}

/* Dropdown */
.hero-sug-box {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  border-radius: 16px;
  background: var(--bg-1, #0c1426);
  border: 1px solid var(--line);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.65);
  z-index: 100;
  overflow: hidden;
}

[data-theme="light"] .hero-sug-box {
  background: #ffffff;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.16);
}

.sug-header {
  padding: 10px 14px 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  border-bottom: 1px solid var(--line-soft);
}

.sug-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.18s;
  border-bottom: 1px solid var(--line-soft);
}

.sug-item:last-child {
  border-bottom: none;
}

.sug-item:hover {
  background: var(--nav-hover-bg);
}

.sug-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sug-left strong {
  font-size: 0.9rem;
  color: var(--ink);
}

.sug-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-libre {
  background: rgba(48, 209, 88, 0.15);
  color: #30d158;
}

.badge-receta {
  background: rgba(255, 69, 58, 0.15);
  color: #ff453a;
}

.sug-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sug-right small {
  font-size: 0.68rem;
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

.denied {
  margin-top: 16px;
}

@media (max-width: 620px) {
  .hero-search-form {
    flex-direction: column;
    border-radius: 20px;
    padding: 8px;
  }
  .hero-search-btn {
    width: 100%;
    border-radius: 14px;
  }
  .hero-buttons {
    width: 100%;
  }
  .hero-buttons :deep(.app-button) {
    width: 100%;
  }
}
</style>
