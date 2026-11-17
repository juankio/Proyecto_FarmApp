<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';

const route = useRoute();
const datos: Record<string, { titulo: string; descripcion: string }> = {
  1: { titulo: 'CódigoX', descripcion: 'Soluciones tecnológicas para un mundo digital.' },
  2: { titulo: 'Skin Glow', descripcion: 'Cuidado y belleza para tu piel.' },
  3: { titulo: 'Alkanail', descripcion: 'Accesorios y productos exclusivos para uñas.' },
  4: { titulo: 'Inversiones D & T', descripcion: 'Creando oportunidades para todos.' },
  5: { titulo: 'VYG Naturals', descripcion: 'Conecta con la naturaleza en cada producto.' },
  6: { titulo: 'Erosfera', descripcion: 'Bienestar y equilibrio para tu cuerpo y mente.' },
  7: { titulo: 'FarmApp', descripcion: 'Información farmacéutica al alcance de todos.' },
};
const proyecto = computed(() => datos[route.params.slug as string] ?? { titulo: 'Proyecto', descripcion: 'Conoce más sobre este proyecto.' });
</script>

<template>
  <HeroPanel :title="proyecto.titulo" :description="proyecto.descripcion" />
  <AppCard>
    <h2>Sobre el proyecto</h2>
    <p>{{ proyecto.descripcion }}</p>
  </AppCard>
</template>
