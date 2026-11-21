<script setup lang="ts">
import { computed, ref } from 'vue';
import SectionHeader from '../ui/SectionHeader.vue';
import MapaVillavicencio from '../ubicaciones/MapaVillavicencio.vue';
import {
  BARRIOS_VILLAVICENCIO,
  Drogueria,
  drogueriasVillavicencio,
  obtenerCadenaInfo,
} from '../../data/droguerias';
import { formatPrecioCop } from '../../utils/format';

const mapaRef = ref<any>(null);
const barrioFiltro = ref('Todos los barrios');
const solo24h = ref(false);
const soloDomicilio = ref(false);
const soloBoticarios = ref(false);
const drogueriaActivaId = ref<number | null>(null);

// GPS del usuario
const userLat = ref<number | null>(null);
const userLng = ref<number | null>(null);
const calculandoGps = ref(false);
const gpsActivo = ref(false);

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

function solicitarGps() {
  if (!navigator.geolocation) return;
  calculandoGps.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude;
      userLng.value = pos.coords.longitude;
      gpsActivo.value = true;
      calculandoGps.value = false;
    },
    () => {
      calculandoGps.value = false;
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

export type DrogueriaConDistancia = Drogueria & {
  distanciaKm?: number;
};

const drogueriasFiltradas = computed<DrogueriaConDistancia[]>(() => {
  let lista: DrogueriaConDistancia[] = drogueriasVillavicencio.map((d) => {
    let distancia: number | undefined = undefined;
    if (userLat.value !== null && userLng.value !== null) {
      distancia = calcularDistanciaKm(userLat.value, userLng.value, d.lat, d.lng);
    }
    return { ...d, distanciaKm: distancia };
  });

  if (barrioFiltro.value !== 'Todos los barrios') {
    lista = lista.filter((d) => d.barrio === barrioFiltro.value);
  }
  if (solo24h.value) lista = lista.filter((d) => d.es24h);
  if (soloDomicilio.value) lista = lista.filter((d) => d.domicilio);
  if (soloBoticarios.value) lista = lista.filter((d) => d.cadena === 'Independiente');

  if (gpsActivo.value) {
    lista.sort((a, b) => (a.distanciaKm ?? 999) - (b.distanciaKm ?? 999));
  }
  return lista;
});

function enfocarDrogueria(id: number) {
  drogueriaActivaId.value = id;
  mapaRef.value?.enfocarDrogueria(id);
}

function onSelectDrogueria(id: number) {
  drogueriaActivaId.value = id;
  const el = document.getElementById(`radar-card-${id}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function formatearDistancia(km?: number): string {
  if (km === undefined) return '';
  if (km < 1) return `A ${Math.round(km * 1000)} m`;
  return `A ${km.toFixed(1)} km`;
}

function generarLinkWhatsApp(drog: Drogueria): string {
  const msg = encodeURIComponent(
    `Hola ${drog.nombre}, los vi en el Radar FarmApp Villavicencio y deseo consultar disponibilidad de medicamentos a domicilio.`,
  );
  return `https://wa.me/${drog.whatsapp}?text=${msg}`;
}

function centrarTodaLaCiudad() {
  barrioFiltro.value = 'Todos los barrios';
  solo24h.value = false;
  soloDomicilio.value = false;
  soloBoticarios.value = false;
  drogueriaActivaId.value = null;
  mapaRef.value?.centrarTodaLaCiudad?.();
}
</script>

<template>
  <section id="radar-mapa" class="radar-section section reveal">
    <SectionHeader
      eyebrow="📍 Geolocalización en Tiempo Real"
      title="Radar de Farmacias y Droguerías en Villavicencio"
      lede="Explora más de 85 puntos de atención georreferenciados en toda la ciudad. Ubica farmacias de turno 24 horas, servicios a domicilio y boticarios de confianza cerca de tu barrio."
    />

    <!-- Contenedor Panorámico del Mapa con Flujo Vertical Estricto (Sin superposiciones) -->
    <div class="map-panoramic-card">
      <!-- Barra Superior de Controles Apple / Airbnb (In-flow) -->
      <div class="radar-controls-bar">
        <div class="island-group">
          <button
            type="button"
            class="island-btn"
            :class="{ active: solo24h }"
            @click="solo24h = !solo24h"
          >
            <span>🌙</span> 24 Horas
          </button>
          <button
            type="button"
            class="island-btn"
            :class="{ active: soloDomicilio }"
            @click="soloDomicilio = !soloDomicilio"
          >
            <span>🛵</span> Domicilio
          </button>
          <button
            type="button"
            class="island-btn"
            :class="{ active: soloBoticarios }"
            @click="soloBoticarios = !soloBoticarios"
          >
            <span>🏺</span> Boticarios
          </button>
        </div>

        <div class="island-group island-group--actions">
          <div class="island-select-wrapper">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <select v-model="barrioFiltro" aria-label="Filtrar por barrio de Villavicencio">
              <option v-for="b in BARRIOS_VILLAVICENCIO" :key="b" :value="b">
                {{ b }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="island-gps-btn"
            :class="{ active: gpsActivo, loading: calculandoGps }"
            title="Usar mi ubicación actual"
            @click="solicitarGps"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>{{ gpsActivo ? 'Cerca de ti' : 'Mi GPS' }}</span>
          </button>

          <button
            type="button"
            class="island-reset-btn"
            title="Ver toda la ciudad"
            @click="centrarTodaLaCiudad"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Toda la ciudad</span>
          </button>
        </div>
      </div>

      <!-- Canvas de Leaflet Limpio (Sin cabecera duplicada ni colisiones) -->
      <div class="map-canvas-wrapper">
        <MapaVillavicencio
          ref="mapaRef"
          :minimal="true"
          :droguerias="drogueriasFiltradas"
          :user-lat="userLat"
          :user-lng="userLng"
          :barrio-seleccionado="barrioFiltro"
          @select-drogueria="onSelectDrogueria"
        />
      </div>

      <!-- Carrusel / Fila Limpia de Farmacias Destacadas (Airbnb style) -->
      <div class="radar-cards-tray">
        <div class="tray-header">
          <div class="tray-title-box">
            <span class="tray-dot" />
            <span class="tray-title">Farmacias en el radar</span>
            <span class="tray-counter">{{ drogueriasFiltradas.length }} encontradas</span>
          </div>

          <div class="radar-legend-chips">
            <span class="legend-chip"><span class="legend-dot dot-rebaja" /> La Rebaja</span>
            <span class="legend-chip"><span class="legend-dot dot-cruzverde" /> Cruz Verde</span>
            <span class="legend-chip"><span class="legend-dot dot-cadenas" /> Otras Cadenas</span>
            <span class="legend-chip"><span class="legend-dot dot-independiente" /> De Barrio</span>
            <span class="legend-chip"><span class="badge-24h-mini">24H</span> De Turno</span>
          </div>
        </div>

        <div class="tray-scroll-row">
          <div
            v-for="drog in drogueriasFiltradas.slice(0, 12)"
            :id="`radar-card-${drog.id}`"
            :key="drog.id"
            class="tray-card"
            :class="{ 'card--focused': drogueriaActivaId === drog.id }"
            role="button"
            tabindex="0"
            @click="enfocarDrogueria(drog.id)"
            @keydown.enter="enfocarDrogueria(drog.id)"
          >
            <div class="tray-card-top">
              <span
                class="card-brand-pill"
                :style="{
                  backgroundColor: obtenerCadenaInfo(drog.cadena).colorLight,
                  color: obtenerCadenaInfo(drog.cadena).color,
                  borderColor: obtenerCadenaInfo(drog.cadena).color + '40',
                }"
              >
                {{ obtenerCadenaInfo(drog.cadena).tipo === 'independiente' ? '🏺 Boticario' : drog.cadena }}
              </span>
              <span v-if="drog.distanciaKm !== undefined" class="card-dist-pill">
                📍 {{ formatearDistancia(drog.distanciaKm) }}
              </span>
              <span v-else-if="drog.es24h" class="card-24h-pill">24H</span>
            </div>

            <h4 class="card-name">{{ drog.nombre }}</h4>
            <p class="card-address">📍 {{ drog.barrio }} · {{ drog.direccion }}</p>

            <div class="tray-card-actions">
              <span class="card-time">⏰ {{ drog.horario }}</span>
              <a
                :href="generarLinkWhatsApp(drog)"
                target="_blank"
                rel="noopener"
                class="card-wa-btn"
                :title="`Pedir por WhatsApp a ${drog.nombre}`"
                @click.stop
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2" />
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
.radar-section {
  position: relative;
  padding: 40px 0;
}

.map-panoramic-card {
  position: relative;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md), var(--inset);
  overflow: hidden;
  margin-top: 24px;
}

/* Barra Superior de Controles (In-flow) */
.radar-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 18px;
  background: var(--bg-1, #080d1a);
  border-bottom: 1px solid var(--line-soft);
}

[data-theme='light'] .radar-controls-bar {
  background: #ffffff;
}

.island-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.island-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--glass-dark);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  transition-property: background-color, border-color, color, transform;
  transition-duration: 150ms;
  min-height: 36px;
}

