<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Drogueria } from '../../data/droguerias';
import { VILLAVICENCIO_BOUNDS } from '../../data/droguerias';

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

const mapContainer = ref<HTMLDivElement | null>(null);
const cargando = ref(true);
const errorCarga = ref(false);
const sectorActivo = ref<string>('todos');

// Referencias a instancias de Leaflet
let mapInstance: any = null;
let markersLayer: any = null;
let tileLayer: any = null;
let userMarker: any = null;
let userAccuracyCircle: any = null;
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

// Sectores de Villavicencio para navegación rápida
const SECTORES = [
  { id: 'todos', label: '🏙️ Toda la Ciudad' },
  { id: 'barzal', label: '🏥 El Barzal (Salud)', lat: 4.143, lng: -73.6345, zoom: 16 },
  { id: 'centro', label: '🏛️ Centro Histórico', lat: 4.1505, lng: -73.6365, zoom: 16 },
  { id: 'siete-agosto', label: '🛍️ 7 de Agosto / Viva', lat: 4.136, lng: -73.637, zoom: 15 },
  { id: 'esperanza', label: '🏘️ La Esperanza', lat: 4.133, lng: -73.6265, zoom: 15 },
  { id: 'porfia', label: '📍 Porfía / Sur', lat: 4.073, lng: -73.663, zoom: 14 },
  { id: 'oriente', label: '🗺️ Kirpas / San Benito', lat: 4.128, lng: -73.6, zoom: 14 },
] as const;

// Cargar Leaflet (local primero, fallback a cdnjs)
function cargarLeafletScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).L) {
      return resolve((window as any).L);
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = '/vendor/leaflet/leaflet.css';
      document.head.appendChild(link);
    }

    if (document.getElementById('leaflet-js')) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).L) {
          clearInterval(interval);
          resolve((window as any).L);
        } else if (attempts > 60) {
          clearInterval(interval);
          reject(new Error('Tiempo de espera agotado al cargar mapa'));
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = '/vendor/leaflet/leaflet.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).L) {
        resolve((window as any).L);
      } else {
        reject(new Error('Leaflet no se inicializó correctamente'));
      }
    };
    script.onerror = () => {
      const fallback = document.createElement('script');
      fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      fallback.onload = () => resolve((window as any).L);
      fallback.onerror = () => reject(new Error('No se pudo conectar con el servicio de mapas'));
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  });
}

type TipoCapa = 'osm' | 'esri' | 'satelite';
const tipoCapa = ref<TipoCapa>('osm');

const CAPAS_MAPA: Record<
  TipoCapa,
  { label: string; url: string; subdomains?: string[]; maxZoom: number; attribution: string }
> = {
  osm: {
    label: '🗺️ Calles (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  },
  esri: {
    label: '🏢 Calles Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Tiles &copy; <a href="https://www.esri.com" target="_blank">Esri</a>',
  },
  satelite: {
    label: '🛰️ Satélite Real',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution:
      'Tiles &copy; <a href="https://www.esri.com" target="_blank">Esri</a> &mdash; Earthstar Geographics',
  },
};

function cambiarCapa(tipo: TipoCapa) {
  tipoCapa.value = tipo;
  if (!mapInstance || !(window as any).L) return;
  actualizarCapaBase((window as any).L);
}

function actualizarCapaBase(L: any) {
  if (!mapInstance) return;
  if (tileLayer) {
    mapInstance.removeLayer(tileLayer);
    tileLayer = null;
  }

  const cfg = CAPAS_MAPA[tipoCapa.value] || CAPAS_MAPA.osm;
  tileLayer = L.tileLayer(cfg.url, {
    maxZoom: cfg.maxZoom,
    subdomains: cfg.subdomains || ['a', 'b', 'c'],
    attribution: cfg.attribution,
  });

  // Si por alguna razón la capa seleccionada falla, respaldar con OpenStreetMap
  tileLayer.on('tileerror', () => {
    if (tipoCapa.value !== 'osm') {
      console.warn('[FarmApp] Alternando a OpenStreetMap estándar');
      tipoCapa.value = 'osm';
      mapInstance.removeLayer(tileLayer);
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapInstance);
    }
  });

  tileLayer.addTo(mapInstance);
}

