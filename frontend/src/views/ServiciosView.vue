<script setup lang="ts">
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import { services as serviciosIconos } from '../data/services';
import { servicios as serviciosFotos } from '../data/servicios';
</script>

<template>
  <HeroPanel title="Servicios para tu salud" description="FarmApp ofrece una variedad de servicios diseñados para mejorar el acceso a la información médica." />

  <h2 class="section-title">Lo que puedes hacer</h2>
  <div class="grid">
    <ServiceCard v-for="s in serviciosIconos" :key="s.title" v-bind="s" />
  </div>

  <h2 class="section-title">Nuestros servicios</h2>
  <div class="grid">
    <AppCard v-for="s in serviciosFotos" :key="s.nombre" class="foto">
      <img :src="s.imagen" :alt="s.nombre" loading="lazy" />
      <h3>{{ s.nombre }}</h3>
    </AppCard>
  </div>
</template>

<style scoped>
.foto { text-align: center; }
.foto img { width: 100%; height: 170px; object-fit: contain; border-radius: 16px; background: rgba(255,255,255,.5); }
.foto h3 { font-size: 1.05rem; margin-top: 14px; }
</style>
