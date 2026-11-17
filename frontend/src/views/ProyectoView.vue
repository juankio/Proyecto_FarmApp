<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
import { empresas } from '../data/empresas';
import { productos } from '../data/productos';

const route = useRoute();
const index = computed(() => (Number(route.params.slug) || 1) - 1);
const empresa = computed(() => empresas[index.value] ?? empresas[0]);
const producto = computed(() => productos[index.value] ?? productos[0]);
</script>

<template>
  <HeroPanel :title="empresa.nombre" :description="empresa.descripcion" />
  <div class="grid">
    <AppCard>
      <img :src="empresa.imagen" :alt="empresa.nombre" />
      <h2>{{ empresa.nombre }}</h2>
      <p>{{ empresa.descripcion }}</p>
    </AppCard>
    <AppCard>
      <img :src="producto.imagen" :alt="producto.nombre" />
      <h2>{{ producto.nombre }}</h2>
      <p>Producto de nuestro ecosistema FarmApp.</p>
    </AppCard>
  </div>
</template>

<style scoped>
img { width: 100%; height: 260px; object-fit: cover; border-radius: 18px; margin-bottom: 16px; }
h2 { font-size: 1.3rem; margin-bottom: 8px; }
</style>
