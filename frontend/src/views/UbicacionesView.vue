<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import PageHero from '../components/layout/PageHero.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppInput from '../components/ui/AppInput.vue';
import MapaVillavicencio from '../components/ubicaciones/MapaVillavicencio.vue';
import ZonasComunas from '../components/ubicaciones/ZonasComunas.vue';
import {
  BARRIOS_VILLAVICENCIO,
  Drogueria,
  drogueriasVillavicencio,
  LISTA_CADENAS_FILTRO,
  obtenerCadenaInfo,
} from '../data/droguerias';
import { comunaPorId } from '../data/comunas';

const props = defineProps<{ embebido?: boolean }>();

const busqueda = ref('');
const barrioSeleccionado = ref<string>('Todos los barrios');
const cadenaSeleccionada = ref<string>('Todas las marcas');
const solo24h = ref(false);
const soloDomicilio = ref(false);
const soloAfiliadas = ref(false);
const mostrarMapa = ref(true);
const comunaActiva = ref<number | null>(null);

// Geolocalización del usuario
const userLat = ref<number | null>(null);
const userLng = ref<number | null>(null);
const calculandoGps = ref(false);
const errorGps = ref('');
const precisionGps = ref<number | null>(null);
const ajustandoUbicacion = ref(false);
const origenTipo = ref<'gps' | 'barrio' | 'manual'>('gps');

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

watch(barrioSeleccionado, (barrio) => {
  if (barrio === 'Todos los barrios') {
    if (origenTipo.value === 'barrio') origenTipo.value = 'gps';
    return;
  }
  const lista = drogueriasVillavicencio.filter((d) => d.barrio === barrio);
  if (!lista.length) return;
  userLat.value = lista.reduce((suma, d) => suma + d.lat, 0) / lista.length;
  userLng.value = lista.reduce((suma, d) => suma + d.lng, 0) / lista.length;
  precisionGps.value = null;
  origenTipo.value = 'barrio';
});

const mensajeValidacion = computed(() => {
  if (drogueriasProcesadas.value.length > 0) return '';
  const activos: string[] = [];
  if (cadenaSeleccionada.value !== 'Todas las marcas') activos.push(cadenaSeleccionada.value);
  if (comunaActiva.value !== null) activos.push(comunaPorId(comunaActiva.value)?.nombre ?? `Comuna ${comunaActiva.value}`);
  if (barrioSeleccionado.value !== 'Todos los barrios') activos.push(barrioSeleccionado.value);
  if (busqueda.value.trim()) activos.push(`“${busqueda.value.trim()}”`);
  return activos.length
    ? `No hay droguerías de ${activos.join(' · ')} en esta selección. Prueba a quitar alguno de estos filtros.`
    : 'No hay droguerías con estos filtros en Villavicencio.';
});

function limpiarFiltros(): void {
  busqueda.value = '';
  barrioSeleccionado.value = 'Todos los barrios';
  cadenaSeleccionada.value = 'Todas las marcas';
  comunaActiva.value = null;
  solo24h.value = false;
  soloDomicilio.value = false;
  soloAfiliadas.value = false;
}

function activarAjuste(): void {
  ajustandoUbicacion.value = !ajustandoUbicacion.value;
}

function onUbicacionAjustada(coords: { lat: number; lng: number }): void {
  userLat.value = coords.lat;
  userLng.value = coords.lng;
  precisionGps.value = 20;
  origenTipo.value = 'manual';
  ajustandoUbicacion.value = false;
}

