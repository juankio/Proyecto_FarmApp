<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

const mapContainer = ref<HTMLDivElement | null>(null);
const cargando = ref(true);
const errorCarga = ref(false);

// Referencias a instancias de Leaflet
let mapInstance: any = null;
let markersLayer: any = null;
let userMarker: any = null;
let userAccuracyCircle: any = null;

// Cargar Leaflet dinámicamente
function cargarLeafletScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).L) {
      return resolve((window as any).L);
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (document.getElementById('leaflet-js')) {
      const interval = setInterval(() => {
        if ((window as any).L) {
          clearInterval(interval);
          resolve((window as any).L);
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error('No se pudo cargar Leaflet'));
    document.head.appendChild(script);
  });
}

function inicializarMapa(L: any) {
  if (!mapContainer.value) return;

  // Centro general de Villavicencio
  mapInstance = L.map(mapContainer.value, {
    center: [4.125, -73.630],
    zoom: 13,
    minZoom: 11,
    maxZoom: 18,
    scrollWheelZoom: false,
  });

  // Capa base de OpenStreetMap oficial
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(mapInstance);

  markersLayer = L.featureGroup().addTo(mapInstance);
  renderizarMarcadores(L);
  cargando.value = false;
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
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([d.lat, d.lng], { icon: customIcon });

    const linkWhatsApp = `https://wa.me/${d.whatsapp}?text=${encodeURIComponent('Hola ' + d.nombre + ', los vi en FarmApp Villavicencio.')}`;
    const linkMaps = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;

    const popupHtml = `
      <div class="leaflet-popup-card">
        <div class="popup-pill-row">
          <span class="popup-tag ${d.es24h ? 'tag-green' : 'tag-blue'}">${d.es24h ? 'Abierto 24 Horas' : 'Horario Diurno'}</span>
          <span class="popup-barrio">${d.barrio}</span>
        </div>
        <h4 class="popup-title">${d.nombre}</h4>
        <p class="popup-dir">${d.direccion}</p>
        <p class="popup-meta"><strong>Teléfono:</strong> ${d.telefono}</p>
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

  // Ajustar el encuadre para abarcar todas las droguerías en toda la ciudad
  if (markersLayer.getLayers().length > 0) {
    mapInstance.fitBounds(markersLayer.getBounds().pad(0.12));
  }
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
      radius: 300,
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
  if (mapInstance && markersLayer && markersLayer.getLayers().length > 0) {
    mapInstance.fitBounds(markersLayer.getBounds().pad(0.12));
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
    if (drogueriasBarrio.length > 0) {
      const avgLat = drogueriasBarrio.reduce((sum, d) => sum + d.lat, 0) / drogueriasBarrio.length;
      const avgLng = drogueriasBarrio.reduce((sum, d) => sum + d.lng, 0) / drogueriasBarrio.length;
      mapInstance.flyTo([avgLat, avgLng], 15, { duration: 1 });
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
        <span class="map-badge">Cobertura Completa</span>
        <h3>Mapa Oficial de Droguerías en Villavicencio</h3>
      </div>
      <div class="map-controls-row">
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

.map-controls-row {
  display: flex;
  align-items: center;
  gap: 14px;
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

.dot-24h { background: #30d158; }
.dot-afiliada { background: #ffd60a; }
.dot-normal { background: #0a84ff; }

.map-stage {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line-soft);
}

.leaflet-map-element {
  width: 100%;
  height: 100%;
  background: #0b1220;
}

/* Modo oscuro elegante para las teselas de OpenStreetMap */
[data-theme="dark"] :deep(.leaflet-tile) {
  filter: brightness(0.65) invert(1) contrast(2.6) hue-rotate(205deg) saturate(0.3) brightness(0.72);
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
  to { transform: rotate(360deg); }
}

.external-maps-link {
  color: var(--aqua);
  font-weight: 600;
  text-decoration: underline;
}

/* Estilos de los Marcadores Personalizados de Leaflet */
:deep(.farmapp-leaflet-marker) {
  background: transparent;
  border: none;
}

:deep(.custom-pin) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
  border: 2px solid #ffffff;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.custom-pin:hover) {
  transform: rotate(-45deg) scale(1.2);
}

:deep(.pin-symbol) {
  transform: rotate(45deg);
  font-size: 13px;
  font-weight: 900;
  color: #ffffff;
  user-select: none;
}

:deep(.pin-24h) {
  background: linear-gradient(135deg, #30d158, #248a3d);
}

:deep(.pin-afiliada) {
  background: linear-gradient(135deg, #ff9f0a, #d47e00);
}

:deep(.pin-regular) {
  background: linear-gradient(135deg, #0a84ff, #0056b3);
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
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
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

[data-theme="light"] :deep(.leaflet-popup-content-wrapper) {
  background: #ffffff !important;
  color: #0b1220 !important;
  border-color: rgba(15, 23, 42, 0.12) !important;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16) !important;
}

:deep(.leaflet-popup-tip) {
  background: var(--bg-1, #0c1426) !important;
}

[data-theme="light"] :deep(.leaflet-popup-tip) {
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
  background: rgba(48, 209, 88, 0.2);
  color: #30d158;
}

:deep(.tag-blue) {
  background: rgba(10, 132, 255, 0.2);
  color: #0a84ff;
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

[data-theme="light"] :deep(.popup-title) {
  color: #0b1220;
}

:deep(.popup-dir) {
  font-size: 0.78rem;
  color: var(--ink-soft, #cbd5e1);
  margin: 0;
}

[data-theme="light"] :deep(.popup-dir) {
  color: #334155;
}

:deep(.popup-meta) {
  font-size: 0.76rem;
  color: var(--muted, #94a3b8);
  margin: 0;
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

:deep(.popup-btn--maps) {
  background: var(--line-soft, rgba(255, 255, 255, 0.1));
  color: var(--ink, #ffffff);
  border: 1px solid var(--line, rgba(255, 255, 255, 0.15));
}

[data-theme="light"] :deep(.popup-btn--maps) {
  background: #f1f5f9;
  color: #0b1220;
  border-color: rgba(15, 23, 42, 0.12);
}

@media (max-width: 620px) {
  .map-stage {
    height: 380px;
  }
}
</style>
