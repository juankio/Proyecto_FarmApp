<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Drogueria } from '../../data/droguerias';
import {
  VILLAVICENCIO_BOUNDS,
  calificacionDrogueria,
  obtenerCadenaInfo,
  resenasDrogueria,
} from '../../data/droguerias';
import { logoMarkup } from '../../utils/logosMarcas';
import { COMUNAS, comunaPorId } from '../../data/comunas';

const props = defineProps<{
  droguerias: (Drogueria & { distanciaKm?: number; precioOferta?: number; esMejorPrecio?: boolean })[];
  drogueriasTotales?: (Drogueria & { distanciaKm?: number })[];
  userLat: number | null;
  userLng: number | null;
  barrioSeleccionado?: string;
  comuna?: number | null;
  precision?: number | null;
  ajustandoUbicacion?: boolean;
  mensajeVacio?: string;
  integrado?: boolean;
  minimal?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-drogueria', id: number): void;
  (e: 'select-barrio', barrio: string): void;
  (e: 'select-comuna', id: number): void;
  (e: 'update-ubicacion', coords: { lat: number; lng: number }): void;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
const cargando = ref(true);
const errorCarga = ref(false);
const comunaPendiente = ref<number | null>(null);
const sectorActivo = ref<string>('todos');

// Referencias a instancias de Leaflet
let mapInstance: any = null;
let markersLayer: any = null;
let tileLayer: any = null;
let userMarker: any = null;
let userAccuracyCircle: any = null;
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;
const markersMap = new Map<number, { marker: any; lat: number; lng: number }>();

function enfocarDrogueria(id: number) {
  const item = markersMap.get(id);
  if (!item || !mapInstance) return;
  mapInstance.flyTo([item.lat, item.lng], 16, { duration: 0.8 });
  item.marker.openPopup();
}

// Sectores de Villavicencio para navegación rápida
const SECTORES = [
  { id: 'todos', label: 'Toda la ciudad' },
  { id: 'barzal', label: 'El Barzal (Salud)', lat: 4.143, lng: -73.6345, zoom: 16 },
  { id: 'centro', label: 'Centro histórico', lat: 4.1505, lng: -73.6365, zoom: 16 },
  { id: 'siete-agosto', label: '7 de Agosto / Viva', lat: 4.136, lng: -73.637, zoom: 15 },
  { id: 'esperanza', label: 'La Esperanza', lat: 4.133, lng: -73.6265, zoom: 15 },
  { id: 'porfia', label: 'Porfía / Sur', lat: 4.073, lng: -73.663, zoom: 14 },
  { id: 'oriente', label: 'Kirpas / San Benito', lat: 4.128, lng: -73.6, zoom: 14 },
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
    label: 'Calles',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  },
  esri: {
    label: 'Detalle',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Tiles &copy; <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>',
  },
  satelite: {
    label: 'Satélite',
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
    console.warn('[FarmApp] Tile falló, se retira capa actual');
    if (!mapInstance || !tileLayer) return;
    mapInstance.removeLayer(tileLayer);
    tileLayer = null;
    tipoCapa.value = 'osm';
    tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapInstance);
  });

  tileLayer.addTo(mapInstance);
}

