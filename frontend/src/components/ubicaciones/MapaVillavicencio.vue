<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Drogueria } from '../../data/droguerias';

const props = defineProps<{
  droguerias: (Drogueria & { distanciaKm?: number })[];
  userLat: number | null;
  userLng: number | null;
  barrioSeleccionado?: string;
}>();

const emit = defineEmits<{
  (e: 'select-drogueria', id: number): void;
  (e: 'select-barrio', barrio: string): void;
}>();

const drogueriaActiva = ref<number | null>(null);

// Bounding box geográfico de Villavicencio para proyección SVG
const MIN_LAT = 4.070;
const MAX_LAT = 4.158;
const MIN_LNG = -73.648;
const MAX_LNG = -73.610;

function x(lng: number): number {
  const norm = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  return Math.max(40, Math.min(760, norm * 720 + 40));
}

function y(lat: number): number {
  const norm = (lat - MIN_LAT) / (MAX_LAT - MIN_LAT);
  return Math.max(30, Math.min(450, 460 - norm * 420));
}

// Coordenadas proyectadas del usuario
const userCoords = computed(() => {
  if (props.userLat === null || props.userLng === null) return null;
  return {
    px: x(props.userLng),
    py: y(props.userLat),
  };
});

// Droguería seleccionada para el popup
const drogueriaDetalle = computed(() => {
  if (!drogueriaActiva.value) return null;
  return props.droguerias.find((d) => d.id === drogueriaActiva.value) ?? null;
});

// Sectores / Barrios con etiquetas en el mapa
const sectoresMap = [
  { nombre: 'Centro', lat: 4.1495, lng: -73.6372 },
  { nombre: 'El Barzal', lat: 4.1432, lng: -73.6341 },
  { nombre: 'La Esperanza', lat: 4.1352, lng: -73.6294 },
  { nombre: 'Siete de Agosto', lat: 4.1388, lng: -73.6366 },
  { nombre: 'San Benito', lat: 4.1465, lng: -73.6278 },
  { nombre: 'Los Fundadores', lat: 4.1287, lng: -73.6391 },
  { nombre: 'Montecarlo', lat: 4.0912, lng: -73.6289 },
  { nombre: 'Catumare', lat: 4.0845, lng: -73.6234 },
  { nombre: 'Porfía', lat: 4.0768, lng: -73.6192 },
];

function clickPin(d: Drogueria): void {
  drogueriaActiva.value = d.id;
  emit('select-drogueria', d.id);
}
</script>