function inicializarMapa(L: any) {
  if (!mapContainer.value) return;

  // Centro en Villavicencio con límites oficiales
  mapInstance = L.map(mapContainer.value, {
    center: [4.135, -73.63],
    zoom: 13,
    minZoom: 11,
    maxZoom: 18,
    scrollWheelZoom: true,
  });

  actualizarCapaBase(L);
  markersLayer = L.featureGroup().addTo(mapInstance);

  // Escuchar cambios de modo oscuro/claro para cambiar las teselas al instante
  themeObserver = new MutationObserver(() => {
    actualizarCapaBase(L);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Ajuste reactivo al tamaño del contenedor
  resizeObserver = new ResizeObserver(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
    }
  });
  resizeObserver.observe(mapContainer.value);

  renderizarMarcadores(L);
  cargando.value = false;

  // Ajuste inicial para abarcar toda la ciudad de Villavicencio
  setTimeout(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
      centrarTodaLaCiudad();
    }
  }, 200);
}

function renderizarMarcadores(L: any) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();

  if (!props.droguerias.length) return;

  props.droguerias.forEach((d) => {
    const clasePin = d.es24h ? 'pin-24h' : d.afiliada ? 'pin-afiliada' : 'pin-regular';
    const tagTexto = d.es24h ? '24H' : d.afiliada ? '★' : '+';

    const customIcon = L.divIcon({
      className: 'farmapp-leaflet-marker',
      html: `
        <div class="custom-pin ${clasePin}">
          <span class="pin-symbol">${tagTexto}</span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const marker = L.marker([d.lat, d.lng], { icon: customIcon });

    const linkWhatsApp = `https://wa.me/${d.whatsapp}?text=${encodeURIComponent('Hola ' + d.nombre + ', los vi en FarmApp Villavicencio.')}`;
    const linkMaps = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
    const distanciaHtml =
      d.distanciaKm !== undefined
        ? `<span class="popup-distancia">📍 A ${d.distanciaKm < 1 ? Math.round(d.distanciaKm * 1000) + ' m' : d.distanciaKm.toFixed(1) + ' km'}</span>`
        : '';

    const popupHtml = `
      <div class="leaflet-popup-card">
        <div class="popup-pill-row">
          <span class="popup-tag ${d.es24h ? 'tag-green' : 'tag-blue'}">${d.es24h ? 'Abierto 24 Horas' : 'Horario Diurno'}</span>
          <span class="popup-barrio">${d.barrio}</span>
        </div>
        <h4 class="popup-title">${d.nombre}</h4>
        <p class="popup-dir">${d.direccion}</p>
        ${distanciaHtml}
        <p class="popup-meta"><strong>Teléfono:</strong> <a href="tel:${d.telefono}">${d.telefono}</a></p>
        <div class="popup-btn-row">
          <a href="${linkWhatsApp}" target="_blank" rel="noopener" class="popup-btn popup-btn--wa">
            Pedir por WhatsApp
          </a>
          <a href="${linkMaps}" target="_blank" rel="noopener" class="popup-btn popup-btn--maps">
            Cómo llegar
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 320 });

    marker.on('click', () => {
      emit('select-drogueria', d.id);
    });

    markersLayer.addLayer(marker);
  });
}

function actualizarUbicacionUsuario(L: any) {
  if (!mapInstance) return;

  if (userMarker) {
    mapInstance.removeLayer(userMarker);
    userMarker = null;
  }
  if (userAccuracyCircle) {
    mapInstance.removeLayer(userAccuracyCircle);
    userAccuracyCircle = null;
  }

  if (props.userLat !== null && props.userLng !== null) {
    const userPos: [number, number] = [props.userLat, props.userLng];

    userAccuracyCircle = L.circle(userPos, {
      radius: 350,
      color: '#0a84ff',
      fillColor: '#0a84ff',
      fillOpacity: 0.16,
      weight: 1,
    }).addTo(mapInstance);

    const userIcon = L.divIcon({
      className: 'user-gps-divicon',
      html: `
        <div class="user-gps-dot">
          <span class="user-pulse"></span>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    userMarker = L.marker(userPos, { icon: userIcon })
      .addTo(mapInstance)
      .bindPopup('<b>Tu ubicación actual</b><br>Droguerías calculadas por cercanía.');

    mapInstance.flyTo(userPos, 14, { duration: 1.2 });
  }
}

function centrarTodaLaCiudad() {
  sectorActivo.value = 'todos';
  if (mapInstance) {
    mapInstance.fitBounds(VILLAVICENCIO_BOUNDS, {
      padding: [24, 24],
      maxZoom: 14,
      animate: true,
      duration: 0.8,
    });
  }
}

function irASector(sector: (typeof SECTORES)[number]) {
  sectorActivo.value = sector.id;
  if (!mapInstance) return;

  if (sector.id === 'todos') {
    centrarTodaLaCiudad();
    emit('select-barrio', 'Todos los barrios');
    return;
  }

  if (sector.lat && sector.lng) {
    mapInstance.flyTo([sector.lat, sector.lng], sector.zoom, { duration: 1 });
  }
}

watch(
  () => props.droguerias,
  () => {
    if ((window as any).L) {
      renderizarMarcadores((window as any).L);
    }
  },
  { deep: true },
);

watch(
  () => [props.userLat, props.userLng],
  () => {
    if ((window as any).L) {
      actualizarUbicacionUsuario((window as any).L);
    }
  },
);

watch(
  () => props.barrioSeleccionado,
  (nuevoBarrio) => {
    if (!mapInstance || !(window as any).L) return;
    if (!nuevoBarrio || nuevoBarrio === 'Todos los barrios') {
      centrarTodaLaCiudad();
      return;
    }

    const drogueriasBarrio = props.droguerias.filter((d) => d.barrio === nuevoBarrio);
    if (drogueriasBarrio.length === 1) {
      const d = drogueriasBarrio[0];
      mapInstance.flyTo([d.lat, d.lng], 16, { duration: 1 });
    } else if (drogueriasBarrio.length > 1) {
      const L = (window as any).L;
      const bounds = L.latLngBounds(drogueriasBarrio.map((d) => [d.lat, d.lng]));
      mapInstance.fitBounds(bounds.pad(0.18), { maxZoom: 16, duration: 1 });
    }
  },
);

onMounted(async () => {
  try {
    const L = await cargarLeafletScript();
    await nextTick();
    inicializarMapa(L);
    if (props.userLat !== null && props.userLng !== null) {
      actualizarUbicacionUsuario(L);
    }
  } catch (err) {
    console.error('Error inicializando mapa de Villavicencio:', err);
    errorCarga.value = true;
    cargando.value = false;
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<template>
  <div class="map-card-wrapper">
    <div class="map-header">
      <div class="map-title-row">
        <span class="map-badge">Red Metropolitana</span>
        <h3>Mapa Oficial de Droguerías en Villavicencio</h3>
      </div>
      <div class="map-controls-row">
        <!-- Selector de capas libres (Cero API Key) -->
        <div class="layer-selector" role="group" aria-label="Tipo de mapa">
          <button
            v-for="(cfg, key) in CAPAS_MAPA"
            :key="key"
            type="button"
            class="layer-pill"
            :class="{ active: tipoCapa === key }"
            @click="cambiarCapa(key as TipoCapa)"
          >
            {{ cfg.label }}
          </button>
        </div>

        <button type="button" class="reset-bounds-btn" @click="centrarTodaLaCiudad">
          Ver toda la ciudad
        </button>
        <div class="map-legend">
          <span class="legend-item"><span class="dot dot-24h" /> 24 Horas</span>
          <span class="legend-item"><span class="dot dot-afiliada" /> Verificada</span>
          <span class="legend-item"><span class="dot dot-normal" /> Diurna</span>
        </div>
      </div>
    </div>

    <!-- Barra de acceso rápido a sectores clave de la ciudad -->
    <div class="sectors-bar">
      <button
        v-for="s in SECTORES"
        :key="s.id"
        type="button"
        class="sector-pill"
        :class="{ active: sectorActivo === s.id }"
        @click="irASector(s)"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Contenedor del Mapa Real -->
    <div class="map-stage">
      <div v-if="cargando" class="map-loading-overlay">
        <div class="loading-spinner" />
        <p>Cargando mapa de Villavicencio con droguerías...</p>
      </div>

      <div v-if="errorCarga" class="map-error-overlay">
        <p>No se pudo conectar con el servicio de mapas en este momento.</p>
        <a
          href="https://www.google.com/maps/search/droguerias/@4.135,-73.630,13z"
          target="_blank"
          rel="noopener"
          class="external-maps-link"
        >
          Abrir en Google Maps
        </a>
      </div>

      <div ref="mapContainer" class="leaflet-map-element" />
    </div>
  </div>
</template>

<style scoped>
.map-card-wrapper {
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
  padding: 4px 6px 12px;
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

.map-controls-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.layer-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--glass-control-bg);
  padding: 3px;
  border-radius: 10px;
  border: 1px solid var(--line);
}

.layer-pill {
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 0.74rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.16s ease;
}

.layer-pill:hover {
  color: var(--ink);
}

.layer-pill.active {
  background: rgba(10, 132, 255, 0.22);
  color: var(--ink);
  font-weight: 700;
  border: 1px solid var(--blue-bright);
}

.reset-bounds-btn {
  padding: 5px 12px;
  border-radius: 8px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-bounds-btn:hover {
  background: var(--nav-hover-bg);
  border-color: var(--blue-bright);
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

.dot-24h {
  background: #10b981;
}

.dot-afiliada {
  background: #f59e0b;
}

.dot-normal {
  background: #0284c7;
}

/* Barra de sectores */
.sectors-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 0 4px 12px;
  margin-bottom: 8px;
  scrollbar-width: thin;
}

.sector-pill {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  color: var(--muted);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.sector-pill:hover {
  color: var(--ink);
  border-color: var(--blue-bright);
  background: var(--nav-hover-bg);
}

.sector-pill.active {
  background: rgba(10, 132, 255, 0.2);
  color: var(--ink);
  border-color: var(--blue-bright);
  font-weight: 700;
}

.map-stage {
  position: relative;
  width: 100%;
  height: 520px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line-soft);
}

.leaflet-map-element {
  width: 100%;
  height: 100%;
  background: #0b1220;
}

/* Spinner y overlays */
.map-loading-overlay,
.map-error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--glass-strong);
  z-index: 10;
  color: var(--ink);
  font-size: 0.9rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--blue-bright);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.external-maps-link {
  color: var(--aqua);
  font-weight: 600;
  text-decoration: underline;
}

/* Marcadores Personalizados de Leaflet */
:deep(.farmapp-leaflet-marker) {
  background: transparent;
  border: none;
}

:deep(.custom-pin) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
  border: 2px solid #ffffff;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.custom-pin:hover) {
  transform: rotate(-45deg) scale(1.22);
  z-index: 9999 !important;
}

:deep(.pin-symbol) {
  transform: rotate(45deg);
  font-size: 12px;
  font-weight: 900;
  color: #ffffff;
  user-select: none;
}

:deep(.pin-24h) {
  background: linear-gradient(135deg, #10b981, #059669);
}

:deep(.pin-afiliada) {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

:deep(.pin-regular) {
  background: linear-gradient(135deg, #0284c7, #0369a1);
}

/* Marcador GPS del Usuario */
:deep(.user-gps-divicon) {
  background: transparent;
  border: none;
}

:deep(.user-gps-dot) {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #007aff;
  border: 2px solid #ffffff;
  box-shadow: 0 0 10px rgba(0, 122, 255, 0.8);
}

:deep(.user-pulse) {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #007aff;
  animation: pulse-ring 1.8s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

/* Popup de Leaflet */
:deep(.leaflet-popup-content-wrapper) {
  background: var(--bg-1, #0c1426) !important;
  color: var(--ink, #ffffff) !important;
  border-radius: 16px !important;
  border: 1px solid var(--line, rgba(255, 255, 255, 0.15)) !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7) !important;
  padding: 6px !important;
}

[data-theme='light'] :deep(.leaflet-popup-content-wrapper) {
  background: #ffffff !important;
  color: #0b1220 !important;
  border-color: rgba(15, 23, 42, 0.12) !important;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16) !important;
}

:deep(.leaflet-popup-tip) {
  background: var(--bg-1, #0c1426) !important;
}

[data-theme='light'] :deep(.leaflet-popup-tip) {
  background: #ffffff !important;
}

:deep(.leaflet-popup-card) {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.popup-pill-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

:deep(.popup-tag) {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

:deep(.tag-green) {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

:deep(.tag-blue) {
  background: rgba(2, 132, 199, 0.2);
  color: #0284c7;
}

:deep(.popup-barrio) {
  font-size: 0.72rem;
  color: var(--muted, #94a3b8);
  font-weight: 600;
}

:deep(.popup-title) {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--ink, #ffffff);
  line-height: 1.25;
  margin: 2px 0 0;
}

[data-theme='light'] :deep(.popup-title) {
  color: #0b1220;
}

:deep(.popup-dir) {
  font-size: 0.78rem;
  color: var(--ink-soft, #cbd5e1);
  margin: 0;
}

[data-theme='light'] :deep(.popup-dir) {
  color: #334155;
}

:deep(.popup-distancia) {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--aqua, #5ac8fa);
}

:deep(.popup-meta) {
  font-size: 0.76rem;
  color: var(--muted, #94a3b8);
  margin: 0;
}

:deep(.popup-meta a) {
  color: var(--ink);
  text-decoration: underline;
}

:deep(.popup-btn-row) {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 6px;
  margin-top: 6px;
}

:deep(.popup-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
}

:deep(.popup-btn--wa) {
  background: #25d366;
  color: #ffffff;
}

:deep(.popup-btn--wa:hover) {
  background: #1ebc59;
}

:deep(.popup-btn--maps) {
  background: var(--line-soft, rgba(255, 255, 255, 0.1));
  color: var(--ink, #ffffff);
  border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
}

[data-theme='light'] :deep(.popup-btn--maps) {
  background: #f1f5f9;
  color: #0b1220;
  border-color: rgba(15, 23, 42, 0.12);
}

@media (max-width: 620px) {
  .map-stage {
    height: 420px;
  }
}
</style>
