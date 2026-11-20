<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import AppSurface from '../ui/AppSurface.vue';
import AppStat from '../ui/AppStat.vue';
import { useMedicamentosStore } from '@/stores/medicamentos';

const medicamentos = useMedicamentosStore();

onMounted(() => {
  medicamentos.fetchList({ page: 1, limit: 1 }).catch(() => {});
});

const stats = computed<
  { valor: string; label: string; tone: 'blue' | 'mint' | 'aqua' | 'lavender' }[]
>(() => [
  { valor: `${medicamentos.total || '12'}+`, label: 'Medicamentos analizados', tone: 'blue' },
  { valor: '85+', label: 'Droguerías en Villavicencio', tone: 'mint' },
  { valor: '24H', label: 'Farmacias de turno', tone: 'aqua' },
  { valor: '100%', label: 'Gratis para la comunidad', tone: 'lavender' },
]);
</script>

<template>
  <AppSurface tone="glass" radius="var(--radius-lg)" class="welcome">
    <div class="welcome-copy">
      <span class="eyebrow">Salud y ahorro inteligente</span>
      <h2>Compara precios y ubica farmacias en Villavicencio</h2>
      <p>
        En FarmApp facilitamos el acceso a medicamentos comparando precios entre droguerías locales de Villavicencio.
        Consulta disponibilidad inmediata, verifica requisitos de fórmula médica y contacta a la farmacia más cercana a tu barrio.
      </p>
      <RouterLink to="/ubicaciones" class="inline-link">Ver droguerías en el mapa →</RouterLink>
    </div>
    <div class="stats">
      <AppStat
        v-for="s in stats"
        :key="s.label"
        :value="s.valor"
        :label="s.label"
        :tone="s.tone"
      />
    </div>
  </AppSurface>
</template>

<style scoped>
.welcome {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(24px, 4vw, 48px);
  padding: clamp(28px, 4vw, 52px);
  margin-top: clamp(32px, 4vw, 52px);
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.welcome-copy h2 {
  max-width: 22ch;
}

.inline-link {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--aqua);
}

.inline-link:hover {
  text-decoration: underline;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: center;
}

@media (max-width: 900px) {
  .welcome {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>