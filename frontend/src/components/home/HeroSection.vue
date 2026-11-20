<script setup lang="ts">
import { useRoute } from 'vue-router';
import PageHero from '../layout/PageHero.vue';
import AppButton from '../ui/AppButton.vue';
import HeroVisual from './HeroVisual.vue';

const route = useRoute();
</script>

<template>
  <PageHero
    eyebrow="Salud y Ahorro en Villavicencio"
    title="Encuentra tus medicamentos al mejor precio y más cerca de ti."
    lede="Compara precios entre droguerías de Villavicencio, consulta disponibilidad inmediata, verifica si requieren receta médica y localiza la farmacia más cercana a tu barrio."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/medicamentos')">
        Buscar medicamentos
      </AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/ubicaciones')">
        Droguerías en Villavicencio
      </AppButton>
    </template>

    <template #media>
      <HeroVisual />
    </template>
  </PageHero>

  <div v-if="route.query.denied" class="denied form-message error">
    No tienes permisos para acceder al panel de administración.
  </div>
</template>

<style scoped>
.denied {
  margin-top: 16px;
}
</style>