function formatearDistancia(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

function solicitarGps(): void {
  if (!navigator.geolocation) {
    errorGps.value = 'Tu navegador no soporta geolocalización.';
    return;
  }
  calculandoGps.value = true;
  errorGps.value = '';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude;
      userLng.value = pos.coords.longitude;
      precisionGps.value = pos.coords.accuracy ?? null;
      origenTipo.value = 'gps';
      calculandoGps.value = false;
    },
    () => {
      errorGps.value = 'No pudimos acceder a tu ubicación. Puedes seleccionar tu barrio en la lista.';
      calculandoGps.value = false;
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

// Droguerías con distancia inyectada y filtradas
type DrogueriaConDistancia = Drogueria & { distanciaKm?: number };

const drogueriasProcesadas = computed<DrogueriaConDistancia[]>(() => {
  let lista: DrogueriaConDistancia[] = drogueriasVillavicencio.map((d) => {
    if (userLat.value !== null && userLng.value !== null) {
      return {
        ...d,
        distanciaKm: calcularDistanciaKm(userLat.value, userLng.value, d.lat, d.lng),
      };
    }
    return { ...d };
  });

  // Filtro por texto
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase().trim();
    lista = lista.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        d.cadena.toLowerCase().includes(q) ||
        d.direccion.toLowerCase().includes(q) ||
        d.barrio.toLowerCase().includes(q),
    );
  }

  // Filtro por comuna
  if (comunaActiva.value !== null) {
    lista = lista.filter((d) => d.comuna === comunaActiva.value);
  }

  // Filtro por barrio
  if (barrioSeleccionado.value !== 'Todos los barrios') {
    lista = lista.filter((d) => d.barrio === barrioSeleccionado.value);
  }

  // Filtro por marca o cadena
  if (cadenaSeleccionada.value !== 'Todas las marcas') {
    if (cadenaSeleccionada.value === 'Drogas La Rebaja') {
      lista = lista.filter((d) => d.cadena === 'La Rebaja');
    } else if (cadenaSeleccionada.value === 'Droguerías de Barrio (Independientes)') {
      lista = lista.filter((d) => d.cadena === 'Independiente');
    } else if (cadenaSeleccionada.value === 'Otras Cadenas') {
      const conocidas = [
        'La Rebaja',
        'Independiente',
        'Cruz Verde',
        'Copifam',
        'Farmacenter',
        'La Economía',
        'Cafam',
        'Pasteur',
      ];
      lista = lista.filter((d) => !conocidas.includes(d.cadena));
    } else {
      lista = lista.filter((d) => d.cadena === cadenaSeleccionada.value);
    }
  }

  // Filtros rápidos
  if (solo24h.value) {
    lista = lista.filter((d) => d.es24h);
  }
  if (soloDomicilio.value) {
    lista = lista.filter((d) => d.domicilio);
  }
  if (soloAfiliadas.value) {
    lista = lista.filter((d) => d.afiliada);
  }

  // Ordenar: Si hay GPS, ordenar por distancia; si no, afiliadas y destacadas primero
  if (userLat.value !== null && userLng.value !== null) {
    lista.sort((a, b) => (a.distanciaKm ?? 999) - (b.distanciaKm ?? 999));
  } else {
    lista.sort((a, b) => (b.afiliada ? 1 : 0) - (a.afiliada ? 1 : 0));
  }

  return lista;
});

function generarLinkWhatsApp(d: Drogueria): string {
  const texto = encodeURIComponent(
    `Hola ${d.nombre}, los encontré en FarmApp Villavicencio y quiero consultar disponibilidad y precios de medicamentos.`,
  );
  return `https://wa.me/${d.whatsapp}?text=${texto}`;
}

function generarLinkMaps(d: Drogueria): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
}

