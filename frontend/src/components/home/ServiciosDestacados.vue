<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SectionHeader from '../ui/SectionHeader.vue';
import ServiceCard from '../ui/ServiceCard.vue';
import AppButton from '../ui/AppButton.vue';
import { services } from '../../data/services';
</script>

<template>
  <section class="section reveal">
    <SectionHeader
      eyebrow="Servicios"
      title="Todo lo que puedes hacer en FarmApp"
      lede="Herramientas pensadas para pacientes, droguerías y profesionales de la salud."
    />
    <div class="grid grid-3">
      <ServiceCard v-for="s in services" :key="s.title" v-bind="s" />
    </div>
    <div class="row center more-row">
      <RouterLink to="/servicios">
        <AppButton variant="secondary">Ver todos los servicios</AppButton>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.more-row {
  margin-top: 26px;
}
</style>
