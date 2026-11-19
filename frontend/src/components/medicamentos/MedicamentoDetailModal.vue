<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppModal from '../ui/AppModal.vue';
import AppButton from '../ui/AppButton.vue';
import { site } from '../../data/site';
import type { Medicamento } from '../../types/catalogo';

const props = defineProps<{ medicamento: Medicamento | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

function dosis(m: Medicamento): string {
  return [m.presentacion, m.concentracion].filter(Boolean).join(' · ');
}

function consulta(m: Medicamento) {
  const laboratorio = m.laboratorio === 'Genérico' ? '' : ` de ${m.laboratorio}`;
  return {
    path: '/contactos',
    query: {
      asunto: `Consulta sobre ${m.nombre}`,
      mensaje: `Hola, quiero consultar por ${m.nombre} (${dosis(m)})${laboratorio}. ¿Me pueden orientar?`,
    },
  };
}
</script>

<template>
  <AppModal
    :open="Boolean(medicamento)"
    :title="medicamento?.nombre ?? ''"
    close-variant="secondary"
    @close="emit('close')"
  >
    <div v-if="medicamento" class="detalle">
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
      <div class="detalle-actions">
        <RouterLink :to="consulta(medicamento)">
          <AppButton block>Consultar disponibilidad</AppButton>
        </RouterLink>
        <a :href="site.redes.whatsapp" target="_blank" rel="noopener">
          <AppButton variant="secondary" block>Escribir por WhatsApp</AppButton>
        </a>
      </div>
      <p class="detalle-note">
        FarmApp no vende medicamentos: te orientamos y te conectamos con los canales de atención.
      </p>
    </div>
  </AppModal>
</template>

<style scoped>
.detalle-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.detalle-facts div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(10, 132, 255, 0.06);
  border: 1px solid rgba(10, 132, 255, 0.1);
}
.detalle-facts span {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.detalle-facts strong {
  font-size: 0.82rem;
  color: var(--ink);
}
.detalle-desc {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--ink-soft);
}
.detalle-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.detalle-actions :deep(.app-button) {
  width: 100%;
}
.detalle-note {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
  font-size: 0.76rem;
  line-height: 1.55;
  color: var(--muted);
}
@media (max-width: 620px) {
  .detalle-facts {
    grid-template-columns: 1fr;
  }
}
</style>