function reintentarMapa(L: any) {
  if (!mapInstance) return;
  errorCarga.value = false;
  tipoCapa.value = 'osm';
  actualizarCapaBase(L);
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

  const seleccionarComunaDesdeMapa = (evento: Event) => {
    const objetivo = (evento.target as HTMLElement | null)?.closest?.('[data-comuna]');
    if (!objetivo || objetivo.classList.contains('cluster-vacia')) return;
    const id = Number(objetivo.getAttribute('data-comuna'));
    if (Number.isFinite(id)) emit('select-comuna', id);
  };
  mapContainer.value.addEventListener('pointerdown', seleccionarComunaDesdeMapa, true);
  mapInstance.on('click', (evento: any) => {
    if (props.ajustandoUbicacion) {
      emit('update-ubicacion', { lat: evento.latlng.lat, lng: evento.latlng.lng });
    }
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
  mapInstance.on('zoomend', () => renderizarMarcadores(L));
  if (props.comuna != null) irAComuna(props.comuna);
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
  markersMap.clear();

  if (!props.droguerias.length && !props.drogueriasTotales?.length) return;

  const zoom = mapInstance.getZoom();
  // Con comuna activa se conservan los 10 círculos para poder cambiar de zona, incluso al hacer zoom.
  const agrupar = zoom <= 14 || props.comuna != null;
  // Con una comuna activa se conservan los 10 círculos para poder cambiar de zona.
  const base =
    props.comuna != null && props.drogueriasTotales?.length ? props.drogueriasTotales : props.droguerias;
  const grupos = new Map<number, typeof base>();

  base.forEach((d) => {
    const clave = agrupar ? d.comuna : d.id;
    const lista = grupos.get(clave) ?? [];
    lista.push(d);
    grupos.set(clave, lista);
  });

  grupos.forEach((lista, idComuna) => {
    if (agrupar && (lista.length > 1 || props.comuna != null)) {
      const comuna = comunaPorId(idComuna);
      if (comuna) {
        const iconoGrupo = L.divIcon({
          className: 'farmapp-cluster',
          html: `<div class="cluster-pin cluster-comuna ${props.comuna === comuna.id ? 'cluster-activa' : ''}" data-comuna="${comuna.id}" style="--comuna-color:${comuna.color}" title="Comuna ${comuna.id} · ${comuna.nombre} · ${lista.length} droguerías">${comuna.id}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
        const grupo = L.marker(comuna.centro, {
          icon: iconoGrupo,
          title: `Comuna ${comuna.id} · ${comuna.nombre}`,
        });
        markersLayer.addLayer(grupo);
        return;
      }
    }

    const d = lista[0];
    const brand = obtenerCadenaInfo(d.cadena);

    const opiniones = resenasDrogueria(d.id);

    const customIcon = L.divIcon({
      className: 'farmapp-leaflet-marker',
      html: `
        <div class="custom-pin" title="${d.nombre} (${brand.nombre})">
          <span class="pin-symbol" style="width:26px;height:26px;flex:0 0 26px;overflow:hidden;border-radius:50%">
            ${logoMarkup(d.cadena, 26)}
          </span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -30],
    });

    const marker = L.marker([d.lat, d.lng], { icon: customIcon, title: `${d.nombre} · ${brand.nombre}` });
    markersMap.set(d.id, { marker, lat: d.lat, lng: d.lng });

    const linkWhatsApp = `https://wa.me/${d.whatsapp}?text=${encodeURIComponent('Hola ' + d.nombre + ', los vi en FarmApp Villavicencio.')}`;
    const linkMaps = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
    const distanciaHtml =
      d.distanciaKm !== undefined
        ? `<span class="popup-distancia">📍 A ${d.distanciaKm < 1 ? Math.round(d.distanciaKm * 1000) + ' m' : d.distanciaKm.toFixed(1) + ' km'}</span>`
        : '';

    const badgeTipoHtml =
      brand.tipo === 'independiente'
        ? `<span class="popup-brand-badge brand-independiente">Boticario de barrio</span>`
        : `<span class="popup-brand-badge" style="background:${brand.colorLight}; color:${brand.color}; border-color:${brand.color}55;">${brand.nombre}</span>`;

    const popupHtml = `
      <div class="leaflet-popup-card">
        ${logoMarkup(d.cadena, 46)}
        <div class="popup-pill-row">
          ${badgeTipoHtml}
          <span class="popup-barrio">${d.barrio}</span>
        </div>
        <div class="popup-status-row">
          <span class="popup-tag ${d.es24h ? 'tag-green' : 'tag-verde'}">${d.es24h ? 'Abierto 24 Horas' : 'Horario Diurno'}</span>
          ${d.afiliada ? '<span class="popup-tag tag-gold">Verificada</span>' : ''}
          ${d.domicilio ? '<span class="popup-tag tag-terracota">Domicilio</span>' : ''}
        </div>
        <h4 class="popup-title">${d.nombre}</h4>
        <p class="popup-rating">
          <span class="popup-rating-value">${calificacionDrogueria(d.id)}</span>
          <span class="popup-rating-stars" aria-hidden="true">★★★★★</span>
          <span class="popup-rating-count">${opiniones} reseñas</span>
        </p>
        <p class="popup-dir">${d.direccion}</p>
        ${distanciaHtml}
        <p class="popup-meta"><strong>Horario:</strong> ${d.horario}</p>
        ${d.telefono ? `<p class="popup-meta"><strong>Teléfono:</strong> <a href="tel:${d.telefono}">${d.telefono}</a></p>` : ''}
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

  if (agrupar) {
    COMUNAS.forEach((comuna) => {
      if (grupos.has(comuna.id)) return;
      const icono = L.divIcon({
        className: 'farmapp-cluster',
        html: `<div class="cluster-pin cluster-comuna cluster-vacia" data-comuna="${comuna.id}" style="--comuna-color:${comuna.color}" title="Comuna ${comuna.id} · ${comuna.nombre} · sin droguerías registradas">${comuna.id}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const marcador = L.marker(comuna.centro, {
        icon: icono,
        title: `Comuna ${comuna.id} · ${comuna.nombre} · sin droguerías`,
      });
      markersLayer.addLayer(marcador);
    });
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
      radius: Math.min(3000, Math.max(50, props.precision ?? 350)),
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

function irAComuna(id: number) {
  comunaPendiente.value = id;
  const comuna = comunaPorId(id);
  if (!mapInstance || !comuna) return;
  mapInstance.flyTo(comuna.centro, 15, { duration: 1 });
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

watch(
  () => props.comuna,
  (id) => {
    if (!mapInstance) return;
    if (id == null) centrarTodaLaCiudad();
    else irAComuna(id);
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

defineExpose({ enfocarDrogueria, centrarTodaLaCiudad, irAComuna });
</script>

<template>
  <div
    class="map-card-wrapper"
    :class="{ 'map-card-wrapper--minimal': minimal, 'map-card-wrapper--integrado': integrado }"
  >
    <div v-if="!minimal && !integrado" class="map-header">
      <div class="map-title-row">
        <span class="map-badge">Red Metropolitana</span>
        <h3>Mapa Oficial de Droguerías en Villavicencio</h3>
      </div>
    </div>

    <div class="map-layout">
    <slot name="zonas">
      <div v-if="!minimal" class="sectors-bar">
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
    </slot>

    <!-- Contenedor del Mapa Real -->
    <div class="map-stage" :class="{ 'map-stage--minimal': minimal, 'map-stage--ajustando': ajustandoUbicacion }">
      <div v-if="cargando" class="map-loading-overlay">
        <div class="loading-spinner" />
        <p>Cargando mapa de Villavicencio con droguerías...</p>
      </div>

      <div v-if="errorCarga" class="map-error-overlay">
        <p>No se pudo conectar con el servicio de mapas en este momento.</p>
        <div class="map-error-actions">
          <button type="button" class="retry-maps-btn" @click="reintentarMapa">
            Reintentar conexión
          </button>
          <a
            href="https://www.google.com/maps/search/droguerias/@4.135,-73.630,13z"
            target="_blank"
            rel="noopener"
            class="external-maps-link"
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>

      <div v-if="!cargando && !errorCarga && props.droguerias.length === 0 && mensajeVacio" class="map-empty-overlay">
        <div class="map-empty-card">
          <span class="map-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </span>
          <p>{{ mensajeVacio }}</p>
          <div class="map-empty-actions"><slot name="acciones-vacias" /></div>
        </div>
      </div>

      <div ref="mapContainer" class="leaflet-map-element" />
    </div>
    </div>

    <div class="map-footer">
      <div class="map-controls-row">
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
          <span class="legend-item"><span class="dot dot-rebaja" /> La Rebaja</span>
          <span class="legend-item"><span class="dot dot-cruzverde" /> Cruz Verde</span>
          <span class="legend-item"><span class="dot dot-cadenas" /> Otras Cadenas</span>
          <span class="legend-item"><span class="dot dot-independiente" /> De Barrio (Boticario)</span>
          <span class="legend-item"><span class="badge-pill-24h">24H</span> De Turno</span>
        </div>
        <slot name="controles-extra" />
      </div>
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
  overflow: hidden;
  max-width: 100%;
}

.map-card-wrapper--integrado {
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  border-top: none;
  box-shadow: var(--shadow-sm);
  padding-top: 8px;
  margin-top: -1px;
}

.map-card-wrapper--minimal {
  padding: 0;
  margin-bottom: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
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
  flex-shrink: 0;
}

.dot-rebaja {
  background: #dc2626;
}

.dot-cruzverde {
  background: #059669;
}

.dot-cadenas {
  background: #0284c7;
}

.dot-independiente {
  background: #7c3aed;
}

.badge-pill-24h {
  display: inline-block;
  background: #10b981;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 4px;
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

.map-layout {
  display: flex;
  align-items: stretch;
  gap: 10px;
  min-width: 0;
}

.map-footer {
  padding-top: 12px;
}

.map-stage {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  height: 520px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line-soft);
}

.map-stage--minimal {
  height: 480px;
  border-radius: 0;
  border: none;
}

.map-stage--ajustando,
.map-stage--ajustando .leaflet-container {
  cursor: crosshair !important;
}

.leaflet-map-element {
  width: 100%;
  height: 100%;
  background: #efe7d6;
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
  color: var(--verde-deep);
  font-weight: 600;
  text-decoration: underline;
}

.map-error-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.map-empty-overlay {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: grid;
  place-items: center;
  padding: 20px;
  background: var(--surface-raised);
}

.map-empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 420px;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  background: var(--bg-1);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
}

.map-empty-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--verde);
  background: rgba(31, 107, 79, 0.1);
}

.map-empty-card p {
  font-size: 0.9rem;
  color: var(--ink);
}

.map-empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.map-empty-actions button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: var(--bg-2);
  color: var(--verde-texto);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.map-empty-actions button:hover {
  border-color: var(--verde);
}

.retry-maps-btn {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1.5px solid var(--verde-deep);
  background: var(--verde);
  color: var(--sobre-acento);
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.18s;
}

.retry-maps-btn:hover {
  background: var(--verde-deep);
}

/* Marcadores Personalizados de Leaflet */
:deep(.farmapp-leaflet-marker) {
  background: transparent;
  border: none;
}

:deep(.custom-pin) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 3px;
  border-radius: 50%;
  background: var(--verde);
  border: 1.5px solid #fffdf7;
  box-shadow: 0 3px 10px -3px rgba(22, 36, 29, 0.5);
  cursor: pointer;
  transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease);
}

:deep(.custom-pin:hover) {
  transform: scale(1.16);
  box-shadow: 0 8px 18px -4px rgba(22, 36, 29, 0.55);
  z-index: 9999 !important;
}

:deep(.farmapp-cluster) {
  background: transparent;
  border: none;
}

:deep(.cluster-pin) {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--verde);
  color: var(--sobre-acento);
  border: 1.5px solid #fffdf7;
  box-shadow: 0 0 0 3px rgba(31, 107, 79, 0.2), 0 6px 14px -6px rgba(22, 36, 29, 0.5);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s var(--ease);
}

