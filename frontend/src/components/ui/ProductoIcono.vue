<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ nombre: string; presentacion: string }>();

const tipo = computed(() => {
  const texto = `${props.nombre} ${props.presentacion}`.toLowerCase();
  if (texto.includes('pañal') || texto.includes('panal')) return 'panal';
  if (texto.includes('toallita')) return 'toallita';
  if (texto.includes('tensiómetro') || texto.includes('termómetro') || texto.includes('dispositivo')) return 'dispositivo';
  if (texto.includes('spray') || texto.includes('descongestionante') || texto.includes('repelente')) return 'spray';
  if (texto.includes('gotas') || texto.includes('suero') || texto.includes('solución salina')) return 'gotas';
  if (texto.includes('jarabe') || texto.includes('frasco')) return 'frasco';
  if (texto.includes('tubo') || texto.includes('crema') || texto.includes('ungüento') || texto.includes('vaselina') || texto.includes('protector solar') || texto.includes('hidratante')) return 'tubo';
  if (texto.includes('polvo') || texto.includes('sobre') || texto.includes('leche de fórmula') || texto.includes('fórmula infantil')) return 'polvo';
  if (texto.includes('gasas') || texto.includes('algodón') || texto.includes('curitas') || texto.includes('vendas') || texto.includes('guantes')) return 'curacion';
  if (texto.includes('jabón') || texto.includes('shampoo') || texto.includes('acondicionador') || texto.includes('enjuague')) return 'higiene';
  if (texto.includes('cápsula')) return 'capsula';
  return 'tableta';
});
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" role="img" :aria-label="tipo">
    <g v-if="tipo === 'tableta'">
      <rect x="3" y="7" width="18" height="10" rx="5" />
      <path d="M12 7v10" />
    </g>
    <g v-else-if="tipo === 'capsula'">
      <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-25 12 12)" />
      <path d="M12 8.6 13.5 15.4" />
    </g>
    <g v-else-if="tipo === 'frasco'">
      <path d="M9 3h6M10 3v3H7v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h-3V3" />
      <path d="M7 11h10" />
    </g>
    <g v-else-if="tipo === 'gotas'">
      <path d="M12 3c2.5 3.5 5 6.7 5 10a5 5 0 0 1-10 0c0-3.3 2.5-6.5 5-10Z" />
      <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
    </g>
    <g v-else-if="tipo === 'tubo'">
      <path d="M8 4h8v16H8z" />
      <path d="M8 17h8M10 4V2h4v2" />
    </g>
    <g v-else-if="tipo === 'polvo'">
      <path d="M6 5h12l-1 15H7L6 5Z" />
      <path d="M6 9h12" />
    </g>
    <g v-else-if="tipo === 'spray'">
      <path d="M9 8h6v13H9zM10 8V5h4v3M14 5h4V3" />
      <path d="M18 3v2" />
    </g>
    <g v-else-if="tipo === 'panal'">
      <path d="M5 8h14l-1.5 12h-11L5 8Z" />
      <path d="M9 8V5h6v3" />
    </g>
    <g v-else-if="tipo === 'toallita'">
      <path d="M6 6h12v12H6z" />
      <path d="M9 9h6v6H9z" />
    </g>
    <g v-else-if="tipo === 'dispositivo'">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h5" />
    </g>
    <g v-else-if="tipo === 'curacion'">
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <path d="M9 8v8M12 8v8M15 8v8" />
    </g>
    <g v-else-if="tipo === 'higiene'">
      <path d="M8 8h8v13H8zM10 8V4h4v4M10 12h4" />
    </g>
    <g v-else>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
    </g>
  </svg>
</template>

<style scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
