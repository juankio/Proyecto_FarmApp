<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MapaVillavicencio from '../ubicaciones/MapaVillavicencio.vue';
import AppButton from '../ui/AppButton.vue';
import {
  BARRIOS_VILLAVICENCIO,
  Drogueria,
  drogueriasVillavicencio,
  obtenerCadenaInfo,
} from '../../data/droguerias';
import {
  COMPARATIVA_MEDICAMENTOS,
  InfoComparativa,
  obtenerComparativa,
} from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';

const router = useRouter();
const mapaRef = ref<any>(null);

function enfocarEnMapa(id: number) {
  mapaRef.value?.enfocarDrogueria(id);
}

// Estados reactivos de búsqueda y filtrado
const busqueda = ref('');
const inputFocused = ref(false);
const barrioSeleccionado = ref<string>('Todos los barrios');
const medicamentoActivo = ref<string>('Acetaminofén');
const solo24h = ref(false);
const soloDomicilio = ref(false);
const soloBoticarios = ref(false);
const criterioOrden = ref<'precio' | 'distancia'>('precio');

// Geolocalización del usuario
const userLat = ref<number | null>(null);
const userLng = ref<number | null>(null);
const calculandoGps = ref(false);
const gpsActivo = ref(false);
const errorGps = ref('');

// Cálculo de distancia en km con fórmula de Haversine
function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatearDistancia(km?: number): string {
  if (km === undefined) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function solicitarGps(): void {
  if (!navigator.geolocation) {
    errorGps.value = 'Tu dispositivo no soporta geolocalización.';
    return;
  }
  calculandoGps.value = true;
  errorGps.value = '';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude;
      userLng.value = pos.coords.longitude;
      gpsActivo.value = true;
      calculandoGps.value = false;
      criterioOrden.value = 'distancia'; // Al activar GPS, sugerimos ordenar por cercanía
    },
    () => {
      errorGps.value = 'No pudimos acceder a tu ubicación. Selecciona tu barrio en el menú.';
      calculandoGps.value = false;
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

// Lista de medicamentos sugeridos para chips rápidos
const MEDICAMENTOS_POPULARES = [
  'Acetaminofén',
  'Ibuprofeno',
  'Amoxicilina',
  'Loratadina',
  'Metformina',
  'Omeprazol',
  'Losartán',
];

const infoMedActual = computed<InfoComparativa>(() => {
  return obtenerComparativa(medicamentoActivo.value || 'Acetaminofén');
});

// Droguerías procesadas con precios inyectados y distancias
export type DrogueriaConPrecio = Drogueria & {
  distanciaKm?: number;
  precioOferta?: number;
  esMejorPrecio?: boolean;
};

const drogueriasResultado = computed<DrogueriaConPrecio[]>(() => {
  const ofertasMap = new Map<number, number>();
  if (infoMedActual.value && infoMedActual.value.ofertas) {
    infoMedActual.value.ofertas.forEach((o) => {
      ofertasMap.set(o.drogueriaId, o.precio);
    });
  }

  let lista: DrogueriaConPrecio[] = drogueriasVillavicencio.map((d) => {
    let distancia: number | undefined = undefined;
    if (userLat.value !== null && userLng.value !== null) {
      distancia = calcularDistanciaKm(userLat.value, userLng.value, d.lat, d.lng);
    }
    const precio = ofertasMap.get(d.id);
    return {
      ...d,
      distanciaKm: distancia,
      precioOferta: precio,
      esMejorPrecio: precio === infoMedActual.value.mejorPrecio,
    };
  });

  // Filtro por barrio
  if (barrioSeleccionado.value !== 'Todos los barrios') {
    lista = lista.filter((d) => d.barrio === barrioSeleccionado.value);
  }

  // Filtros rápidos
  if (solo24h.value) lista = lista.filter((d) => d.es24h);
  if (soloDomicilio.value) lista = lista.filter((d) => d.domicilio);
  if (soloBoticarios.value) lista = lista.filter((d) => d.cadena === 'Independiente');

  // Filtro por búsqueda libre
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase().trim();
    lista = lista.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        d.cadena.toLowerCase().includes(q) ||
        d.barrio.toLowerCase().includes(q),
    );
  }

  // Ordenamiento inteligente: Por precio o por distancia
  return lista.sort((a, b) => {
    if (criterioOrden.value === 'precio') {
      // Los que tienen precio publicado van primero
      const pA = a.precioOferta ?? 999999;
      const pB = b.precioOferta ?? 999999;
      if (pA !== pB) return pA - pB;
      // Si empatan en precio o no tienen, desempatar por distancia
      return (a.distanciaKm ?? 999) - (b.distanciaKm ?? 999);
    } else {
      // Ordenar por distancia (menor a mayor)
      const dA = a.distanciaKm ?? (a.afiliada ? 0.5 : 999);
      const dB = b.distanciaKm ?? (b.afiliada ? 0.5 : 999);
      return dA - dB;
    }
  });
});

