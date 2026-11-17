<script setup lang="ts">
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';

const articulos = [
  { titulo: 'Cómo leer un vademécum', extracto: 'Guía rápida para interpretar la información de un medicamento.' },
  { titulo: 'Droguerías cerca de ti', extracto: 'Consejos para encontrar farmacias y droguerías en tu zona.' },
  { titulo: 'Cuidado personal', extracto: 'Pequeños hábitos que mejoran tu bienestar diario.' },
];
</script>

<template>
  <HeroPanel title="Nuestro blog" description="Artículos y consejos sobre salud, medicamentos y bienestar." />
  <div class="grid">
    <AppCard v-for="a in articulos" :key="a.titulo">
      <h3>{{ a.titulo }}</h3>
      <p>{{ a.extracto }}</p>
    </AppCard>
  </div>
</template>
