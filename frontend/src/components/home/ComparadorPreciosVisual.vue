<script setup lang="ts">
import { computed, ref } from 'vue';
import { COMPARATIVA_MEDICAMENTOS, InfoComparativa } from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';
import AppButton from '../ui/AppButton.vue';

const seleccionadoKey = ref<string>('Acetaminofén');

// Lista enriquecida con imágenes e iconografía médica
export type MedicamentoCardItem = {
  key: string;
  nombre: string;
  dosis: string;
  categoria: string;
  imagen: string;
  requiereReceta: boolean;
  indicacion: string;
};

const MEDICAMENTOS_SHOWCASE: MedicamentoCardItem[] = [
  {
    key: 'Acetaminofén',
    nombre: 'Acetaminofén 500 mg',
    dosis: 'Caja x 100 tabletas · MK / Genfar',
    categoria: 'Analgésico y Antipirético',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/magnesium_t4bs8u.gif',
    requiereReceta: false,
    indicacion: 'Alivio del dolor de cabeza, dolor muscular y control de fiebre.',
  },
  {
    key: 'Ibuprofeno',
    nombre: 'Ibuprofeno 400 mg',
    dosis: 'Caja x 50 cápsulas blandas · Laproff',
    categoria: 'Antiinflamatorio no esteroideo (AINE)',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731664/medicina_tz4d0o.gif',
    requiereReceta: false,
    indicacion: 'Dolor dental, inflamación articular y molestias musculares.',
  },
  {
    key: 'Amoxicilina',
    nombre: 'Amoxicilina 500 mg',
    dosis: 'Caja x 50 cápsulas · Genfar',
    categoria: 'Antibiótico Betalactámico',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731667/ordenes_bzoct8.gif',
    requiereReceta: true,
    indicacion: 'Infecciones bacterianas respiratorias, oído y garganta. Requiere fórmula.',
  },
  {
    key: 'Loratadina',
    nombre: 'Loratadina 10 mg',
    dosis: 'Caja x 20 tabletas · Lafrancol',
    categoria: 'Antihistamínico antialérgico',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/magnesium_t4bs8u.gif',
    requiereReceta: false,
    indicacion: 'Control de rinitis alérgica, estornudos constantes y picazón en ojos.',
  },
  {
    key: 'Metformina',
    nombre: 'Metformina 850 mg',
    dosis: 'Caja x 30 tabletas · La Santé',
    categoria: 'Antidiabético Oral',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731664/medicina_tz4d0o.gif',
    requiereReceta: true,
    indicacion: 'Control glicémico en diabetes tipo 2 y resistencia a la insulina.',
  },
  {
    key: 'Omeprazol',
    nombre: 'Omeprazol 20 mg',
    dosis: 'Caja x 30 cápsulas · Farmandina',
    categoria: 'Protector gástrico (IBP)',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731667/ordenes_bzoct8.gif',
    requiereReceta: false,
    indicacion: 'Alivio de gastritis, reflujo ácido y prevención de úlceras.',
  },
  {
    key: 'Losartán',
    nombre: 'Losartán Potásico 50 mg',
    dosis: 'Caja x 30 tabletas · MK',
    categoria: 'Antihipertensivo (ARA II)',
    imagen: 'https://res.cloudinary.com/dc4vyurnu/image/upload/v1731731665/magnesium_t4bs8u.gif',
    requiereReceta: true,
    indicacion: 'Tratamiento de la hipertensión arterial y protección cardiovascular.',
  },
];

const medSeleccionado = computed<MedicamentoCardItem>(() => {
  return MEDICAMENTOS_SHOWCASE.find((m) => m.key === seleccionadoKey.value) ?? MEDICAMENTOS_SHOWCASE[0];
});

const infoComparativa = computed<InfoComparativa>(() => {
  return COMPARATIVA_MEDICAMENTOS[seleccionadoKey.value] ?? COMPARATIVA_MEDICAMENTOS['Acetaminofén'];
});

