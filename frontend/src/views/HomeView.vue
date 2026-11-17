<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import { services } from '../data/services';
</script>

<template>
  <HeroPanel
    title="FarmApp"
    description="Facilitamos el acceso a la información sobre medicamentos para mejorar tu bienestar y experiencia en salud."
  >
    <AppButton @click="$router.push('/servicios')">Ver servicios</AppButton>
    <AppButton @click="$router.push('/registro')">Crear cuenta</AppButton>
  </HeroPanel>

  <h2 class="section-title">Conoce más de nuestros servicios</h2>
  <div class="grid">
    <ServiceCard v-for="s in services" :key="s.title" v-bind="s" />
  </div>

  <AppCard class="canva">
    <h2>Descubre nuestra presentación</h2>
    <p>Explora más sobre FarmApp a través de nuestra presentación interactiva en Canva.</p>
    <a href="https://farmapp.my.canva.site/presentacion-farmapp" target="_blank" rel="noopener">
      <AppButton>Ver presentación</AppButton>
    </a>
  </AppCard>
</template>

<style scoped>
.canva { margin-top: 36px; text-align: center; }
.canva h2 { font-size: 1.6rem; margin-bottom: 10px; }
.canva p { margin-bottom: 20px; }
</style>
