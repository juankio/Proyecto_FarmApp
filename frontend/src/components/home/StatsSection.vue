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
  { valor: String(medicamentos.total), label: 'Medicamentos', tone: 'blue' },
  { valor: '7', label: 'Empresas aliadas', tone: 'mint' },
  { valor: '7', label: 'Productos', tone: 'aqua' },
  { valor: '100%', label: 'Gratis', tone: 'lavender' },
]);
</script>

<template>
  <AppSurface tone="glass" radius="var(--radius-lg)" class="welcome">
    <div class="welcome-copy">
      <span class="eyebrow">Lea, aprenda y conozca más</span>
      <h2>Bienvenidos a nuestro aplicativo farmacéutico</h2>
      <p>
        En FarmApp, facilitamos el acceso a la información sobre medicamentos para mejorar tu
        bienestar y experiencia en salud. Nuestra plataforma ofrece una base de datos completa con
        información básica sobre medicamentos, ayudándote a tomar decisiones informadas en tu
        cuidado personal.
      </p>
      <RouterLink to="/informacion" class="inline-link">Conoce nuestro origen →</RouterLink>
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