// Porcentaje de ahorro relativo entre la más cara y la más barata
const porcentajeAhorro = computed<number>(() => {
  const max = Math.max(...infoComparativa.value.ofertas.map((o) => o.precio));
  const min = infoComparativa.value.mejorPrecio;
  if (!max || max === min) return 20;
  return Math.round(((max - min) / max) * 100);
});

// Ahorro monetario en pesos colombianos
const ahorroMoneda = computed<number>(() => {
  const max = Math.max(...infoComparativa.value.ofertas.map((o) => o.precio));
  return max - infoComparativa.value.mejorPrecio;
});

function calcularBarraPct(precio: number): number {
  const min = infoComparativa.value.mejorPrecio;
  const max = Math.max(...infoComparativa.value.ofertas.map((o) => o.precio));
  if (max === min) return 100;
  return Math.round(55 + ((precio - min) / (max - min)) * 45);
}

function generarEnlaceWhatsApp(drogNombre: string, whatsapp: string, precio: number): string {
  const med = medSeleccionado.value.nombre;
  const texto = encodeURIComponent(
    `Hola ${drogNombre}, los vi en la Comparativa de Precios FarmApp Villavicencio y deseo consultar si tienen disponible ${med} a ${formatPrecioCop(precio)}.`,
  );
  return `https://wa.me/${whatsapp}?text=${texto}`;
}
</script>

<template>
  <section class="comparador-section section reveal">
    <div class="section-badge-center">
      <span class="pill-glow">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        Transparencia de Precios en Villavicencio
      </span>
      <h2 class="section-title">Compara antes de comprar y ahorra hasta un 45%</h2>
      <p class="section-subtitle">
        El mismo principio activo puede variar miles de pesos entre droguerías a pocas cuadras de distancia.
        Mira la diferencia real en Villavicencio:
      </p>
    </div>

    <!-- Pestañas Visuales de Medicamentos Frecuentes -->
    <div class="med-tabs-scroll">
      <button
        v-for="item in MEDICAMENTOS_SHOWCASE"
        :key="item.key"
        type="button"
        class="med-tab-card"
        :class="{ active: seleccionadoKey === item.key }"
        @click="seleccionadoKey = item.key"
      >
        <img :src="item.imagen" :alt="item.nombre" class="tab-img" loading="lazy" />
        <div class="tab-copy">
          <span class="tab-name">{{ item.key }}</span>
          <span class="tab-sub">{{ item.dosis.split('·')[0] }}</span>
        </div>
      </button>
    </div>

    <!-- Tarjeta Principal de Análisis Comparativo (Split Image + Gráfico SVG) -->
    <div class="comparativa-dashboard">
      <!-- Columna Izquierda: Ficha Técnica e Imagen del Producto -->
      <div class="prod-profile-card">
        <div class="prod-image-wrapper">
          <img :src="medSeleccionado.imagen" :alt="medSeleccionado.nombre" class="prod-large-img" />
          <div class="prod-glow" />
        </div>

        <div class="prod-content">
          <div class="prod-status-tags">
            <span
              class="receta-tag"
              :class="medSeleccionado.requiereReceta ? 'tag-rx' : 'tag-otc'"
            >
              {{ medSeleccionado.requiereReceta ? '⚠️ Requiere Fórmula Médica' : '✅ Venta Libre sin Receta' }}
            </span>
            <span class="cat-pill">{{ medSeleccionado.categoria }}</span>
          </div>

          <h3 class="prod-title">{{ medSeleccionado.nombre }}</h3>
          <p class="prod-dosis">{{ medSeleccionado.dosis }}</p>
          <p class="prod-desc">{{ medSeleccionado.indicacion }}</p>

          <!-- Banner de Ahorro Destacado -->
          <div class="savings-callout">
            <div class="callout-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#30d158" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div class="callout-text">
              <span class="callout-title">Ahorro en Villavicencio</span>
              <span class="callout-val">
                Hasta {{ formatPrecioCop(ahorroMoneda) }} ({{ porcentajeAhorro }}% menos)
              </span>
              <small class="callout-sub">Comparando entre boticarios de barrio y grandes cadenas.</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Gráfico Comparativo SVG y Ranking de Farmacias -->
      <div class="ranking-chart-card">
        <div class="chart-header">
          <div>
            <h4 class="chart-title">Ranking de Precios por Farmacia</h4>
            <p class="chart-sub">Valores cotizados en sedes de Villavicencio</p>
          </div>
          <div class="chart-legend">
            <span class="legend-badge-best">🏆 Menor Precio</span>
          </div>
        </div>

        <!-- Barras Comparativas de Precios (SVG + CSS Dinámico) -->
        <div class="bars-container">
          <div
            v-for="(oferta, idx) in infoComparativa.ofertas"
            :key="oferta.drogueriaId"
            class="price-row-item"
            :class="{ 'row--winner': idx === 0 }"
          >
            <div class="row-header">
              <div class="drog-info-col">
                <span class="rank-pos">#{{ idx + 1 }}</span>
                <div>
                  <strong class="drog-name">{{ oferta.drogueriaNombre }}</strong>
                  <span class="drog-barrio">📍 {{ oferta.barrio }} · {{ oferta.direccion }}</span>
                </div>
              </div>

              <div class="price-val-col">
                <span class="price-figure">{{ formatPrecioCop(oferta.precio) }}</span>
                <span v-if="idx === 0" class="badge-tag-winner">¡Mejor Precio!</span>
              </div>
            </div>

            <!-- Barra gráfica de porcentaje visual -->
            <div class="bar-visual-track">
              <div
                class="bar-visual-fill"
                :class="idx === 0 ? 'fill-winner' : 'fill-regular'"
                :style="{ width: calcularBarraPct(oferta.precio) + '%' }"
              />
            </div>

            <div class="row-footer-actions">
              <span class="avail-indicator">
                <span class="dot-green" /> Disponible en inventario
              </span>
              <a
                :href="generarEnlaceWhatsApp(oferta.drogueriaNombre, oferta.whatsapp, oferta.precio)"
                target="_blank"
                rel="noopener"
                class="btn-pedir-wa"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2" />
                </svg>
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.comparador-section {
  position: relative;
  padding: 48px 0;
}

