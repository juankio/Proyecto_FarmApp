<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import ProyectoDetalle from '../components/proyecto/ProyectoDetalle.vue';
import ProyectoGaleria from '../components/proyecto/ProyectoGaleria.vue';
import ProyectoNav from '../components/proyecto/ProyectoNav.vue';
import { useProyectosStore } from '../stores/proyectos';
import { optimizarCloudinary } from '../utils/imagen';

const route = useRoute();
const store = useProyectosStore();
const slug = computed(() => String(route.params.slug));
const proyecto = computed(() => store.getBySlug(slug.value));
const items = computed(() => store.items);
const indice = computed(() => items.value.findIndex((p) => p.slug === slug.value));
const anterior = computed(() =>
  items.value.length ? items.value[(indice.value - 1 + items.value.length) % items.value.length] : undefined,
);
const siguiente = computed(() =>
  items.value.length ? items.value[(indice.value + 1) % items.value.length] : undefined,
);
</script>

<template>
  <div v-if="proyecto" class="proyecto">
    <PageHero :eyebrow="`Stand ${proyecto.numero} · ${proyecto.empresa}`" :title="proyecto.producto" :lede="proyecto.descripcion">
      <template #actions>
        <RouterLink to="/feria"><AppButton variant="secondary">← Volver a la feria</AppButton></RouterLink>
        <a href="#galeria"><AppButton>Ver galería</AppButton></a>
      </template>
      <template #media>
        <div class="logo-stage">
          <div class="logo-glow" />
          <img :src="optimizarCloudinary(proyecto.logo, 400)" :alt="proyecto.producto" width="400" height="400" loading="lazy" decoding="async" />
          <span class="pill blue">{{ proyecto.empresa }}</span>
        </div>
      </template>
    </PageHero>

    <ProyectoDetalle :proyecto="proyecto" />
    <ProyectoGaleria :proyecto="proyecto" />
    <ProyectoNav v-if="anterior && siguiente" :anterior="anterior!" :siguiente="siguiente!" />
  </div>

  <AppCard v-else class="not-found">
    <h1>Proyecto no encontrado</h1>
    <p>El proyecto que buscas no existe o cambió de nombre.</p>
    <RouterLink to="/feria"><AppButton>Volver a la feria</AppButton></RouterLink>
  </AppCard>
</template>

<style scoped src="../styles/proyecto.view.css"></style>