function seleccionarMedicamento(med: string): void {
  medicamentoActivo.value = med;
  busqueda.value = '';
}

function generarLinkWhatsApp(drog: DrogueriaConPrecio): string {
  const med = infoMedActual.value.medicamentoNombre;
  const precioTxt = drog.precioOferta ? ` (${formatPrecioCop(drog.precioOferta)})` : '';
  const msg = encodeURIComponent(
    `Hola ${drog.nombre}, los vi en el Radar FarmApp Villavicencio y deseo consultar disponibilidad para ${med}${precioTxt}. ¿Tienen servicio en mi barrio?`,
  );
  return `https://wa.me/${drog.whatsapp}?text=${msg}`;
}
</script>

<template>
  <section class="map-hub">
    <!-- Fondos Caústicos y Luces Ambientales -->
    <div class="hub-ambient" aria-hidden="true">
      <div class="ambient-glow glow-blue" />
      <div class="ambient-glow glow-aqua" />
      <div class="ambient-grid-overlay" />
    </div>

    <!-- Encabezado Hero con Insignias de Valor -->
    <div class="hub-header">
      <div class="hub-badges">
        <span class="live-pill">
          <span class="live-dot" />
          Radar Geográfico en Vivo
        </span>
        <span class="meta-pill">📍 Villavicencio, Meta</span>
        <span class="savings-pill">💰 Ahorro hasta del 45%</span>
      </div>

      <h1 class="hub-title">
        Encuentra tus medicamentos al <span class="highlight-price">mejor precio</span> y a <span class="highlight-dist">menor distancia</span>
      </h1>
      <p class="hub-lede">
        Compara en tiempo real entre droguerías de cadena y boticarios de barrio en Villavicencio.
        Revisa disponibilidad, precios verificados, farmacias de turno 24 horas y pide a domicilio.
      </p>

      <!-- Selector de Medicamentos Rápidos para Comparar -->
      <div class="med-chips-container">
        <span class="chips-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
            <path d="m8.5 8.5 7 7" />
          </svg>
          Comparar precio de:
        </span>
        <div class="chips-list">
          <button
            v-for="med in MEDICAMENTOS_POPULARES"
            :key="med"
            type="button"
            class="med-chip"
            :class="{ active: medicamentoActivo === med }"
            @click="seleccionarMedicamento(med)"
          >
            {{ med }}
          </button>
        </div>
      </div>

      <!-- Barra de Filtros Inteligentes -->
      <div class="hub-controls-bar">
        <div class="search-input-box">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="busqueda"
            type="search"
            placeholder="Buscar por droguería, medicamento o dirección..."
            aria-label="Buscar droguería o medicamento"
          />
        </div>

        <div class="neighborhood-select-box">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <select v-model="barrioSeleccionado" aria-label="Filtrar por barrio">
            <option v-for="barrio in BARRIOS_VILLAVICENCIO" :key="barrio" :value="barrio">
              {{ barrio }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="gps-action-btn"
          :class="{ active: gpsActivo, loading: calculandoGps }"
          @click="solicitarGps"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>{{ gpsActivo ? 'Cerca de ti (GPS)' : 'Usar mi GPS' }}</span>
        </button>
      </div>

      <!-- Fila de Filtros Rápidos y Selector de Orden -->
      <div class="hub-toggle-row">
        <div class="filters-group">
          <button
            type="button"
            class="toggle-pill"
            :class="{ active: solo24h }"
            @click="solo24h = !solo24h"
          >
            <span>🌙</span> 24 Horas
          </button>
          <button
            type="button"
            class="toggle-pill"
            :class="{ active: soloDomicilio }"
            @click="soloDomicilio = !soloDomicilio"
          >
            <span>🛵</span> Con Domicilio
          </button>
          <button
            type="button"
            class="toggle-pill"
            :class="{ active: soloBoticarios }"
            @click="soloBoticarios = !soloBoticarios"
          >
            <span>🏺</span> Boticarios de Barrio
          </button>
        </div>

        <div class="sort-group">
          <span class="sort-label">Ordenar:</span>
          <button
            type="button"
            class="sort-pill"
            :class="{ active: criterioOrden === 'precio' }"
            @click="criterioOrden = 'precio'"
          >
            🏆 Mejor Precio
          </button>
          <button
            type="button"
            class="sort-pill"
            :class="{ active: criterioOrden === 'distancia' }"
            @click="criterioOrden = 'distancia'"
          >
            📍 Menor Distancia
          </button>
        </div>
      </div>
    </div>

    <!-- Panel Dividido (Layout Split Map-First) -->
    <div class="hub-stage-grid">
      <!-- Visor del Mapa de Villavicencio -->
      <div class="map-viewport-wrapper">
        <div class="map-top-legend">
          <div class="legend-item">
            <span class="legend-color dot-rebaja" /> La Rebaja
          </div>
          <div class="legend-item">
            <span class="legend-color dot-cruz" /> Cruz Verde
          </div>
          <div class="legend-item">
            <span class="legend-color dot-copifam" /> Copifam
          </div>
          <div class="legend-item">
            <span class="legend-color dot-indie" /> 🏺 Boticarios
          </div>
          <div class="legend-item">
            <span class="legend-badge-24h">24H</span> De Turno
          </div>
        </div>

        <MapaVillavicencio
          ref="mapaRef"
          :droguerias="drogueriasResultado"
          :user-lat="userLat"
          :user-lng="userLng"
          :barrio-seleccionado="barrioSeleccionado"
        />
      </div>

      <!-- Radar de Resultados en Vivo & Tarjeta de Ahorro -->
      <div class="results-sidebar">
        <!-- Tarjeta Informativa del Medicamento Comparado -->
        <div class="med-summary-card">
          <div class="med-summary-header">
            <div class="med-meta">
              <span class="med-cat-tag">{{ infoMedActual.categoria }}</span>
              <h3 class="med-name">{{ infoMedActual.medicamentoNombre }}</h3>
            </div>
            <div class="med-best-price-badge">
              <span class="best-label">Mejor Precio</span>
              <span class="best-val">{{ formatPrecioCop(infoMedActual.mejorPrecio) }}</span>
            </div>
          </div>

          <div class="savings-difference-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#30d158" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>
              Ahorras hasta <strong>{{ formatPrecioCop(infoMedActual.precioPromedio - infoMedActual.mejorPrecio) }}</strong> comparando en farmacias locales.
            </span>
          </div>
        </div>

        <!-- Lista de Droguerías Ordenadas -->
        <div class="droguerias-scroll-list">
          <div class="list-heading-row">
            <span class="count-badge">{{ drogueriasResultado.length }} droguerías disponibles</span>
            <span class="order-info">Ordenado por {{ criterioOrden === 'precio' ? 'Precio' : 'Distancia' }}</span>
          </div>

          <div
            v-for="(drog, index) in drogueriasResultado.slice(0, 10)"
            :key="drog.id"
            class="drogueria-card-mini"
            :class="{ 'card--best-price': drog.esMejorPrecio }"
            role="button"
            tabindex="0"
            :aria-label="`Ver ${drog.nombre} en el mapa`"
            @click="enfocarEnMapa(drog.id)"
            @keydown.enter="enfocarEnMapa(drog.id)"
          >
            <div class="mini-card-top">
              <div class="brand-row">
                <span
                  class="brand-tag-mini"
                  :style="{
                    background: obtenerCadenaInfo(drog.cadena).colorLight,
                    color: obtenerCadenaInfo(drog.cadena).color,
                    borderColor: obtenerCadenaInfo(drog.cadena).color + '40',
                  }"
                >
                  {{ obtenerCadenaInfo(drog.cadena).tipo === 'independiente' ? '🏺 Boticario' : drog.cadena }}
                </span>
                <span class="barrio-tag-mini">{{ drog.barrio }}</span>
                <span v-if="drog.es24h" class="tag-mini-24h">24H</span>
                <span v-if="drog.domicilio" class="tag-mini-dom">🛵 Domicilio</span>
              </div>

              <div v-if="drog.precioOferta" class="price-box-mini">
                <span v-if="drog.esMejorPrecio" class="ribbon-winner">¡Mejor Precio!</span>
                <span class="price-amount">{{ formatPrecioCop(drog.precioOferta) }}</span>
              </div>
            </div>

            <h4 class="mini-card-name">{{ drog.nombre }}</h4>
            <p class="mini-card-address">{{ drog.direccion }}</p>

            <div class="mini-card-footer">
              <span v-if="drog.distanciaKm !== undefined" class="dist-badge-mini">
                📍 {{ formatearDistancia(drog.distanciaKm) }}
              </span>
              <span v-else class="time-meta">⏰ {{ drog.horario }}</span>

              <a
                :href="generarLinkWhatsApp(drog)"
                target="_blank"
                rel="noopener"
                class="wa-quick-btn"
                :title="`Pedir a ${drog.nombre} por WhatsApp`"
                @click.stop
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24" />
                </svg>
                Pedir
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-hub {
  position: relative;
  width: 100%;
  padding-top: 24px;
  margin-bottom: 56px;
}