[data-theme='light'] .island-btn {
  background: #f1f5f9;
  border-color: rgba(15, 23, 42, 0.08);
}

.island-btn:hover {
  background: var(--line-soft);
  color: var(--ink);
  transform: translateY(-1px);
}

.island-btn.active {
  background: rgba(10, 132, 255, 0.22);
  color: var(--blue-bright);
  border-color: rgba(10, 132, 255, 0.4);
  font-weight: 750;
}

.island-select-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  border-radius: 999px;
  background: var(--glass-dark);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.82rem;
}

[data-theme='light'] .island-select-wrapper {
  background: #f1f5f9;
  border-color: rgba(15, 23, 42, 0.08);
}

.island-select-wrapper select {
  background: transparent;
  border: none;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  max-width: 170px;
}

.island-select-wrapper select option {
  background: #0c1426;
  color: #ffffff;
}

[data-theme='light'] .island-select-wrapper select option {
  background: #ffffff;
  color: #0f172a;
}

.island-gps-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(140deg, var(--blue), #0062cc);
  color: #ffffff;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  min-height: 36px;
}

.island-gps-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(10, 132, 255, 0.5);
}

.island-gps-btn.active {
  background: linear-gradient(140deg, #30d158, #059669);
}

.island-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 36px;
  transition: all 0.15s ease;
}

