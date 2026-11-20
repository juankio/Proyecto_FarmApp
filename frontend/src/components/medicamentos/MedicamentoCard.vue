<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import AppButton from '../ui/AppButton.vue';
import type { Medicamento } from '../../types/catalogo';
import { obtenerComparativa } from '../../data/comparador_precios';
import { formatPrecioCop } from '../../utils/format';

const props = defineProps<{ medicamento: Medicamento }>();
const emit = defineEmits<{ (e: 'open', medicamento: Medicamento): void }>();

const info = computed(() => obtenerComparativa(props.medicamento.nombre));

function dosis(m: Medicamento): string {
  return [m.presentacion, m.concentracion].filter(Boolean).join(' · ');
}

function consulta(m: Medicamento) {
  const laboratorio = m.laboratorio === 'Genérico' ? '' : ` de ${m.laboratorio}`;
  return {
    path: '/contactos',
    query: {
      asunto: `Consulta sobre ${m.nombre}`,
      mensaje: `Hola, quiero consultar por ${m.nombre} (${dosis(m)})${laboratorio} en Villavicencio. ¿Me pueden orientar?`,
    },
  };
}
</script>

<template>
  <article class="med-card">
    <div class="med-top">
      <span class="med-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M10.6 3.4a5 5 0 0 1 7.1 7.1l-7.2 7.1a5 5 0 0 1-7.1-7.1l7.2-7.1Z" stroke-linecap="round" />
          <path d="m6.9 6.9 7.2 7.2" stroke-linecap="round" />
        </svg>
      </span>
      <div class="med-top-tags">
        <span
          class="med-rx-badge"
          :class="info.requiereReceta ? 'rx-receta' : 'rx-libre'"
        >
          {{ info.requiereReceta ? 'Bajo Receta' : 'Venta Libre' }}
        </span>
        <span class="med-lab">{{ medicamento.laboratorio }}</span>
      </div>
    </div>

    <h3>{{ medicamento.nombre }}</h3>
    <p class="med-dose">{{ dosis(medicamento) }}</p>
    <p class="med-desc">{{ medicamento.descripcion ?? 'Sin descripción registrada.' }}</p>

    <!-- Caja de Comparativa Rápida en Villavicencio -->
    <div class="med-price-preview">
      <div class="price-copy">
        <span class="price-label">Mejor precio en Villavicencio:</span>
        <strong class="price-value">{{ formatPrecioCop(info.mejorPrecio) }}</strong>
      </div>
      <span class="price-stores-count">
        {{ info.ofertas.length }} droguerías
      </span>
    </div>

    <div class="med-actions">
      <button type="button" class="med-link" @click="emit('open', medicamento)">
        Comparar precios <span aria-hidden="true">→</span>
      </button>
      <RouterLink :to="consulta(medicamento)">
        <AppButton size="sm" variant="secondary">Consultar</AppButton>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.med-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: var(--radius-md);
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-sm);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  backdrop-filter: blur(22px) saturate(180%);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.med-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--inset), var(--shadow-md);
}

.med-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.med-top-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.med-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.16), rgba(126, 224, 192, 0.24));
  border: 1px solid var(--line);
  color: var(--aqua);
}

.med-icon svg {
  width: 22px;
  height: 22px;
}

.med-rx-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.rx-libre {
  background: rgba(48, 209, 88, 0.14);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.3);
}

.rx-receta {
  background: rgba(255, 69, 58, 0.14);
  color: #ff453a;
  border: 1px solid rgba(255, 69, 58, 0.3);
}

.med-lab {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--line-soft);
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.med-card h3 {
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.med-dose {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--aqua);
}

.med-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 8px;
  font-size: 0.86rem;
  color: var(--ink-soft);
  line-height: 1.45;
}

.med-price-preview {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(10, 132, 255, 0.08);
  border: 1px solid rgba(10, 132, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.price-copy {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.price-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink);
}

.price-stores-count {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--ink);
}

.med-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
}

.med-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--blue-deep);
  font-family: var(--font);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.med-link span {
  display: inline-block;
  transition: transform 0.2s var(--ease);
}

.med-link:hover span {
  transform: translateX(3px);
}

[data-theme="light"] .med-lab {
  background: rgba(15, 23, 42, 0.05);
  border-color: rgba(15, 23, 42, 0.08);
}

[data-theme="light"] .med-icon {
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.12), rgba(5, 150, 105, 0.14));
  border-color: rgba(10, 132, 255, 0.15);
  color: #0284c7;
}

[data-theme="light"] .med-price-preview {
  background: rgba(10, 132, 255, 0.06);
  border-color: rgba(10, 132, 255, 0.14);
}

[data-theme="light"] .price-stores-count {
  background: rgba(15, 23, 42, 0.06);
}
</style>
