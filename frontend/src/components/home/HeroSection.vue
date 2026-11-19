<script setup lang="ts">
import { useRoute } from 'vue-router';
import PageHero from '../layout/PageHero.vue';
import AppButton from '../ui/AppButton.vue';
import HeroVisual from './HeroVisual.vue';

const route = useRoute();
</script>

<template>
  <PageHero
    eyebrow="Salud y bienestar"
    title="La información farmacéutica que necesitas, en un solo lugar."
    lede="Consulta medicamentos, ubica droguerías cercanas y descubre los productos de nuestra feria empresarial. Todo claro, rápido y sin costo."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/servicios')">
        Explorar servicios
      </AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/feria')">
        Ver la feria
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
