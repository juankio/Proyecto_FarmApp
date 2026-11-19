<script setup lang="ts">
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import CalculadoraDisplay from '../components/calculadora/CalculadoraDisplay.vue';
import CalculadoraTeclado from '../components/calculadora/CalculadoraTeclado.vue';
import { useCalculator } from '../composables/useCalculator';

const { pantalla, historial, error, teclas, agregar, teclaFisica } = useCalculator();
</script>

<template>
  <PageHero
    eyebrow="Herramienta"
    title="Calculadora FarmApp"
    lede="Una calculadora sencilla y rápida para tus operaciones diarias. Funciona con teclado y con botones."
    compact
    centered
  />

  <section class="section reveal">
    <div class="calc-wrap">
      <AppCard class="calc" @keydown="teclaFisica" tabindex="0">
        <CalculadoraDisplay :value="pantalla" :error="error" />
        <CalculadoraTeclado :teclas="teclas" @press="agregar" />
      </AppCard>

      <AppCard v-if="historial.length" class="history">
        <h3>Historial</h3>
        <ul>
          <li v-for="h in historial" :key="h">{{ h }}</li>
        </ul>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.calc-wrap {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 300px);
  gap: 22px;
  justify-content: center;
  align-items: start;
}

.calc {
  padding: 22px;
}

.calc:focus-visible {
  outline: 2px solid var(--blue-deep);
  outline-offset: 2px;
}

.history {
  padding: 24px;
}

.history h3 {
  font-size: 1rem;
  margin-bottom: 12px;
}

.history ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history li {
  font-size: 0.85rem;
  color: var(--ink-soft);
  padding: 9px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--line-soft);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 820px) {
  .calc-wrap {
    grid-template-columns: minmax(0, 420px);
  }
}
</style>