<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { posts } from '../data/blog';
import { optimizarCloudinary } from '../utils/imagen';
</script>

<template>
  <PageHero
    eyebrow="Blog"
    title="Bienvenido a nuestro espacio de novedades"
    lede="Aquí te estaremos actualizando nuestros últimos avances, alianzas y todo lo que pasa detrás de FarmApp."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/feria')">Ver la feria</AppButton>
      <AppButton size="lg" variant="secondary" @click="$router.push('/encuesta')">
        Participar en la encuesta
      </AppButton>
    </template>
  </PageHero>

  <section class="section reveal">
    <SectionHeader eyebrow="Últimas entradas" title="Últimos avances" />
    <div class="grid grid-3">
      <AppCard v-for="(post, i) in posts" :key="post.titulo" hover class="post">
        <div class="thumb">
          <img :src="optimizarCloudinary(post.imagen, 600)" :alt="post.titulo" width="600" height="400" loading="lazy" decoding="async" />
        </div>
        <span class="pill blue">{{ post.categoria }}</span>
        <h3>{{ post.titulo }}</h3>
        <p>{{ post.extracto }}</p>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thumb {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.thumb img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.post h3 {
  font-size: 1.1rem;
}
</style>
