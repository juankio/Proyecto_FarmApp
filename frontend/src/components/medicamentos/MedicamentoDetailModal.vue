<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import AppModal from '../ui/AppModal.vue';
import AppButton from '../ui/AppButton.vue';
import { useMedicamentosStore } from '../../stores/medicamentos';
import { OfertaDrogueria, obtenerComparativa } from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';

const store = useMedicamentosStore();
const medicamento = computed(() => store.seleccionado);

const emit = defineEmits<{ (e: 'close'): void }>();

const info = computed(() =>
  medicamento.value ? obtenerComparativa(medicamento.value.nombre) : null,
);

function dosis(m: NonNullable<typeof medicamento.value>): string {
  return [m.presentacion, m.concentracion].filter(Boolean).join(' · ');
}

function generarLinkWhatsAppDrogueria(oferta: OfertaDrogueria, medNombre: string): string {
  const texto = encodeURIComponent(
    `Hola ${oferta.drogueriaNombre}, los vi en FarmApp Villavicencio y deseo consultar disponibilidad del medicamento ${medNombre} (${formatPrecioCop(oferta.precio)}).`,
  );
  return `https://wa.me/${oferta.whatsapp}?text=${texto}`;
}
</script>

<template>
  <AppModal
    :open="Boolean(medicamento)"
    :title="medicamento?.nombre ?? ''"
    close-variant="secondary"
    @close="emit('close')"
  >
    <div v-if="medicamento && info" class="detalle">
      <!-- Indicador de Prescripción Médica -->
      <div
        class="alerta-receta"
        :class="info.requiereReceta ? 'alerta-receta--receta' : 'alerta-receta--libre'"
      >
        <span class="alerta-badge">
          {{ info.requiereReceta ? 'Bajo Fórmula Médica' : 'Venta Libre' }}
        </span>
        <p class="alerta-texto">
          {{
            info.requiereReceta
              ? 'Este medicamento requiere fórmula o receta médica certificada para su venta en cualquier droguería.'
              : 'Este medicamento es de venta libre. No requiere prescripción médica previa.'
          }}
        </p>
      </div>

      <!-- Ficha Técnica -->
      <div class="detalle-facts">
        <div>
          <span>Laboratorio</span>
          <strong>{{ medicamento.laboratorio }}</strong>
        </div>
        <div>
          <span>Presentación</span>
          <strong>{{ medicamento.presentacion }}</strong>
        </div>
        <div>
          <span>Concentración</span>
          <strong>{{ medicamento.concentracion ?? 'No registrada' }}</strong>
        </div>
      </div>

      <p class="detalle-desc">
        {{ medicamento.descripcion ?? 'Este medicamento aún no tiene descripción registrada.' }}
      </p>

      <!-- Comparador de Precios en Droguerías de Villavicencio -->
      <div class="comparador-section">
        <div class="comparador-header">
          <span class="comparador-title">Comparativa de Precios en Villavicencio</span>
          <span class="comparador-tag">Precios de referencia · confirma por WhatsApp</span>
        </div>

        <div class="ofertas-list">
          <div
            v-for="(oferta, idx) in info.ofertas"
            :key="oferta.drogueriaId"
            class="oferta-item"
            :class="{ 'oferta-item--mejor': idx === 0 }"
          >
            <div class="oferta-info">
              <div class="oferta-drog-row">
                <strong class="oferta-drog">{{ oferta.drogueriaNombre }}</strong>
                <span v-if="idx === 0" class="badge-mejor-precio">Mejor Precio</span>
              </div>
              <span class="oferta-barrio">{{ oferta.barrio }} • {{ oferta.direccion }}</span>
            </div>

            <div class="oferta-actions">
              <span class="oferta-precio">{{ formatPrecioCop(oferta.precio) }}</span>
              <a
                :href="generarLinkWhatsAppDrogueria(oferta, medicamento.nombre)"
                target="_blank"
                rel="noopener"
                class="btn-pedir-wa"
                title="Pedir a esta droguería por WhatsApp"
              >
                Pedir
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="detalle-actions">
        <RouterLink to="/ubicaciones" @click="emit('close')">
          <AppButton block variant="secondary">Ver droguerías cercanas en el mapa</AppButton>
        </RouterLink>
      </div>

      <p class="detalle-note">
        FarmApp no comercializa medicamentos: compara precios y te conecta directamente con droguerías autorizadas en Villavicencio.
      </p>
    </div>
  </AppModal>
</template>

<style scoped>
/* Alerta Receta */
.alerta-receta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 14px;
  margin-bottom: 16px;
}

.alerta-receta--libre {
  background: rgba(48, 209, 88, 0.1);
  border: 1px solid rgba(48, 209, 88, 0.25);
}

.alerta-receta--receta {
  background: rgba(255, 69, 58, 0.12);
  border: 1px solid rgba(255, 69, 58, 0.3);
}

.alerta-badge {
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  width: fit-content;
  padding: 3px 8px;
  border-radius: 6px;
}

.alerta-receta--libre .alerta-badge {
  background: rgba(48, 209, 88, 0.2);
  color: var(--verde-texto);
}

.alerta-receta--receta .alerta-badge {
  background: rgba(255, 69, 58, 0.2);
  color: #ff453a;
}

.alerta-texto {
  font-size: 0.84rem;
  color: var(--ink);
  line-height: 1.45;
}

/* Facts */
.detalle-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.detalle-facts div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(10, 132, 255, 0.06);
  border: 1px solid rgba(10, 132, 255, 0.12);
}

.detalle-facts span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.detalle-facts strong {
  font-size: 0.86rem;
  color: var(--ink);
}

.detalle-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ink-soft);
}

/* Comparador de Precios */
.comparador-section {
  margin-top: 18px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line-soft);
}

[data-theme="light"] .comparador-section {
  background: rgba(15, 23, 42, 0.03);
}

.comparador-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.comparador-title {
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink);
}

.comparador-tag {
  font-size: 0.72rem;
  color: var(--aqua);
  font-weight: 600;
}

.ofertas-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.oferta-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--glass-control-bg);
  border: 1px solid var(--line);
}

.oferta-item--mejor {
  border-color: rgba(48, 209, 88, 0.4);
  background: rgba(48, 209, 88, 0.06);
}

.oferta-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.oferta-drog-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.oferta-drog {
  font-size: 0.88rem;
  color: var(--ink);
}

.badge-mejor-precio {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: #30d158;
  color: #03050c;
}

.oferta-barrio {
  font-size: 0.76rem;
  color: var(--muted);
}

.oferta-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.oferta-precio {
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--ink);
}

.btn-pedir-wa {
  padding: 6px 12px;
  border-radius: 8px;
  background: #25d366;
  color: #06210f;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-pedir-wa:hover {
  transform: scale(1.05);
}

.detalle-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.detalle-actions :deep(.app-button) {
  width: 100%;
}

.detalle-note {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
  font-size: 0.74rem;
  line-height: 1.5;
  color: var(--muted);
}

@media (max-width: 620px) {
  .detalle-facts {
    grid-template-columns: 1fr;
  }
  .oferta-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .oferta-actions {
    width: 100%;
    justify-content: space-between;
    margin-top: 4px;
  }
}
</style>
