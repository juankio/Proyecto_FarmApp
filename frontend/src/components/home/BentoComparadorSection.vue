<script setup lang="ts">
import { computed, ref } from 'vue';
import SectionHeader from '../ui/SectionHeader.vue';
import ProductoIcono from '../ui/ProductoIcono.vue';
import { COMPARATIVA_MEDICAMENTOS, InfoComparativa } from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';

const seleccionadoKey = ref<string>('Acetaminofén');

const MEDICAMENTOS_POPULARES = [
  { key: 'Acetaminofén', nombre: 'Acetaminofén 500 mg', dosis: 'Caja x 100 tab · MK / Genfar', rx: false },
  { key: 'Ibuprofeno', nombre: 'Ibuprofeno 400 mg', dosis: 'Caja x 50 cáps · Laproff', rx: false },
  { key: 'Amoxicilina', nombre: 'Amoxicilina 500 mg', dosis: 'Caja x 50 cáps · Genfar', rx: true },
  { key: 'Loratadina', nombre: 'Loratadina 10 mg', dosis: 'Caja x 20 tab · Lafrancol', rx: false },
  { key: 'Metformina', nombre: 'Metformina 850 mg', dosis: 'Caja x 30 tab · La Santé', rx: true },
  { key: 'Omeprazol', nombre: 'Omeprazol 20 mg', dosis: 'Caja x 30 cáps · Farmandina', rx: false },
  { key: 'Losartán', nombre: 'Losartán 50 mg', dosis: 'Caja x 30 tab · MK', rx: true },
];

const medSeleccionado = computed(() => {
  return MEDICAMENTOS_POPULARES.find((m) => m.key === seleccionadoKey.value) ?? MEDICAMENTOS_POPULARES[0];
});

const infoComparativa = computed<InfoComparativa>(() => {
  return COMPARATIVA_MEDICAMENTOS[seleccionadoKey.value] ?? COMPARATIVA_MEDICAMENTOS['Acetaminofén'];
});

const ahorroCalculado = computed(() => {
  const max = Math.max(...infoComparativa.value.ofertas.map((o) => o.precio));
  const min = infoComparativa.value.mejorPrecio;
  const pct = max > min ? Math.round(((max - min) / max) * 100) : 25;
  const pesos = max - min;
  return { pct, pesos };
});

function calcularBarraWidth(precio: number): number {
  const min = infoComparativa.value.mejorPrecio;
  const max = Math.max(...infoComparativa.value.ofertas.map((o) => o.precio));
  if (max === min) return 100;
  return Math.round(55 + ((precio - min) / (max - min)) * 45);
}

function linkWhatsApp(nombre: string, wa: string, precio: number): string {
  const med = medSeleccionado.value.nombre;
  const msg = encodeURIComponent(
    `Hola ${nombre}, los vi en la Comparativa FarmApp Villavicencio y deseo cotizar ${med} a ${formatPrecioCop(precio)}.`,
  );
  return `https://wa.me/${wa}?text=${msg}`;
}
</script>