.section-badge-center {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pill-glow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(10, 132, 255, 0.12);
  color: var(--blue-bright);
  border: 1px solid rgba(10, 132, 255, 0.28);
}

.section-title {
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 850;
  letter-spacing: -0.035em;
  color: var(--ink);
  line-height: 1.18;
}

.section-subtitle {
  font-size: 1.02rem;
  color: var(--muted);
  line-height: 1.5;
}

/* Scroll horizontal de medicamentos */
.med-tabs-scroll {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 4px 20px;
  margin-bottom: 24px;
  scrollbar-width: thin;
}

.med-tab-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 16px;
  background: var(--glass);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.med-tab-card:hover {
  transform: translateY(-2px);
  border-color: var(--blue-bright);
  background: var(--nav-hover-bg);
}

.med-tab-card.active {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(0, 122, 255, 0.1));
  border-color: var(--blue);
  box-shadow: 0 0 18px rgba(10, 132, 255, 0.22);
}

.tab-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.1);
}

.tab-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tab-name {
  font-size: 0.92rem;
  font-weight: 750;
  color: var(--ink);
}

.tab-sub {
  font-size: 0.72rem;
  color: var(--muted);
}

/* Dashboard comparativo principal */
.comparativa-dashboard {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
  align-items: stretch;
}

.prod-profile-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md), var(--inset);
}

.prod-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line-soft);
  overflow: hidden;
}

.prod-large-img {
  max-width: 130px;
  max-height: 130px;
  object-fit: contain;
  z-index: 1;
  transition: transform 0.3s ease;
}