/* Fondos y resplandores */
.hub-ambient {
  position: absolute;
  inset: -40px -20px 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.28;
}

.glow-blue {
  width: 520px;
  height: 520px;
  top: -60px;
  right: 5%;
  background: radial-gradient(circle, var(--blue-bright), transparent 70%);
}

.glow-aqua {
  width: 480px;
  height: 480px;
  top: 100px;
  left: -80px;
  background: radial-gradient(circle, var(--aqua), transparent 70%);
}

.ambient-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, #000 70%, transparent 100%);
}

[data-theme='light'] .ambient-grid-overlay {
  background-image: radial-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px);
}

/* Encabezado */
.hub-header {
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.hub-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(48, 209, 88, 0.14);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.32);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #30d158;
  box-shadow: 0 0 8px #30d158;
  animation: pulse-dot 1.8s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.meta-pill {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
}

.savings-pill {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(255, 214, 10, 0.12);
  color: #ffd60a;
  border: 1px solid rgba(255, 214, 10, 0.28);
}

[data-theme='light'] .savings-pill {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.25);
}

.hub-title {
  font-size: clamp(2rem, 4.4vw, 3.2rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1.14;
  color: var(--ink);
  max-width: 22ch;
}

.highlight-price {
  background: linear-gradient(135deg, #30d158, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.highlight-dist {
  background: linear-gradient(135deg, var(--blue-bright), var(--aqua));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hub-lede {
  font-size: clamp(0.96rem, 1.8vw, 1.12rem);
  line-height: 1.55;
  color: var(--muted);
  max-width: 68ch;
}

/* Selector de Chips de Medicamentos Populares */
.med-chips-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.chips-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--aqua);
}

.chips-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.med-chip {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.med-chip:hover {
  background: var(--nav-hover-bg);
  color: var(--ink);
  border-color: var(--blue-bright);
}

.med-chip.active {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.28), rgba(0, 122, 255, 0.16));
  color: var(--blue-bright);
  border-color: var(--blue);
  font-weight: 700;
  box-shadow: 0 0 14px rgba(10, 132, 255, 0.25);
}