:deep(.cluster-activa) {
  box-shadow: 0 0 0 5px rgba(31, 107, 79, 0.45), 0 8px 16px -6px rgba(22, 36, 29, 0.6);
  transform: scale(1.08);
}

:deep(.cluster-vacia) {
  opacity: 0.45;
  border-style: dashed;
  pointer-events: none;
  cursor: default;
}

:deep(.cluster-comuna) {
  background: var(--comuna-color);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--comuna-color) 22%, transparent),
    0 8px 16px -6px rgba(22, 36, 29, 0.5);
}

:deep(.cluster-pin:hover) {
  transform: scale(1.1);
}

:deep(.pin-symbol) {
  display: flex;
  flex: 0 0 26px;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  line-height: 1;
}

:deep(.pin-symbol svg) {
  display: block;
}

:deep(.logo-marca) {
  display: block;
  flex: 0 0 auto;
}

:deep(.leaflet-container .leaflet-marker-pane .pin-symbol .logo-marca-img) {
  width: 26px !important;
  height: 26px !important;
  max-width: 26px !important;
  max-height: 26px !important;
  object-fit: contain !important;
  border-radius: 50% !important;
  background: #fffdf7 !important;
}

:deep(.leaflet-popup-card > .logo-marca-img) {
  width: 46px;
  height: 46px;
  max-width: 46px;
  max-height: 46px;
  object-fit: contain;
  margin: 0 auto;
}