<template>
  <div class="map-container">
    <div class="map-header">
      <div class="map-title-row">
        <span class="map-badge">Mapa Interactivo</span>
        <h3>Red de Droguerías en Villavicencio</h3>
      </div>
      <div class="map-legend">
        <span class="legend-item"><span class="dot dot-24h" /> 24 Horas</span>
        <span class="legend-item"><span class="dot dot-afiliada" /> Verificada</span>
        <span class="legend-item"><span class="dot dot-normal" /> Diurna</span>
        <span v-if="userCoords" class="legend-item"><span class="dot dot-user" /> Tu Ubicación</span>
      </div>
    </div>

    <!-- Lienzo SVG del Mapa -->
    <div class="svg-wrapper">
      <svg
        viewBox="0 0 800 480"
        class="vlr-svg-map"
        role="region"
        aria-label="Mapa de droguerías en Villavicencio"
      >
        <defs>
          <!-- Gradiente de fondo del mapa -->
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(10, 20, 42, 0.6)" />
            <stop offset="100%" stop-color="rgba(6, 12, 24, 0.85)" />
          </linearGradient>

          <!-- Resplandor para el pin del usuario -->
          <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>

        <!-- Fondo del mapa -->
        <rect width="800" height="480" rx="16" fill="url(#mapBg)" class="map-background" />

        <!-- Cuadrícula sutil de coordenadas -->
        <g class="map-grid" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1">
          <line v1="1" x1="160" y1="0" x2="160" y2="480" />
          <line v2="2" x1="320" y1="0" x2="320" y2="480" />
          <line v3="3" x1="480" y1="0" x2="480" y2="480" />
          <line v4="4" x1="640" y1="0" x2="640" y2="480" />
          <line h1="1" x1="0" y1="120" x2="800" y2="120" />
          <line h2="2" x1="0" y1="240" x2="800" y2="240" />
          <line h3="3" x1="0" y1="360" x2="800" y2="360" />
        </g>

        <!-- Eje fluvial simulado (Río Guatiquía al norte) -->
        <path
          d="M 40 40 Q 200 65 420 50 T 760 35"
          fill="none"
          stroke="rgba(90, 200, 250, 0.25)"
          stroke-width="5"
          stroke-linecap="round"
        />
        <text x="560" y="32" class="map-river-label">Río Guatiquía</text>

        <!-- Avenidas y Corredores Viales Principales de Villavicencio -->
        <g class="map-roads" stroke="rgba(255, 255, 255, 0.12)" stroke-width="2" fill="none">
          <!-- Avenida 40 (Norte - Sur) -->
          <path d="M 280 60 L 320 160 L 380 260 L 460 380 L 520 460" stroke-dasharray="4 3" />
          <!-- Vía a Acacías -->
          <path d="M 380 260 L 340 330 L 290 420 L 260 470" />
          <!-- Vía a Puerto López -->
          <path d="M 320 160 L 460 180 L 620 200 L 760 210" />
        </g>

        <!-- Etiquetas de Sectores / Barrios -->
        <g class="sector-labels">
          <text
            v-for="sec in sectoresMap"
            :key="sec.nombre"
            :x="x(sec.lng)"
            :y="y(sec.lat) + 26"
            class="sector-label"
            :class="{ active: barrioSeleccionado === sec.nombre }"
            @click="emit('select-barrio', sec.nombre)"
          >
            {{ sec.nombre }}
          </text>
        </g>

        <!-- Conexión visual si hay GPS -->
        <g v-if="userCoords && droguerias.length > 0">
          <line
            :x1="userCoords.px"
            :y1="userCoords.py"
            :x2="x(droguerias[0].lng)"
            :y2="y(droguerias[0].lat)"
            stroke="rgba(48, 209, 88, 0.6)"
            stroke-width="2"
            stroke-dasharray="4 4"
          />
        </g>

        <!-- Pines de Droguerías -->
        <g
          v-for="d in droguerias"
          :key="d.id"
          class="map-pin"
          :class="{
            'pin--active': drogueriaActiva === d.id,
            'pin--24h': d.es24h,
            'pin--afiliada': d.afiliada,
          }"
          :transform="`translate(${x(d.lng)}, ${y(d.lat)})`"
          @click="clickPin(d)"
        >
          <!-- Halo de selección -->
          <circle v-if="drogueriaActiva === d.id" r="18" class="pin-active-halo" />

          <!-- Círculo del marcador -->
          <circle r="11" class="pin-base" />

          <!-- Cruz de farmacia interior -->
          <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />

          <title>{{ d.nombre }} ({{ d.barrio }})</title>
        </g>

        <!-- Pin del Usuario con Radar GPS Pulsante -->
        <g v-if="userCoords" :transform="`translate(${userCoords.px}, ${userCoords.py})`" class="user-gps-marker">
          <circle r="22" class="radar-wave" />
          <circle r="14" class="radar-wave wave-delayed" />
          <circle r="7" fill="#007aff" stroke="#ffffff" stroke-width="2" />
        </g>
      </svg>

      <!-- Tarjeta Flotante con Detalle de la Droguería Seleccionada -->
      <transition name="pop">
        <div v-if="drogueriaDetalle" class="map-popup">
          <div class="popup-top">
            <span class="popup-badge" :class="drogueriaDetalle.es24h ? 'tag-24h' : 'tag-day'">
              {{ drogueriaDetalle.es24h ? '24 Horas' : 'Diurna' }}
            </span>
            <button
              type="button"
              class="popup-close"
              aria-label="Cerrar detalle"
              @click="drogueriaActiva = null"
            >
              ✕
            </button>
          </div>
          <h4>{{ drogueriaDetalle.nombre }}</h4>
          <p class="popup-addr">{{ drogueriaDetalle.direccion }} ({{ drogueriaDetalle.barrio }})</p>
          <div class="popup-actions">
            <a
              :href="`https://wa.me/${drogueriaDetalle.whatsapp}?text=${encodeURIComponent('Hola, los vi en el mapa de FarmApp Villavicencio.')}`"
              target="_blank"
              rel="noopener"
              class="popup-wa-btn"
            >
              Pedir WhatsApp
            </a>
            <a
              :href="`https://www.google.com/maps/dir/?api=1&destination=${drogueriaDetalle.lat},${drogueriaDetalle.lng}`"
              target="_blank"
              rel="noopener"
              class="popup-maps-btn"
            >
              Ruta
            </a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  border-radius: var(--radius-lg);
  background: var(--glass);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  padding: 16px;
  margin-bottom: 24px;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 4px 6px 14px;
}

