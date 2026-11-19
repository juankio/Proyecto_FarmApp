<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import ImageTile from '../components/ui/ImageTile.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { cenacap } from '../data/cenacap';
</script>

<template>
  <PageHero
    eyebrow="10° Feria Empresarial"
    title="Cenacap"
    :lede="cenacap.descripcion"
  >
    <template #actions>
      <RouterLink to="/feria"><AppButton variant="secondary">← Volver a la feria</AppButton></RouterLink>
      <RouterLink to="/proyectos/codigox"><AppButton>Ver FarmApp</AppButton></RouterLink>
    </template>
  </PageHero>

  <section class="section reveal">
    <AppCard class="what">
      <SectionHeader
        eyebrow="La institución"
        title="¿Qué es Cenacap?"
        lede="El Instituto CENACAP fomenta el emprendimiento, conectando ideas con oportunidades. Impulsa proyectos innovadores para transformar ideas en negocios reales, con formación integral y conexiones estratégicas."
      />
    </AppCard>
  </section>

  <section class="section reveal">
    <SectionHeader eyebrow="Pilares" title="Lo que hace Cenacap" />
    <div class="grid grid-3">
      <ImageTile
        v-for="p in cenacap.pilares"
        :key="p.titulo"
        :src="p.imagen"
        :title="p.titulo"
        :text="p.texto"
        ratio="wide"
      />
    </div>
  </section>

  <section class="section reveal">
    <AppCard tone="dark" class="cta">
      <div>
        <h2>Visita la feria empresarial</h2>
        <p>Conoce las siete empresas y sus productos en nuestro apartado de la feria.</p>
      </div>
      <RouterLink to="/feria"><AppButton variant="light">Ir a la feria</AppButton></RouterLink>
    </AppCard>
  </section>
</template>

<style scoped>
.what {
  text-align: center;
}

.what :deep(.section-head) {
  margin-bottom: 0;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: clamp(28px, 4vw, 48px);
  border-radius: var(--radius-lg);
}

.cta h2 {
  color: var(--ink);
}

.cta p {
  color: var(--ink-soft);
  margin-top: 8px;
}

@media (max-width: 760px) {
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
