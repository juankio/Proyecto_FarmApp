<script setup lang="ts">
import AppCard from '../ui/AppCard.vue';
import AppAccordion from '../ui/AppAccordion.vue';
import SectionHeader from '../ui/SectionHeader.vue';
import { faq } from '../../data/faq';
</script>

<template>
  <section id="preguntas" class="section reveal">
    <SectionHeader
      eyebrow="Preguntas frecuentes"
      title="Resolvemos tus dudas"
      lede="Lo que más nos preguntan sobre FarmApp, el uso de la información y nuestras alianzas."
    />
    <div class="faq-grid">
      <AppCard v-for="grupo in faq" :key="grupo.titulo">
        <h3 class="faq-title">{{ grupo.titulo }}</h3>
        <AppAccordion :items="grupo.preguntas" />
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 22px;
  align-items: start;
}

.faq-title {
  font-size: 1.05rem;
  margin-bottom: 16px;
  color: var(--aqua);
}
</style>
