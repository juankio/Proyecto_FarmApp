<script setup lang="ts">
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
</script>

<template>
  <HeroPanel title="Sobre FarmApp" description="Conoce más sobre nosotros y nuestro propósito." />
  <AppCard>
    <h2>Misión</h2>
    <p>Facilitar el acceso a información confiable sobre medicamentos para que cada persona tome decisiones informadas sobre su salud.</p>
    <h2>Visión</h2>
    <p>Ser la plataforma de referencia en información farmacéutica en Latinoamérica.</p>
  </AppCard>
</template>
