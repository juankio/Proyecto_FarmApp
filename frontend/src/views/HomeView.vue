<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import MapHeroHub from '../components/home/MapHeroHub.vue';

const ComparadorPreciosVisual = defineAsyncComponent(
  () => import('../components/home/ComparadorPreciosVisual.vue'),
);
const ComoFuncionaSection = defineAsyncComponent(
  () => import('../components/home/ComoFuncionaSection.vue'),
);
const DirectorioMarcasSection = defineAsyncComponent(
  () => import('../components/home/DirectorioMarcasSection.vue'),
);
const SaludInfoSection = defineAsyncComponent(
  () => import('../components/home/SaludInfoSection.vue'),
);
const CanvaSection = defineAsyncComponent(
  () => import('../components/home/CanvaSection.vue'),
);
const FaqSection = defineAsyncComponent(
  () => import('../components/home/FaqSection.vue'),
);
</script>

<template>
  <div class="home-map-first-page">
    <!-- 1. Hub Principal: Mapa Interactivo de Villavicencio + Radar de Precios y Distancias -->
    <MapHeroHub />

    <!-- 2. Comparador Visual de Precios: Imágenes reales, fichas y barras gráficas SVG -->
    <ComparadorPreciosVisual />

    <!-- 3. Cómo Funciona en 3 Pasos con Ilustraciones SVG Artesanales -->
    <ComoFuncionaSection />

    <!-- 4. Directorio de Marcas y Boticarios Tradicionales de Barrio -->
    <DirectorioMarcasSection />

    <!-- 5. Guía de Salud Responsable, INVIMA y Urgencias Médicas -->
    <SaludInfoSection />

    <!-- 6. Afiliación para Droguerías y Farmacias Locales -->
    <CanvaSection />

    <!-- 7. Preguntas Frecuentes -->
    <FaqSection />
  </div>
</template>

<style scoped>
.home-map-first-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
</style>
