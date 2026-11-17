<script setup lang="ts">
import AppCard from '../components/ui/AppCard.vue';
import HeroPanel from '../components/layout/HeroPanel.vue';

type Empresa = { nombre: string; descripcion: string; color: string; sigla: string };
const empresas: Empresa[] = [
  { nombre: 'CódigoX', descripcion: 'Soluciones tecnológicas para un mundo digital.', color: '#0a84ff', sigla: 'CX' },
  { nombre: 'Skin Glow', descripcion: 'Cuidado y belleza para tu piel.', color: '#b06be0', sigla: 'SG' },
  { nombre: 'Alkanail', descripcion: 'Accesorios y productos exclusivos para uñas.', color: '#2b6ea8', sigla: 'AL' },
  { nombre: 'Inversiones D & T', descripcion: 'Creando oportunidades para todos.', color: '#8e9aab', sigla: 'ID' },
  { nombre: 'VYG Naturals', descripcion: 'Conecta con la naturaleza en cada producto.', color: '#111', sigla: 'VG' },
  { nombre: 'Erosfera', descripcion: 'Bienestar y equilibrio para tu cuerpo y mente.', color: '#b05a1e', sigla: 'ER' },
];
</script>

<template>
  <HeroPanel title="Feria empresarial" description="Conoce a las empresas que hacen parte de nuestro ecosistema de salud y bienestar." />
  <h2 class="section-title">Nuestras empresas</h2>
  <div class="grid">
    <AppCard v-for="e in empresas" :key="e.nombre" class="empresa">
      <div class="logo" :style="{ background: e.color }">{{ e.sigla }}</div>
      <h3>{{ e.nombre }}</h3>
      <p>{{ e.descripcion }}</p>
    </AppCard>
  </div>
</template>

<style scoped>
.empresa { text-align: center; }
.logo { width: 100%; height: 150px; display: grid; place-items: center; border-radius: 16px; color: #fff; font-size: 2.4rem; font-weight: 700; margin-bottom: 16px; }
h3 { font-size: 1.1rem; margin-bottom: 8px; }
p { font-size: .9rem; }
</style>
