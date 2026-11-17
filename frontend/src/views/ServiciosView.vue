<script setup lang="ts">
import HeroPanel from '../components/layout/HeroPanel.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import { services } from '../data/services';
</script>

<template>
  <HeroPanel title="Servicios para tu salud" description="FarmApp ofrece una variedad de servicios diseñados para mejorar el acceso a la información médica." />
  <h2 class="section-title">Nuestros servicios</h2>
  <div class="grid">
    <ServiceCard v-for="s in services" :key="s.title" v-bind="s" />
  </div>
</template>
