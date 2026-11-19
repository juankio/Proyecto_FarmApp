<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import HeroSection from '../components/home/HeroSection.vue';

const StatsSection = defineAsyncComponent(() => import('../components/home/StatsSection.vue'));
const AccesosRapidos = defineAsyncComponent(() => import('../components/home/AccesosRapidos.vue'));
const ServiciosDestacados = defineAsyncComponent(() => import('../components/home/ServiciosDestacados.vue'));
const FeriaEmpresarial = defineAsyncComponent(() => import('../components/home/FeriaEmpresarial.vue'));
const CanvaSection = defineAsyncComponent(() => import('../components/home/CanvaSection.vue'));
const FaqSection = defineAsyncComponent(() => import('../components/home/FaqSection.vue'));
</script>

<template>
  <HeroSection />
  <StatsSection />
  <AccesosRapidos />
  <ServiciosDestacados />
  <FeriaEmpresarial />
  <CanvaSection />
  <FaqSection />
</template>
