<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import HeroSection from '../components/home/HeroSection.vue';

const RadarMapaSection = defineAsyncComponent(
  () => import('../components/home/RadarMapaSection.vue'),
);
const BentoComparadorSection = defineAsyncComponent(
  () => import('../components/home/BentoComparadorSection.vue'),
);
const StatsSection = defineAsyncComponent(
  () => import('../components/home/StatsSection.vue'),
);
const DirectorioMarcasSection = defineAsyncComponent(
  () => import('../components/home/DirectorioMarcasSection.vue'),
);
const CanvaSection = defineAsyncComponent(
  () => import('../components/home/CanvaSection.vue'),
);
const FaqSection = defineAsyncComponent(
  () => import('../components/home/FaqSection.vue'),
);
</script>

<template>
  <div class="home-apple-airbnb-page">
    <!-- 1. Hero Limpio y Acogedor: Estilo Apple / Airbnb con Buscador Flotante y Logo 3D -->
    <HeroSection />

    <!-- 2. Radar Panorámico de Mapa de Villavicencio + Fila Limpia de Farmacias -->
    <RadarMapaSection />

    <!-- 3. Matriz Bento Grid: Comparativa de Precios, Ahorro, Recetas y Clima Llanero -->
    <BentoComparadorSection />

    <!-- 4. Estadísticas Clave de la Red Farmacéutica -->
    <StatsSection />

    <!-- 5. Directorio de Cadenas y Boticarios de Barrio -->
    <DirectorioMarcasSection />

    <!-- 6. Afiliación para Farmacias Locales -->
    <CanvaSection />

    <!-- 7. Preguntas Frecuentes -->
    <FaqSection />
  </div>
</template>

<style scoped>
.home-apple-airbnb-page {
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 5vw, 64px);
  width: 100%;
}
</style>