:deep(.pin-txt-lr) {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: -0.5px;
}

:deep(.pin-txt-brand) {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: -0.5px;
}

:deep(.pin-badge-24h) {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #10b981;
  color: #ffffff;
  font-size: 7.5px;
  font-weight: 900;
  padding: 1px 3.5px;
  border-radius: 6px;
  border: 1.5px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  letter-spacing: -0.5px;
}

/* Colores de pines por marca */
:deep(.pin-rebaja) {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}
:deep(.pin-cruzverde) {
  background: linear-gradient(135deg, #10b981, #047857);
}
:deep(.pin-copifam) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}
:deep(.pin-farmacenter) {
  background: linear-gradient(135deg, #0284c7, #0369a1);
}
:deep(.pin-economia) {
  background: linear-gradient(135deg, #f97316, #c2410c);
}
:deep(.pin-cafam) {
  background: linear-gradient(135deg, #e11d48, #9f1239);
}
:deep(.pin-pasteur) {
  background: linear-gradient(135deg, #475569, #0f172a);
}
:deep(.pin-colsubsidio) {
  background: linear-gradient(135deg, #0284c7, #b91c1c);
}
:deep(.pin-audifarma) {
  background: linear-gradient(135deg, #14b8a6, #0f766e);
}
:deep(.pin-alemana) {
  background: linear-gradient(135deg, #d97706, #92400e);
}
:deep(.pin-independiente) {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.5);
}

:deep(.pin-afiliada-glow) {
  border-color: #fbbf24 !important;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.7), 0 4px 8px rgba(0, 0, 0, 0.5) !important;
}

:deep(.pin-price-tag) {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-1, #0c1426);
  color: var(--ink, #ffffff);
  border: 1px solid var(--line, rgba(255, 255, 255, 0.25));
  font-size: 0.65rem;
  font-weight: 850;
  padding: 1px 6px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  z-index: 5;
}

[data-theme='light'] :deep(.pin-price-tag) {
  background: #ffffff;
  color: #0b1220;
  border-color: rgba(15, 23, 42, 0.2);
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.15);
}

:deep(.pin-price-tag.price-best) {
  background: #30d158 !important;
  color: #ffffff !important;
  border-color: #ffffff !important;
  font-weight: 900;
  box-shadow: 0 0 12px rgba(48, 209, 88, 0.8) !important;
  animation: pulse-price 1.8s ease-in-out infinite;
}

@keyframes pulse-price {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.08); }
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

:deep(.popup-brand-badge) {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  border: 1px solid transparent;
}

:deep(.brand-independiente) {
  background: rgba(124, 58, 237, 0.16);
  color: #a78bfa;
  border-color: rgba(124, 58, 237, 0.35);
}

[data-theme='light'] :deep(.brand-independiente) {
  color: #6d28d9;
}

:deep(.popup-status-row) {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  margin: 2px 0;
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
  color: var(--verde-texto);
}

:deep(.tag-verde) {
  background: rgba(31, 107, 79, 0.16);
  color: var(--verde-deep);
}

:deep(.tag-gold) {
  background: rgba(216, 154, 43, 0.16);
  color: #9a6a0a;
}

:deep(.tag-terracota) {
  background: rgba(192, 90, 50, 0.14);
  color: #8f3e1d;
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

:deep(.popup-rating) {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 3px 0 2px;
  font-size: 0.74rem;
  color: var(--muted);
}

:deep(.popup-rating-value) {
  font-weight: 800;
  color: var(--ink);
}

:deep(.popup-rating-stars) {
  color: var(--ambar);
  letter-spacing: 1px;
  font-size: 0.72rem;
}

:deep(.popup-rating-count) {
  color: var(--muted);
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
  color: #06210f;
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
    height: 360px;
  }
  .map-layout {
    flex-direction: column;
  }
  .map-footer {
    padding-top: 8px;
  }
  .map-controls-row {
    gap: 8px;
  }
  .map-legend {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 2px;
  }
  .map-header {
    padding: 4px 2px 8px;
  }
}
</style>
