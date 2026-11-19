<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import ProyectoGaleria from '../components/proyecto/ProyectoGaleria.vue';
import ProyectoNav from '../components/proyecto/ProyectoNav.vue';
import { buscarProyecto, proyectos } from '../data/proyectos';
import { optimizarCloudinary } from '../utils/imagen';

const route = useRoute();
const proyecto = computed(() => buscarProyecto(String(route.params.slug)));
const indice = computed(() =>
  proyectos.findIndex((p) => p.slug === String(route.params.slug)),
);
const anterior = computed(
  () => proyectos[(indice.value - 1 + proyectos.length) % proyectos.length],
);
const siguiente = computed(() => proyectos[(indice.value + 1) % proyectos.length]);
</script>

<template>
  <div v-if="proyecto" class="proyecto">
    <PageHero
      :eyebrow="`Stand ${proyecto.numero} · ${proyecto.empresa}`"
      :title="proyecto.producto"
      :lede="proyecto.descripcion"
    >
      <template #actions>
        <RouterLink to="/feria">
          <AppButton variant="secondary">← Volver a la feria</AppButton>
        </RouterLink>
        <a href="#galeria">
          <AppButton>Ver galería</AppButton>
        </a>
      </template>

      <template #media>
        <div class="logo-stage">
          <div class="logo-glow" />
          <img :src="optimizarCloudinary(proyecto.logo, 400)" :alt="proyecto.producto" />
          <span class="pill blue">{{ proyecto.empresa }}</span>
        </div>
      </template>
    </PageHero>

    <section class="section reveal">
      <AppCard class="intro">
        <p>{{ proyecto.intro }}</p>
      </AppCard>
    </section>

    <section v-if="proyecto.precios?.length" class="section reveal">
      <SectionHeader eyebrow="Precios" title="Precios y promociones" />
      <div class="grid grid-3">
        <AppCard v-for="precio in proyecto.precios" :key="precio.etiqueta" class="price">
          <span class="price-label">{{ precio.etiqueta }}</span>
          <strong>{{ precio.valor }}</strong>
          <p v-if="precio.nota">{{ precio.nota }}</p>
        </AppCard>
      </div>
    </section>

    <section v-if="proyecto.objetivo || proyecto.sirve" class="section reveal">
      <SectionHeader eyebrow="Ficha del producto" title="Objetivo y beneficios" />
      <div class="grid grid-2">
        <AppCard v-if="proyecto.objetivo">
          <span class="mini-title">Objetivo</span>
          <p>{{ proyecto.objetivo }}</p>
        </AppCard>
        <AppCard v-if="proyecto.sirve">
          <span class="mini-title">Sirve para</span>
          <p>{{ proyecto.sirve }}</p>
        </AppCard>
      </div>
    </section>

    <section v-if="proyecto.ingredientes.length" class="section reveal">
      <SectionHeader
        eyebrow="Fórmula"
        title="Ingredientes"
        lede="Manejamos ingredientes seleccionados para cada producto."
      />
      <AppCard>
        <ul class="chips">
          <li v-for="ing in proyecto.ingredientes" :key="ing">{{ ing }}</li>
        </ul>
      </AppCard>
    </section>

    <section v-if="proyecto.variantes?.length" class="section reveal">
      <SectionHeader
        eyebrow="Para cada tipo de cabello"
        title="Elige tu variante"
        lede="Selene se adapta al cabello crespo, liso y ondulado."
      />
      <div class="grid grid-3">
        <AppCard v-for="v in proyecto.variantes" :key="v.nombre" class="variant">
          <img :src="optimizarCloudinary(v.imagen, 600)" :alt="v.nombre" loading="lazy" decoding="async" />
          <h3>{{ v.nombre }}</h3>
          <p>{{ v.texto }}</p>
        </AppCard>
      </div>
    </section>

    <section class="section reveal">
      <SectionHeader eyebrow="La empresa" title="Misión y visión" />
      <div class="grid grid-2">
        <AppCard tone="dark">
          <span class="mini-title light">Misión</span>
          <p class="light-text">{{ proyecto.mision }}</p>
        </AppCard>
        <AppCard tone="dark">
          <span class="mini-title light">Visión</span>
          <p class="light-text">{{ proyecto.vision }}</p>
        </AppCard>
      </div>
    </section>

    <ProyectoGaleria :proyecto="proyecto" />

    <ProyectoNav :anterior="anterior" :siguiente="siguiente" />
  </div>

  <AppCard v-else class="not-found">
    <h1>Proyecto no encontrado</h1>
    <p>El proyecto que buscas no existe o cambió de nombre.</p>
    <RouterLink to="/feria"><AppButton>Volver a la feria</AppButton></RouterLink>
  </AppCard>
</template>

<style scoped src="../styles/proyecto.view.css"></style>