.prod-image-wrapper:hover .prod-large-img {
  transform: scale(1.08);
}

.prod-glow {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--blue-bright), transparent 70%);
  filter: blur(40px);
  opacity: 0.3;
}

.prod-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prod-status-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.receta-tag {
  font-size: 0.74rem;
  font-weight: 750;
  padding: 4px 10px;
  border-radius: 6px;
}

.tag-otc {
  background: rgba(48, 209, 88, 0.16);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.3);
}

.tag-rx {
  background: rgba(255, 149, 0, 0.16);
  color: #ff9f0a;
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.cat-pill {
  font-size: 0.74rem;
  font-weight: 600;
  background: var(--line-soft);
  color: var(--muted);
  padding: 4px 9px;
  border-radius: 6px;
}

.prod-title {
  font-size: 1.35rem;
  font-weight: 850;
  letter-spacing: -0.025em;
  color: var(--ink);
  line-height: 1.2;
}

.prod-dosis {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--aqua);
}

.prod-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.5;
}

/* Callout de Ahorro */
.savings-callout {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(48, 209, 88, 0.12), rgba(16, 185, 129, 0.05));
  border: 1px solid rgba(48, 209, 88, 0.3);
  margin-top: 8px;
}

.callout-icon {
  flex-shrink: 0;
  padding: 8px;
  border-radius: 10px;
  background: rgba(48, 209, 88, 0.18);
}

.callout-text {
  display: flex;
  flex-direction: column;
}

.callout-title {
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #30d158;
}

.callout-val {
  font-size: 1.15rem;
  font-weight: 850;
  color: #30d158;
  letter-spacing: -0.02em;
}

.callout-sub {
  font-size: 0.76rem;
  color: var(--ink-soft);
  margin-top: 2px;
}

/* Columna Derecha: Ranking y Barras */
.ranking-chart-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md), var(--inset);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line-soft);
  padding-bottom: 14px;
}

.chart-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: var(--ink);
}

.chart-sub {
  font-size: 0.8rem;
  color: var(--muted);
}

.legend-badge-best {
  font-size: 0.76rem;
  font-weight: 750;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(48, 209, 88, 0.15);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.35);
}

.bars-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-row-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 14px;
  background: var(--glass);
  border: 1px solid var(--line);
  transition: all 0.2s ease;
}

.price-row-item:hover {
  border-color: var(--blue-bright);
}

.row--winner {
  border-color: rgba(48, 209, 88, 0.45);
  background: linear-gradient(150deg, rgba(48, 209, 88, 0.08), var(--glass));
}

.row-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.drog-info-col {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.rank-pos {
  font-size: 0.82rem;
  font-weight: 850;
  color: var(--muted);
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--line-soft);
}

.row--winner .rank-pos {
  background: #30d158;
  color: #ffffff;
}

.drog-name {
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--ink);
  display: block;
}

.drog-barrio {
  font-size: 0.78rem;
  color: var(--muted);
}

.price-val-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-figure {
  font-size: 1.15rem;
  font-weight: 850;
  color: var(--ink);
}

.row--winner .price-figure {
  color: #30d158;
}

.badge-tag-winner {
  font-size: 0.65rem;
  font-weight: 800;
  color: #30d158;
  text-transform: uppercase;
}

/* Barra visual */
.bar-visual-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--line-soft);
  overflow: hidden;
}

.bar-visual-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fill-winner {
  background: linear-gradient(90deg, #30d158, #10b981);
}

.fill-regular {
  background: linear-gradient(90deg, var(--blue), var(--aqua));
}

.row-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--line-soft);
}

.avail-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--ink-soft);
}

.dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #30d158;
}

.btn-pedir-wa {
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
  transition: transform 0.15s ease;
}

.btn-pedir-wa:hover {
  transform: scale(1.04);
}

@media (max-width: 990px) {
  .comparativa-dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