<template>
  <section class="bento-section section reveal">
    <SectionHeader
      eyebrow="Transparencia farmacéutica"
      title="Compara precios en Villavicencio antes de comprar"
      lede="El mismo principio activo puede variar miles de pesos entre droguerías a pocas cuadras de distancia. Consulta la comparativa real y ahorra con inteligencia."
    />

    <!-- Matriz Bento Grid (Estilo Apple / Linear) -->
    <div class="bento-grid">
      <!-- BENTO 1: Gran Tarjeta Principal de Comparativa de Precios (Ocupa 2 columnas) -->
      <div class="bento-card bento-hero">
        <div class="bento-head">
          <div class="bento-head-title">
            <span class="bento-tag">Índice de Precios en Vivo</span>
            <h3 class="bento-title">Comparativa de Medicamentos Frecuentes</h3>
          </div>
          <div class="savings-pill-highlight">
            Ahorro de hasta <strong>{{ ahorroCalculado.pct }}%</strong>
          </div>
        </div>

        <!-- Chips limpios para cambiar de medicamento -->
        <div class="med-chips-row">
          <button
            v-for="item in MEDICAMENTOS_POPULARES"
            :key="item.key"
            type="button"
            class="med-chip-btn"
            :class="{ active: seleccionadoKey === item.key }"
            @click="seleccionadoKey = item.key"
          >
            {{ item.key }}
          </button>
        </div>

        <!-- Cuerpo del comparador: Ficha del producto y Gráfico de Precios -->
        <div class="comparison-stage">
          <!-- Columna Ficha Técnica -->
          <div class="med-dossier">
            <div class="med-thumb-box">
              <ProductoIcono :nombre="medSeleccionado.nombre" :presentacion="medSeleccionado.dosis" />
            </div>
            <div class="med-dossier-info">
              <span class="rx-pill" :class="medSeleccionado.rx ? 'rx--required' : 'rx--free'">
                {{ medSeleccionado.rx ? 'Requiere fórmula médica' : 'Venta libre sin receta' }}
              </span>
              <h4 class="med-dossier-name">{{ medSeleccionado.nombre }}</h4>
              <p class="med-dossier-dosis">{{ medSeleccionado.dosis }}</p>
              <div class="price-win-box">
                <span class="win-label">Mejor precio encontrado</span>
                <span class="win-val">{{ formatPrecioCop(infoComparativa.mejorPrecio) }}</span>
                <small class="win-save">Ahorras hasta {{ formatPrecioCop(ahorroCalculado.pesos) }} por unidad</small>
              </div>
            </div>
          </div>

          <!-- Columna Gráfica de Barras de Precios por Farmacia -->
          <div class="bars-dossier">
            <div class="bars-label-row">
              <span>Farmacia y Ubicación</span>
              <span>Precio Cotizado</span>
            </div>

            <div class="bars-list">
              <div
                v-for="(of, idx) in infoComparativa.ofertas"
                :key="of.drogueriaId"
                class="bar-item-row"
                :class="{ 'bar--winner': idx === 0 }"
              >
                <div class="bar-meta-col">
                  <div class="bar-name-row">
                    <span class="bar-idx">#{{ idx + 1 }}</span>
                    <strong class="bar-pharm-name">{{ of.drogueriaNombre }}</strong>
                  </div>
                  <span class="bar-dir">{{ of.barrio }}</span>
                </div>

                <div class="bar-visual-col">
                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      :class="idx === 0 ? 'fill--winner' : 'fill--regular'"
                      :style="{ width: calcularBarraWidth(of.precio) + '%' }"
                    />
                  </div>
                </div>

                <div class="bar-price-col">
                  <span class="bar-price-num">{{ formatPrecioCop(of.precio) }}</span>
                  <a
                    :href="linkWhatsApp(of.drogueriaNombre, of.whatsapp, of.precio)"
                    target="_blank"
                    rel="noopener"
                    class="bar-pedir-link"
                    title="Pedir a esta farmacia"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BENTO 2: Fórmulas e INVIMA -->
      <div class="bento-card bento-rx">
        <div class="bento-icon-pill icon--amber">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span class="bento-sub">Normativa Sanitaria</span>
        <h3 class="bento-title">Fórmula Médica e INVIMA</h3>
        <p class="bento-desc">
          Antibióticos, antihipertensivos y medicamentos de control especial requieren prescripción original firmada con fecha vigente.
        </p>
        <ul class="bento-checklist">
          <li>✓ Nunca compres antibióticos sin receta</li>
          <li>✓ Consulta siempre con el regente de farmacia</li>
          <li>✓ Verifica el número de registro sanitario INVIMA</li>
        </ul>
      </div>

      <!-- BENTO 3: Cadena de Frío en Villavicencio -->
      <div class="bento-card bento-clima">
        <div class="bento-icon-pill icon--cyan">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
        </div>
        <span class="bento-sub">Clima Cálido (28°C - 34°C)</span>
        <h3 class="bento-title">Cadena de Frío Llanera</h3>
        <p class="bento-desc">
          Insulinas, vacunas y colirios deben mantenerse estrictamente entre 2°C y 8°C. Exige gel refrigerante para traslados y no los dejes dentro del vehículo.
        </p>
      </div>

      <!-- BENTO 4: Boticarios de Barrio y Bioequivalencia -->
      <div class="bento-card bento-boticario">
        <div class="bento-icon-pill icon--purple">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 4.24 4.24" />
            <path d="m14.83 9.17 4.24-4.24" />
            <path d="m14.83 14.83 4.24 4.24" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <span class="bento-sub">Ahorro y Comercio Local</span>
        <h3 class="bento-title">Boticarios y Genéricos</h3>
        <p class="bento-desc">
          Los genéricos bioequivalentes (MK, Genfar, Laproff) contienen la misma molécula activa que las marcas comerciales, costando hasta un 60% menos en la droguería de tu barrio.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento-section {
  position: relative;
  padding: 40px 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.bento-card {
  min-width: 0;
}

.bento-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm), var(--inset);
  transition-property: transform, border-color, box-shadow;
  transition-duration: 200ms;
}

