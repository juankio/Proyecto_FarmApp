<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import ServiceCard from '../components/ui/ServiceCard.vue';
import ImageTile from '../components/ui/ImageTile.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { services } from '../data/services';
import { accesos } from '../data/site';
</script>

<template>
  <PageHero
    eyebrow="Servicios"
    title="Servicios para tu salud y beneficio"
    lede="FarmApp ofrece una variedad de servicios diseñados para mejorar el acceso a la información médica, desde el vademécum hasta la ubicación de droguerías."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/feria')">Ver la feria</AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/contactos')">
        Hablar con nosotros
      </AppButton>
    </template>
  </PageHero>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Qué ofrecemos"
      title="Conoce más de nuestros servicios"
      lede="Cinco capacidades que combinan información confiable, geolocalización y contacto directo."
    />
    <div class="grid grid-3">
      <ServiceCard v-for="s in services" :key="s.title" v-bind="s" />
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Accesos directos"
      title="Empieza por donde necesites"
      lede="Cada acceso te lleva a nuestro catálogo, a una fuente externa confiable o a nuestro equipo de soporte."
    />
    <div class="grid grid-4">
      <ImageTile
        v-for="a in accesos"
        :key="a.nombre"
        :src="a.imagen"
        :title="a.nombre"
        :text="a.descripcion"
        :to="a.to"
        :href="a.href"
        fit="contain"
        ratio="square"
      />
    </div>
  </section>

  <section class="section reveal">
    <AppCard tone="dark" class="cta">
      <div class="cta-copy">
        <h2>¿Tienes una droguería o una marca de cuidado personal?</h2>
        <p>
          Publica tus productos en la feria empresarial de FarmApp y llega a más personas. También
          puedes escribirnos para resolver dudas sobre medicamentos y órdenes médicas.
        </p>
      </div>
      <div class="cta-actions">
        <RouterLink to="/contactos"><AppButton variant="light">Escríbenos</AppButton></RouterLink>
        <RouterLink to="/feria"><AppButton variant="light">Ver empresas</AppButton></RouterLink>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: clamp(28px, 4vw, 48px);
  border-radius: var(--radius-lg);
}

.cta-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 62ch;
}

.cta h2 {
  color: var(--ink);
}

.cta p {
  color: var(--ink-soft);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 820px) {
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
