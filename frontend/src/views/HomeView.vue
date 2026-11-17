<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
import { LOGO_URL } from '../data/logo';
import { servicios } from '../data/servicios';
import { productos } from '../data/productos';
</script>

<template>
  <HeroPanel
    title="FarmApp"
    description="Facilitamos el acceso a la información sobre medicamentos para mejorar tu bienestar y experiencia en salud."
  >
    <img class="hero-logo" :src="LOGO_URL" alt="FarmApp" />
    <div class="row">
      <AppButton @click="$router.push('/servicios')">Ver servicios</AppButton>
      <AppButton @click="$router.push('/registro')">Crear cuenta</AppButton>
    </div>
  </HeroPanel>

  <h2 class="section-title">Conoce más de nuestros servicios</h2>
  <div class="grid">
    <RouterLink v-for="s in servicios" :key="s.nombre" to="/servicios" class="item">
      <AppCard>
        <img :src="s.imagen" :alt="s.nombre" loading="lazy" />
        <h3>{{ s.nombre }}</h3>
      </AppCard>
    </RouterLink>
  </div>

  <h2 class="section-title">Nuestros productos</h2>
  <div class="grid">
    <AppCard v-for="p in productos" :key="p.nombre" class="producto">
      <img :src="p.imagen" :alt="p.nombre" loading="lazy" />
      <h3>{{ p.nombre }}</h3>
    </AppCard>
  </div>

  <AppCard class="canva">
    <h2>Descubre nuestra presentación</h2>
    <p>Explora más sobre FarmApp a través de nuestra presentación interactiva en Canva.</p>
    <a href="https://farmapp.my.canva.site/presentacion-farmapp" target="_blank" rel="noopener">
      <AppButton>Ver presentación</AppButton>
    </a>
  </AppCard>
</template>

<style scoped>
.hero-logo { width: 72px; height: 72px; object-fit: contain; margin-bottom: 8px; }
.row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.item, .producto { display: block; }
.item img, .producto img { width: 100%; height: 180px; object-fit: contain; border-radius: 16px; background: rgba(255,255,255,.5); }
.item h3, .producto h3 { font-size: 1.05rem; text-align: center; margin: 14px 0 0; }
.canva { margin-top: 36px; text-align: center; }
.canva h2 { font-size: 1.6rem; margin-bottom: 10px; }
.canva p { margin-bottom: 20px; }
</style>