/* Controles de Búsqueda */
.hub-controls-bar {
  display: grid;
  grid-template-columns: 2fr 1.3fr auto;
  gap: 12px;
  width: 100%;
  max-width: 860px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  backdrop-filter: blur(24px) saturate(180%);
  margin-top: 8px;
}

.search-input-box,
.neighborhood-select-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 48px;
  border-radius: 12px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
}

.search-input-box input,
.neighborhood-select-box select {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: 0.92rem;
  font-family: inherit;
  outline: none;
}

.neighborhood-select-box select option {
  background: #0f172a;
  color: #ffffff;
}

[data-theme='light'] .neighborhood-select-box select option {
  background: #ffffff;
  color: #0f172a;
}

.gps-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(140deg, var(--blue), #0062cc);
  color: #ffffff;
  border: none;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 8px 20px -6px rgba(10, 132, 255, 0.45);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gps-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px -6px rgba(10, 132, 255, 0.6);
}

.gps-action-btn.active {
  background: linear-gradient(140deg, #30d158, #059669);
  box-shadow: 0 8px 20px -6px rgba(48, 209, 88, 0.4);
}

/* Fila de toggles y orden */
.hub-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  max-width: 860px;
  flex-wrap: wrap;
}

.filters-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--muted);
}

.toggle-pill,
.sort-pill {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-pill.active,
.sort-pill.active {
  background: var(--line-soft);
  color: var(--ink);
  border-color: var(--blue-bright);
  font-weight: 700;
}

/* Layout Split: Mapa + Radar Lateral */
.hub-stage-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 22px;
  align-items: stretch;
}