function onSelectDrogueria(id: number): void {
  const el = document.getElementById(`drog-${id}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('drog-card--highlight');
    setTimeout(() => {
      el.classList.remove('drog-card--highlight');
    }, 2400);
  }
}

onMounted(() => {
  // Intentar geolocalizar suavemente al abrir si el usuario lo permite
  if (navigator.permissions && navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
      if (perm.state === 'granted') {
        solicitarGps();
      }
    }).catch(() => {});
  }
});
</script>

<template>
  <PageHero
    v-if="!props.embebido"
    eyebrow="Red de Farmacias"
    title="Droguerías en Villavicencio"
    lede="Encuentra las droguerías más cercanas a tu barrio, farmacias abiertas 24 horas y droguerías con entrega a domicilio en toda la ciudad."
    compact
    centered
  />

  <section class="section reveal">
    <!-- Panel de controles y filtros -->
    <div class="filter-card">
      <div class="panel-heading">
        <div class="panel-heading-title">
          <span class="map-badge">Red Metropolitana</span>
          <h2>Mapa oficial de droguerías en Villavicencio</h2>
        </div>
        <button
          type="button"
          class="map-toggle-btn"
          :class="{ active: mostrarMapa }"
          @click="mostrarMapa = !mostrarMapa"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <span>{{ mostrarMapa ? 'Ocultar mapa' : 'Ver mapa' }}</span>
        </button>
      </div>

      <div class="filter-top">
        <div class="search-wrap">
          <AppInput
            v-model="busqueda"
            placeholder="Buscar por nombre, cadena o dirección..."
            aria-label="Buscar droguerías en Villavicencio"
          />
        </div>

        <div class="neighborhood-wrap">
          <label for="barrio-select" class="sr-only">Seleccionar barrio</label>
          <select id="barrio-select" v-model="barrioSeleccionado" class="custom-select">
            <option v-for="barrio in BARRIOS_VILLAVICENCIO" :key="barrio" :value="barrio">
              {{ barrio }}
            </option>
          </select>
        </div>

        <div class="brand-wrap">
          <label for="cadena-select" class="sr-only">Seleccionar marca</label>
          <select id="cadena-select" v-model="cadenaSeleccionada" class="custom-select">
            <option v-for="cadena in LISTA_CADENAS_FILTRO" :key="cadena" :value="cadena">
              {{ cadena }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="gps-btn"
          :class="{ active: userLat !== null, loading: calculandoGps }"
          @click="solicitarGps"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          <span>
            {{ origenTipo === 'barrio' ? `Cerca de ${barrioSeleccionado}` : userLat !== null ? 'GPS Activo' : 'Cerca de mí' }}
          </span>
        </button>

        <button
          v-if="userLat !== null"
          type="button"
          class="gps-btn ajustar-btn"
          :class="{ active: ajustandoUbicacion }"
          @click="activarAjuste"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
          </svg>
          <span>{{ ajustandoUbicacion ? 'Toca el mapa…' : 'Ajustar punto' }}</span>
        </button>
      </div>

      <div v-if="errorGps" class="gps-alert">
        {{ errorGps }}
      </div>

      <div v-if="precisionGps !== null && precisionGps > 300 && userLat !== null" class="gps-alert precision-alert">
        Ubicación aproximada (±{{ precisionGps >= 1000 ? (precisionGps / 1000).toFixed(1) + ' km' : Math.round(precisionGps) + ' m' }}).
        Usa «Ajustar punto» y toca el mapa para corregirla.
      </div>

    </div>

    <!-- Mapa Interactivo de Villavicencio -->
    <MapaVillavicencio
      v-if="mostrarMapa"
      :droguerias="drogueriasProcesadas"
      :droguerias-totales="drogueriasVillavicencio"
      :user-lat="userLat"
      :user-lng="userLng"
      :barrio-seleccionado="barrioSeleccionado"
      :comuna="comunaActiva"
      :precision="precisionGps"
      :ajustando-ubicacion="ajustandoUbicacion"
      @select-barrio="(b) => (barrioSeleccionado = b)"
      @select-drogueria="onSelectDrogueria"
      @select-comuna="comunaActiva = $event"
      @update-ubicacion="onUbicacionAjustada"
      :mensaje-vacio="mensajeValidacion"
      :integrado="true"
    >
      <template #zonas>
        <ZonasComunas
          vertical
          :droguerias="drogueriasVillavicencio"
          :activa="comunaActiva"
          @select="comunaActiva = $event"
        />
      </template>
      <template #controles-extra>
        <div class="chip-row">
          <button type="button" class="chip" :class="{ active: solo24h }" @click="solo24h = !solo24h">
            <span class="chip-dot dot-24h" /> Abiertas 24 Horas
          </button>
          <button type="button" class="chip" :class="{ active: soloDomicilio }" @click="soloDomicilio = !soloDomicilio">
            <span class="chip-dot dot-delivery" /> Con Domicilio
          </button>
          <button type="button" class="chip" :class="{ active: soloAfiliadas }" @click="soloAfiliadas = !soloAfiliadas">
            <span class="chip-dot dot-afiliada" /> Verificadas FarmApp
          </button>
          <span class="results-count">
            {{ drogueriasProcesadas.length }} droguería{{ drogueriasProcesadas.length === 1 ? '' : 's' }} encontrada{{ drogueriasProcesadas.length === 1 ? '' : 's' }}
          </span>
        </div>
      </template>
      <template #acciones-vacias>
        <button v-if="cadenaSeleccionada !== 'Todas las marcas'" type="button" @click="cadenaSeleccionada = 'Todas las marcas'">Quitar marca</button>
        <button v-if="comunaActiva !== null" type="button" @click="comunaActiva = null">Quitar zona</button>
        <button type="button" @click="limpiarFiltros">Limpiar filtros</button>
      </template>
    </MapaVillavicencio>

    <!-- Lista / Cuadrícula de Droguerías -->
    <div v-if="drogueriasProcesadas.length > 0" class="droguerias-grid">
      <article
        v-for="d in drogueriasProcesadas"
        :id="`drog-${d.id}`"
        :key="d.id"
        class="drog-card"
        :class="{ 'drog-card--featured': d.afiliada }"
      >
        <div class="drog-header">
          <div class="drog-badge-cluster">
            <span
              class="badge-brand"
              :style="{
                background: obtenerCadenaInfo(d.cadena).colorLight,
                color: obtenerCadenaInfo(d.cadena).color,
                borderColor: obtenerCadenaInfo(d.cadena).color + '44',
              }"
            >
              {{ obtenerCadenaInfo(d.cadena).tipo === 'independiente' ? 'Boticario de barrio' : d.cadena }}
            </span>
            <span class="badge-barrio">{{ d.barrio }}</span>
            <span v-if="d.es24h" class="badge-tag tag-24h">24H</span>
            <span v-if="d.afiliada" class="badge-tag tag-afiliada">Verificada</span>
          </div>
          <span v-if="d.distanciaKm !== undefined" class="drog-distancia">
            A {{ formatearDistancia(d.distanciaKm) }}
          </span>
        </div>

        <h3 class="drog-title">{{ d.nombre }}</h3>
        <p class="drog-direccion">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{{ d.direccion }}</span>
        </p>

        <div class="drog-meta">
          <div class="meta-item">
            <span class="meta-label">Horario:</span>
            <span class="meta-value">{{ d.horario }}</span>
          </div>
          <div v-if="d.telefono" class="meta-item">
            <span class="meta-label">Teléfono:</span>
            <a :href="`tel:${d.telefono.replace(/[^0-9]/g, '')}`" class="meta-link">
              {{ d.telefono }}
            </a>
          </div>
        </div>

        <div class="drog-actions">
          <a
            :href="generarLinkWhatsApp(d)"
            target="_blank"
            rel="noopener"
            class="drog-btn drog-btn--wa"
            aria-label="Pedir medicamentos por WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.12c-.24.68-1.2 1.34-1.8 1.4-.48.06-1.1.09-3.55-.92-3.13-1.3-5.15-4.47-5.3-4.68-.16-.21-1.28-1.7-1.28-3.25 0-1.54.81-2.3 1.1-2.6.28-.31.62-.39.82-.39.21 0 .42 0 .61.01.2.01.47-.08.73.55.27.65.91 2.22.99 2.38.08.16.14.36.03.57-.11.21-.16.34-.33.54-.16.2-.34.45-.49.6-.16.16-.33.34-.14.67.19.32.84 1.38 1.8 2.24 1.23 1.1 2.27 1.44 2.59 1.6.32.16.51.14.7-.08.19-.22.81-.94 1.03-1.27.22-.32.43-.27.73-.16.3.11 1.9.9 2.23 1.06.32.16.54.24.62.38.08.14.08.82-.16 1.5z" />
            </svg>
            Pedir a Domicilio
          </a>

          <a
            :href="generarLinkMaps(d)"
            target="_blank"
            rel="noopener"
            class="drog-btn drog-btn--maps"
            aria-label="Cómo llegar en Google Maps"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Cómo llegar
          </a>
        </div>
      </article>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <h3>No encontramos droguerías con esos filtros</h3>
      <p>Prueba buscando en otro barrio o quitando los filtros rápidos.</p>
      <AppButton variant="secondary" @click="barrioSeleccionado = 'Todos los barrios'; cadenaSeleccionada = 'Todas las marcas'; busqueda = ''; solo24h = false; soloDomicilio = false; soloAfiliadas = false;">
        Restablecer filtros
      </AppButton>
    </div>

    </section>

  <section v-if="!props.embebido" class="section reveal">
      <!-- Sección de Afiliación / Suscripción para Droguerías -->
      <div class="affiliate-copy">
        <span class="affiliate-tag">Para Droguerías y Farmacias</span>
        <h2>¿Tienes una droguería en Villavicencio?</h2>
        <p>
          Únete a la red FarmApp. Destaca tu farmacia ante miles de personas en tu barrio,
          publica tus precios competitivos y recibe pedidos directos a tu WhatsApp oficial.
        </p>
      </div>
      <div class="affiliate-cta">
        <RouterLink to="/contactos">
          <AppButton size="lg">Afiliar mi droguería</AppButton>
        </RouterLink>
      </div>
  </section>
</template>

<style scoped>
.section.reveal {
  margin-top: 6px;
}

.filter-card {
  padding: 20px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--bg-1);
  border: 1px solid var(--line);
  border-bottom: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-heading-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-heading h2 {
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  margin: 0;
  color: var(--ink);
}

.panel-heading .map-badge {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(31, 107, 79, 0.12);
  border: 1px solid rgba(31, 107, 79, 0.3);
  color: var(--verde-texto);
}

.filter-top {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr 1.2fr auto auto;
  gap: 12px;
  align-items: center;
}

.brand-wrap,
.neighborhood-wrap {
  width: 100%;
}

.custom-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

[data-theme="light"] .custom-select {
  background: #ffffff;
  color: #0b1220;
  border-color: rgba(15, 23, 42, 0.16);
}

.gps-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  white-space: nowrap;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
}

.gps-btn:hover {
  background: var(--nav-hover-bg);
  border-color: var(--blue-bright);
}

.gps-btn.active {
  background: rgba(10, 132, 255, 0.2);
  border-color: var(--blue);
  color: var(--blue-bright);
}

.map-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
}

.map-toggle-btn:hover {
  background: var(--nav-hover-bg);
  border-color: var(--blue-bright);
}

.map-toggle-btn.active {
  background: rgba(10, 132, 255, 0.16);
  border-color: var(--blue);
  color: var(--blue-bright);
}

.gps-btn.loading {
  opacity: 0.7;
  cursor: wait;
}

.gps-alert {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 149, 0, 0.12);
  color: #ff9f0a;
  border: 1px solid rgba(255, 149, 0, 0.3);
  font-size: 0.88rem;
}

.precision-alert {
  color: var(--verde-deep);
  background: rgba(216, 154, 43, 0.1);
  border-color: rgba(216, 154, 43, 0.35);
}

.chip-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 6px;
  border-top: 1px solid var(--line-soft);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--blue-bright);
  color: var(--ink);
}

.chip.active {
  background: var(--nav-active-bg);
  border-color: var(--blue);
  color: var(--ink);
  font-weight: 600;
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-24h { background: var(--verde); }
.dot-delivery { background: var(--azul); }
.dot-afiliada { background: var(--ambar); }

.results-count {
  margin-left: auto;
  font-size: 0.86rem;
  color: var(--muted);
}

/* Cuadrícula de Droguerías */
.droguerias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.drog-card {
  padding: 22px;
  border-radius: 16px;
  background: var(--bg-1);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), border-color 0.2s;
}

.drog-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(31, 107, 79, 0.4);
}

.drog-card--highlight {
  border-color: var(--verde) !important;
  box-shadow: 0 0 0 2px rgba(31, 107, 79, 0.18), var(--shadow-md) !important;
  transform: translateY(-4px) !important;
}

.drog-card--featured {
  border-color: rgba(31, 107, 79, 0.28);
  background: var(--bg-1);
}

.drog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.drog-badge-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.badge-brand {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-barrio {
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--line-soft);
  color: var(--muted);
}

.badge-tag {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.tag-24h {
  background: rgba(48, 209, 88, 0.15);
  color: var(--verde-texto);
  border: 1px solid rgba(48, 209, 88, 0.3);
}

.tag-afiliada {
  background: rgba(216, 154, 43, 0.16);
  color: #8a5c0a;
  border: 1px solid rgba(216, 154, 43, 0.4);
}

.drog-distancia {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--verde-deep);
  background: rgba(31, 107, 79, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.drog-title {
  font-size: 1.16rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.25;
}

.drog-direccion {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--ink-soft);
}

.drog-direccion svg {
  flex-shrink: 0;
  color: var(--muted);
}

.drog-meta {
  padding: 12px;
  border-radius: 10px;
  background: var(--bg-2);
  border: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

[data-theme="light"] .drog-meta {
  background: rgba(15, 23, 42, 0.03);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.84rem;
}

.meta-label {
  color: var(--muted);
}

.meta-value {
  color: var(--ink);
  font-weight: 500;
}

.meta-link {
  color: var(--blue-bright);
  font-weight: 600;
  text-decoration: underline;
}

.drog-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
  padding-top: 8px;
}

.drog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: transform 0.2s var(--spring), opacity 0.2s;
  text-align: center;
}

.drog-btn:hover {
  transform: translateY(-1px);
}

.drog-btn--wa {
  background: #25d366;
  color: #06210f;
  box-shadow: 0 4px 14px -3px rgba(37, 211, 102, 0.5);
}

.drog-btn--maps {
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink);
}

.drog-btn--maps:hover {
  background: var(--glass-control-bg-hover);
  border-color: var(--blue-bright);
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  border-radius: var(--radius-lg);
  background: var(--glass);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Banner de Afiliación */
.affiliate-banner {
  margin-top: 48px;
  padding: clamp(28px, 4vw, 42px);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(26, 140, 255, 0.16) 0%, rgba(90, 200, 250, 0.08) 100%), var(--glass);
  border: 1px solid rgba(26, 140, 255, 0.3);
  box-shadow: var(--shadow-md), var(--inset);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.affiliate-copy {
  max-width: 64ch;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.affiliate-tag {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--aqua);
}

.affiliate-copy h2 {
  font-size: 1.5rem;
  color: var(--ink);
}

.affiliate-copy p {
  font-size: 0.95rem;
  color: var(--ink-soft);
  line-height: 1.5;
}

@media (max-width: 1080px) {
  .filter-top {
    grid-template-columns: 1fr 1fr;
  }
  .search-wrap {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .filter-top {
    grid-template-columns: 1fr;
  }
  .search-wrap {
    grid-column: auto;
  }
  .results-count {
    margin-left: 0;
    width: 100%;
  }
  .panel-heading {
    gap: 8px;
  }
  .panel-heading h2 {
    font-size: 1.05rem;
  }
  .panel-heading .map-toggle-btn {
    min-height: 36px;
    padding: 0 10px;
    font-size: 0.78rem;
  }
  .filter-card {
    padding: 14px;
    gap: 12px;
  }
  .chip-row {
    gap: 6px;
  }
  .chip {
    padding: 6px 10px;
    font-size: 0.74rem;
  }
}
</style>
