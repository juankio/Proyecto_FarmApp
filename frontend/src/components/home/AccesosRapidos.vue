<script setup lang="ts">
import SectionHeader from '../ui/SectionHeader.vue';
import ImageTile from '../ui/ImageTile.vue';
import { accesos } from '../../data/site';
</script>

<template>
  <section class="section reveal">
    <SectionHeader
      eyebrow="Accesos rápidos"
      title="Conoce más de nuestros servicios"
      lede="Cuatro puertas de entrada a la información que necesitas, con nuestro catálogo y fuentes confiables."
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
</template>