.map-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.map-badge {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(90, 200, 250, 0.15);
  color: var(--aqua);
  border: 1px solid rgba(90, 200, 250, 0.3);
}

.map-title-row h3 {
  font-size: 1.05rem;
  color: var(--ink);
}

.map-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--muted);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.dot-24h { background: #30d158; }
.dot-afiliada { background: #ffd60a; }
.dot-normal { background: #0a84ff; }
.dot-user { background: #007aff; }

.svg-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 800 / 480;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line-soft);
}

.vlr-svg-map {
  width: 100%;
  height: 100%;
  display: block;
}

[data-theme="light"] .map-background {
  fill: #eef3f9;
}

[data-theme="light"] .map-grid line {
  stroke: rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .map-roads path {
  stroke: rgba(15, 23, 42, 0.14);
}

.map-river-label {
  font-size: 10px;
  fill: rgba(90, 200, 250, 0.6);
  font-weight: 600;
  letter-spacing: 0.06em;
}

.sector-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--muted);
  text-anchor: middle;
  cursor: pointer;
  user-select: none;
  transition: fill 0.2s, font-weight 0.2s;
}

.sector-label:hover,
.sector-label.active {
  fill: var(--ink);
  font-weight: 800;
}

[data-theme="light"] .sector-label {
  fill: #64748b;
}

[data-theme="light"] .sector-label.active {
  fill: #0b1220;
}

/* Pines */
.map-pin {
  cursor: pointer;
  transition: transform 0.2s var(--spring);
}

.map-pin:hover {
  transform: scale(1.25);
}

.pin-base {
  fill: #0a84ff;
  stroke: #ffffff;
  stroke-width: 1.5;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
}

.pin--24h .pin-base {
  fill: #30d158;
}

.pin--afiliada .pin-base {
  fill: #ff9f0a;
}

.pin-active-halo {
  fill: rgba(255, 255, 255, 0.25);
  animation: pulse-halo 1.5s infinite;
}

@keyframes pulse-halo {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.4); opacity: 0.2; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

/* Radar GPS */
.radar-wave {
  fill: none;
  stroke: #007aff;
  stroke-width: 1.5;
  animation: radar 2s ease-out infinite;
}

.wave-delayed {
  animation-delay: 0.9s;
}

@keyframes radar {
  0% { r: 5; opacity: 0.9; }
  100% { r: 24; opacity: 0; }
}

/* Popup flotante */
.map-popup {
  position: absolute;
  bottom: 16px;
  left: 16px;
  max-width: 310px;
  padding: 14px;
  border-radius: 14px;
  background: var(--bg-1, #0c1426);
  border: 1px solid var(--line);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  z-index: 10;
}

[data-theme="light"] .map-popup {
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
}

.popup-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.popup-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-24h {
  background: rgba(48, 209, 88, 0.15);
  color: #30d158;
}

.tag-day {
  background: rgba(10, 132, 255, 0.15);
  color: #0a84ff;
}

.popup-close {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.85rem;
}

.map-popup h4 {
  font-size: 0.95rem;
  color: var(--ink);
  line-height: 1.3;
}

.popup-addr {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 2px;
}

.popup-actions {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.popup-wa-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: #25d366;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.popup-maps-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--line-soft);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.22s var(--spring);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