.map-viewport-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md), var(--inset);
  background: var(--glass);
}

.map-top-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--glass-control-bg);
  border-bottom: 1px solid var(--line-soft);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--ink-soft);
  flex-wrap: wrap;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-rebaja { background: #dc2626; }
.dot-cruz { background: #059669; }
.dot-copifam { background: #0284c7; }
.dot-indie { background: #7c3aed; }

.legend-badge-24h {
  background: #30d158;
  color: #ffffff;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.65rem;
}

/* Sidebar de Resultados */
.results-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 640px;
}

.med-summary-card {
  padding: 18px;
  border-radius: var(--radius-md);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
}

.med-summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.med-cat-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--aqua);
  letter-spacing: 0.04em;
}

.med-name {
  font-size: 1.18rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.med-best-price-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(48, 209, 88, 0.14);
  border: 1px solid rgba(48, 209, 88, 0.35);
  padding: 6px 12px;
  border-radius: 12px;
}

.best-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #30d158;
}

.best-val {
  font-size: 1.15rem;
  font-weight: 850;
  color: #30d158;
  letter-spacing: -0.03em;
}

.savings-difference-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(10, 132, 255, 0.08);
  border: 1px solid rgba(10, 132, 255, 0.18);
  font-size: 0.82rem;
  color: var(--ink-soft);
  line-height: 1.4;
}

.savings-difference-box strong {
  color: #30d158;
}

/* Lista scrolleable de droguerías */
.droguerias-scroll-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.list-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  padding: 0 4px;
}

.count-badge {
  color: var(--ink);
}

.drogueria-card-mini {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--glass);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  cursor: pointer;
  outline: none;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, box-shadow 0.2s;
}

.drogueria-card-mini:hover,
.drogueria-card-mini:focus-visible {
  transform: translateY(-2px);
  border-color: var(--blue-bright);
  box-shadow: 0 8px 24px rgba(10, 132, 255, 0.16);
}

.card--best-price {
  border-color: rgba(48, 209, 88, 0.45);
  background: linear-gradient(150deg, rgba(48, 209, 88, 0.06), var(--glass));
}

.mini-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.brand-tag-mini {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.barrio-tag-mini {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--line-soft);
  color: var(--muted);
  padding: 2px 6px;
  border-radius: 6px;
}

.tag-mini-24h {
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(48, 209, 88, 0.16);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.3);
  padding: 2px 5px;
  border-radius: 5px;
}

.tag-mini-dom {
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(90, 200, 250, 0.14);
  color: var(--aqua);
  padding: 2px 5px;
  border-radius: 5px;
}

.price-box-mini {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ribbon-winner {
  font-size: 0.64rem;
  font-weight: 800;
  color: #30d158;
  text-transform: uppercase;
}

.price-amount {
  font-size: 1.05rem;
  font-weight: 850;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.card--best-price .price-amount {
  color: #30d158;
}

.mini-card-name {
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--ink);
  margin: 0;
  line-height: 1.25;
}

.mini-card-address {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

.mini-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--line-soft);
}

.dist-badge-mini {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--blue-bright);
}

.time-meta {
  font-size: 0.74rem;
  color: var(--muted);
}

.wa-quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: #25d366;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.wa-quick-btn:hover {
  transform: scale(1.04);
  filter: brightness(1.08);
}

/* Responsive */
@media (max-width: 1080px) {
  .hub-stage-grid {
    grid-template-columns: 1fr;
  }
  .results-sidebar {
    max-height: 480px;
  }
}

@media (max-width: 768px) {
  .hub-controls-bar {
    grid-template-columns: 1fr;
  }
  .hub-toggle-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
