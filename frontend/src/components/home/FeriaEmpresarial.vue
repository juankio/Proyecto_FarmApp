<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SectionHeader from '../ui/SectionHeader.vue';
import ImageTile from '../ui/ImageTile.vue';
import AppButton from '../ui/AppButton.vue';
import { proyectos } from '../../data/proyectos';

const destacados = proyectos.filter((p) => p.slug !== 'codigox').slice(0, 4);
</script>

<template>
  <section class="section reveal">
    <SectionHeader
      eyebrow="Feria empresarial"
      title="Productos de nuestras empresas aliadas"
      lede="Cada marca de la feria tiene su propio espacio, con su historia, misión y galería."
    />
    <div class="grid grid-4">
      <ImageTile
        v-for="p in destacados"
        :key="p.slug"
        :src="p.logo"
        :title="p.producto"
        :text="p.empresa"
        :badge="p.empresa"
        :to="`/proyectos/${p.slug}`"
        fit="contain"
        ratio="square"
      />
    </div>
    <div class="row center more-row">
      <RouterLink to="/feria">
        <AppButton variant="secondary">Ver las 7 empresas</AppButton>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.more-row {
  margin-top: 26px;
}
</style>
