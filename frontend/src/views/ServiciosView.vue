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
    title="Servicios para tu salud y ahorro en Villavicencio"
    lede="FarmApp compara precios de medicamentos entre droguerías locales, te muestra farmacias de turno 24 horas y conecta a las droguerías de barrio con la comunidad."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/ubicaciones')">Ver droguerías</AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/medicamentos')">
        Comparar medicamentos
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
        <h2>¿Tienes una droguería o farmacia en Villavicencio?</h2>
        <p>
          Únete a la red FarmApp: destaca tu farmacia en tu barrio, muestra tus precios competitivos
          y recibe pedidos directos a tu WhatsApp oficial de domicilios.
        </p>
      </div>
      <div class="cta-actions">
        <RouterLink to="/contactos"><AppButton variant="light">Afiliar mi droguería</AppButton></RouterLink>
        <RouterLink to="/ubicaciones"><AppButton variant="light">Ver droguerías</AppButton></RouterLink>
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
  color: var(--texto-panel);
}

.cta p {
  color: var(--texto-panel);
  opacity: 0.8;
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
