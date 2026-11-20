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
    lede="Compara precios entre droguerías de Villavicencio, consulta disponibilidad inmediata, verifica si requieren receta médica y localiza la farmacia más cercana a tu barrio."
  >
    <template #actions>
      <!-- Buscador Rápido de Medicamentos con Autocompletado -->
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
              placeholder="Ej: Acetaminofén, Ibuprofeno, Amoxicilina..."
              aria-label="Buscar medicamento para comparar precios"
              @focus="inputFocused = true"
              @blur="onBlur"
            />
          </div>
          <button type="submit" class="hero-search-btn">
            Comparar Precios
          </button>
        </form>

        <!-- Dropdown de Sugerencias con Precios Mínimos en Villavicencio -->
        <div v-if="inputFocused && sugerencias.length > 0" class="hero-sug-box">
          <div class="sug-header">Medicamentos populares en Villavicencio</div>
          <div
            v-for="sug in sugerencias"
            :key="sug.medicamentoNombre"
            class="sug-item"
            @mousedown="buscar(sug.medicamentoNombre)"
          >
            <div class="sug-left">
              <strong>{{ sug.medicamentoNombre }}</strong>
              <span class="sug-badge" :class="sug.requiereReceta ? 'badge-receta' : 'badge-libre'">
                {{ sug.requiereReceta ? 'Bajo Receta' : 'Venta Libre' }}
              </span>
            </div>
            <div class="sug-right">
              <small>Desde</small>
              <span class="sug-price">{{ formatPrecioCop(sug.mejorPrecio) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-buttons">
        <AppButton size="lg" variant="secondary" @click="$router.push('/ubicaciones')">
          Droguerías en Villavicencio
        </AppButton>
        <AppButton size="lg" variant="ghost" @click="$router.push('/servicios')">
          Afiliar mi droguería
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
  margin-bottom: 14px;
}

.hero-search-form {
  display: flex;
  gap: 8px;
  background: var(--glass-strong);
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--line);
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.4), var(--inset);
}

[data-theme="light"] .hero-search-form {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 16px 36px -10px rgba(10, 132, 255, 0.14), inset 0 1px 0 #ffffff;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 12px;
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
  padding: 12px 22px;
  border-radius: 14px;
  background: linear-gradient(150deg, #3d9bff, var(--blue-deep));
  color: #ffffff;
  font-weight: 700;
  font-size: 0.92rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s var(--spring), box-shadow 0.2s;
  box-shadow: 0 4px 14px -3px rgba(10, 132, 255, 0.6);
}

.hero-search-btn:hover {
  transform: translateY(-1px);
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
  }
  .hero-search-btn {
    width: 100%;
  }
  .hero-buttons {
    width: 100%;
  }
  .hero-buttons :deep(.app-button) {
    width: 100%;
  }
}
</style>