.bento-card:hover {
  transform: translateY(-2px);
  border-color: var(--blue-bright);
}

/* Bento 1: Ocupa 2 columnas */
.bento-hero {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bento-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.bento-tag {
  font-size: 0.72rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--aqua);
  letter-spacing: 0.05em;
}

.bento-title {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-top: 4px;
  text-wrap: balance;
}

.savings-pill-highlight {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(31, 107, 79, 0.12);
  color: var(--verde-texto);
  border: 1px solid rgba(48, 209, 88, 0.35);
  font-size: 0.82rem;
  font-weight: 700;
}

/* Chips de Medicamentos */
.med-chips-row {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.med-chip-btn {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
}

.med-chip-btn:hover {
  background: var(--line-soft);
  color: var(--ink);
}

.med-chip-btn.active {
  background: rgba(31, 107, 79, 0.16);
  color: var(--verde-texto);
  border-color: var(--verde);
  font-weight: 750;
}

/* Escenario de Comparación Dividido */
.comparison-stage {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 24px;
  align-items: center;
  padding-top: 10px;
}

.med-dossier {
  display: flex;
  align-items: center;
  gap: 16px;
}

.med-thumb-box {
  width: 90px;
  height: 90px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.med-thumb-img {
  max-width: 65px;
  max-height: 65px;
  object-fit: contain;
  outline: 1px solid rgba(255, 255, 255, 0.1);
  outline-offset: -1px;
  border-radius: 8px;
}

.med-dossier-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rx-pill {
  font-size: 0.7rem;
  font-weight: 750;
  padding: 2px 7px;
  border-radius: 5px;
  display: inline-block;
  align-self: flex-start;
}

.rx--free {
  background: rgba(31, 107, 79, 0.14);
  color: var(--verde-texto);
}

.rx--required {
  background: rgba(192, 90, 50, 0.12);
  color: #ff9f0a;
}

.med-dossier-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink);
  margin: 0;
}

.med-dossier-dosis {
  font-size: 0.78rem;
  color: var(--muted);
  margin: 0;
}

.price-win-box {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
}

.win-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--verde-texto);
}

.win-val {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--verde-texto);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.win-save {
  font-size: 0.72rem;
  color: var(--ink-soft);
}

/* Columna de Barras */
.bars-dossier {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bars-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0 4px;
}

.bars-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-item-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--glass);
  border: 1px solid var(--line-soft);
  transition: border-color 0.15s;
}

.bar-item-row:hover {
  border-color: var(--blue-bright);
}

.bar--winner {
  border-color: rgba(48, 209, 88, 0.4);
  background: rgba(48, 209, 88, 0.06);
}

.bar-meta-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.bar-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bar-idx {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--muted);
}

.bar--winner .bar-idx {
  color: var(--verde-texto);
}

.bar-pharm-name {
  font-size: 0.82rem;
  font-weight: 750;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-dir {
  font-size: 0.72rem;
  color: var(--muted);
}

.bar-visual-col {
  width: 100%;
}

.bar-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--line-soft);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease-out;
}

.fill--winner {
  background: linear-gradient(90deg, var(--verde), var(--verde-bright));
}

.fill--regular {
  background: linear-gradient(90deg, var(--verde), var(--verde-bright));
}

.bar-price-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-price-num {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.bar--winner .bar-price-num {
  color: var(--verde-texto);
}

.bar-pedir-link {
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--verde-texto);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Tarjetas Bento Secundarias */
.bento-icon-pill {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

.icon--amber {
  background: rgba(255, 149, 0, 0.14);
  color: #ff9f0a;
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.icon--cyan {
  background: rgba(31, 107, 79, 0.1);
  color: var(--aqua);
  border: 1px solid rgba(90, 200, 250, 0.3);
}

.icon--purple {
  background: rgba(216, 154, 43, 0.12);
  color: var(--lavender);
  border: 1px solid rgba(185, 168, 255, 0.3);
}

.bento-sub {
  font-size: 0.72rem;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.bento-desc {
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.5;
  margin: 8px 0 0;
  text-wrap: pretty;
}

.bento-checklist {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--line-soft);
  padding-top: 12px;
}

.bento-checklist li {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-soft);
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .bento-hero {
    grid-column: span 1;
  }
  .comparison-stage {
    grid-template-columns: minmax(0, 1fr);
  }
  .med-chips-row,
  .bars-label-row,
  .bento-head {
    flex-wrap: wrap;
  }
  .med-chips-row,
  .bars-dossier,
  .med-dossier {
    min-width: 0;
    overflow-x: auto;
  }
}
</style>
