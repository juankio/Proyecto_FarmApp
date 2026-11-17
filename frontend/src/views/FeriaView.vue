<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';
import { empresas } from '../data/empresas';
import { productos } from '../data/productos';

const route = useRoute();
const router = useRouter();
const activa = computed(() => empresas.find((e) => e.nombre === route.query.empresa) ?? null);

function verEmpresa(nombre: string): void {
  void router.push({ path: '/feria', query: { empresa: nombre } });
}
</script>

<template>
  <HeroPanel title="Feria empresarial" description="Conoce a las empresas y productos que hacen parte de nuestro ecosistema de salud y bienestar." />

  <AppCard v-if="activa" class="detalle">
    <button class="cerrar" @click="router.push('/feria')">✕</button>
    <img :src="activa.imagen" :alt="activa.nombre" />
    <div>
      <h2>{{ activa.nombre }}</h2>
      <p>{{ activa.descripcion }}</p>
    </div>
  </AppCard>

  <h2 class="section-title">Nuestras empresas</h2>
  <div class="grid">
    <AppCard v-for="e in empresas" :key="e.nombre" class="empresa" @click="verEmpresa(e.nombre)">
      <img :src="e.imagen" :alt="e.nombre" loading="lazy" />
      <h3>{{ e.nombre }}</h3>
      <p>{{ e.descripcion }}</p>
    </AppCard>
  </div>

  <h2 class="section-title">Nuestros productos</h2>
  <div class="grid">
    <AppCard v-for="p in productos" :key="p.nombre" class="producto">
      <img :src="p.imagen" :alt="p.nombre" loading="lazy" />
      <h3>{{ p.nombre }}</h3>
    </AppCard>
  </div>
</template>

<style scoped>
.empresa, .producto { cursor: pointer; transition: transform .25s, box-shadow .25s; }
.empresa:hover, .producto:hover { transform: translateY(-4px); box-shadow: var(--inset), 0 34px 70px rgba(9,62,98,.22); }
.empresa img, .producto img { width: 100%; height: 180px; object-fit: cover; border-radius: 16px; margin-bottom: 14px; }
h3 { font-size: 1.1rem; margin: 0 0 8px; }
p { font-size: .9rem; }
.detalle { display: flex; gap: 24px; align-items: center; margin-bottom: 28px; position: relative; }
.detalle img { width: 180px; height: 180px; object-fit: cover; border-radius: 18px; }
.detalle h2 { font-size: 1.6rem; margin-bottom: 8px; }
.cerrar { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border: 0; border-radius: 50%; background: rgba(255,255,255,.7); cursor: pointer; }
</style>