.island-reset-btn:hover {
  color: var(--ink);
  border-color: var(--blue-bright);
  background: var(--line-soft);
}

/* Canvas del Mapa (In-flow, altura limpia) */
.map-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  background: #0b1220;
}

/* Bandeja Inferior de Tarjetas */
.radar-cards-tray {
  position: relative;
  padding: 18px 24px 22px;
  background: var(--bg-1, #080d1a);
  border-top: 1px solid var(--line-soft);
}

[data-theme='light'] .radar-cards-tray {
  background: #f8fafc;
}

.tray-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
  flex-wrap: wrap;
}

.tray-title-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tray-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #30d158;
  box-shadow: 0 0 8px #30d158;
}

.tray-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.tray-counter {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--muted);
  background: var(--line-soft);
  padding: 2px 8px;
  border-radius: 999px;
}

/* Chips de Leyenda Elegantes */
.radar-legend-chips {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-rebaja { background: #dc2626; }
.dot-cruzverde { background: #059669; }
.dot-cadenas { background: #0284c7; }
.dot-independiente { background: #7c3aed; }

.badge-24h-mini {
  background: #10b981;
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 3px;
}

.tray-scroll-row {
  display: flex;
  align-items: stretch;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}

.tray-card {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  background: var(--glass);
  border: 1px solid var(--line);
  cursor: pointer;
  outline: none;
  transition-property: transform, border-color, box-shadow;
  transition-duration: 180ms;
}

.tray-card:hover,
.tray-card:focus-visible {
  transform: translateY(-2px);
  border-color: var(--blue-bright);
  box-shadow: 0 8px 24px rgba(10, 132, 255, 0.2);
}

.tray-card.card--focused {
  border-color: var(--blue-bright);
  box-shadow: 0 0 0 2px rgba(61, 155, 255, 0.45), 0 10px 26px -8px rgba(10, 132, 255, 0.6);
  background: linear-gradient(150deg, rgba(61, 155, 255, 0.12), var(--glass));
}

.tray-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-brand-pill {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.card-dist-pill {
  font-size: 0.74rem;
  font-weight: 750;
  color: var(--blue-bright);
  font-variant-numeric: tabular-nums;
}

.card-24h-pill {
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(48, 209, 88, 0.16);
  color: #30d158;
  padding: 2px 6px;
  border-radius: 4px;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--ink);
  margin: 0;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-address {
  font-size: 0.78rem;
  color: var(--muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tray-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  margin-top: auto;
}

.card-time {
  font-size: 0.74rem;
  color: var(--muted);
}

.card-wa-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  background: #25d366;
  color: #ffffff;
  font-size: 0.76rem;
  font-weight: 750;
  text-decoration: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.card-wa-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.08);
}

@media (max-width: 768px) {
  .radar-controls-bar {
    padding: 12px;
  }
  .island-group {
    width: 100%;
    justify-content: flex-start;
  }
  .island-select-wrapper select {
    max-width: 130px;
  }
  .map-canvas-wrapper {
    height: 380px;
  }
  .radar-legend-chips {
    display: none;
  }
}
</style>
