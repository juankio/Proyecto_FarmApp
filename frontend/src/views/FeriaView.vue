<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import ImageTile from '../components/ui/ImageTile.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { proyectos } from '../data/proyectos';
import { cenacap } from '../data/cenacap';

const empresas = proyectos.map((p) => ({
  ...p,
  tile: p.empresaImagen,
}));
</script>

<template>
  <PageHero
    eyebrow="Feria empresarial"
    title="Nuestras empresas y sus productos"
    lede="Aprenda y conozca más sobre nosotros, con nuestras ideas donde tendremos variedades de productos con gran accesibilidad de compra."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/info-cenacap')">
        Conocer Cenacap
      </AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/servicios')">
        Ver servicios
      </AppButton>
    </template>
  </PageHero>

  <section class="section reveal">
    <AppCard class="intro">
      <p>
        En este apartado podrás encontrar una lista completa de todos los stands disponibles,
        organizada de manera clara y sencilla. Cada stand está identificado por su número
        correspondiente, lo que te permitirá ubicarlos fácilmente dentro del evento.
      </p>
    </AppCard>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Stands"
      title="Nuestras empresas"
      lede="Siete marcas, cada una con su propio producto, historia y galería."
    />
    <div class="grid grid-3">
      <ImageTile
        v-for="e in empresas"
        :key="e.slug"
        :src="e.tile"
        :title="e.empresa"
        :text="e.descripcion"
        :badge="`Stand ${e.numero}`"
        :to="`/proyectos/${e.slug}`"
        ratio="wide"
      />
    </div>
  </section>

  <section class="section reveal">
    <SectionHeader
      eyebrow="Catálogo"
      title="Nuestros productos"
      lede="Los productos que las empresas presentan en la feria, con acceso directo a su ficha."
    />
    <div class="grid grid-4">
      <ImageTile
        v-for="p in proyectos"
        :key="p.slug"
        :src="p.logo"
        :title="p.producto"
        :text="p.empresa"
        :to="`/proyectos/${p.slug}`"
        fit="contain"
        ratio="square"
      />
    </div>
  </section>

  <section class="section reveal">
    <div class="cenacap glass">
      <div>
        <span class="eyebrow">Invitados</span>
        <h2>{{ cenacap.titulo }}</h2>
        <p>{{ cenacap.descripcion }}</p>
      </div>
      <RouterLink to="/info-cenacap">
        <AppButton variant="secondary">Ver información de Cenacap</AppButton>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.intro {
  text-align: center;
  font-size: 1rem;
}

.cenacap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  padding: clamp(26px, 4vw, 44px);
  border-radius: var(--radius-lg);
  background: var(--glass-strong);
}

.cenacap h2 {
  margin: 8px 0 6px;
}

@media (max-width: 760px) {
  .cenacap {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
