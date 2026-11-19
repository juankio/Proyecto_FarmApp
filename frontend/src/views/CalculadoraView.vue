<script setup lang="ts">
import { computed, ref } from 'vue';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';

const expresion = ref('');
const historial = ref<string[]>([]);
const error = ref('');

const teclas = [
  ['C', '±', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

const pantalla = computed(() => expresion.value || '0');

function agregar(valor: string): void {
  error.value = '';
  if (valor === '=') return calcular();
  if (valor === 'C') {
    expresion.value = '';
    return;
  }
  if (valor === '⌫') {
    expresion.value = expresion.value.slice(0, -1);
    return;
  }
  if (valor === '±') {
    expresion.value = expresion.value.startsWith('-')
      ? expresion.value.slice(1)
      : expresion.value
        ? `-${expresion.value}`
        : '';
    return;
  }
  if (valor === '%') {
    expresion.value = `${expresion.value}/100`;
    return;
  }
  expresion.value += valor;
}

function calcular(): void {
  const limpia = expresion.value.trim();
  if (!limpia) return;
  if (!/^[0-9+\-*/.() ]+$/.test(limpia)) {
    error.value = 'Expresión no válida';
    return;
  }
  try {
    const resultado = Function(`"use strict"; return (${limpia})`)() as number;
    if (!Number.isFinite(resultado)) throw new Error('Resultado no finito');
    historial.value = [`${limpia} = ${resultado}`, ...historial.value].slice(0, 5);
    expresion.value = String(Number(resultado.toFixed(8)));
  } catch {
    error.value = 'Expresión no válida';
  }
}

function teclaFisica(event: KeyboardEvent): void {
  const k = event.key;
  if (/^[0-9+\-*/.%]$/.test(k)) {
    agregar(k);
    event.preventDefault();
  } else if (k === 'Enter') {
    calcular();
    event.preventDefault();
  } else if (k === 'Backspace') {
    agregar('⌫');
    event.preventDefault();
  } else if (k === 'Escape') {
    agregar('C');
    event.preventDefault();
  }
}
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
        <div class="display">
          <span class="expr">{{ pantalla }}</span>
          <span v-if="error" class="err">{{ error }}</span>
        </div>

        <div class="keys">
          <button
            v-for="tecla in teclas.flat()"
            :key="tecla"
            type="button"
            class="key"
            :class="{
              op: ['/', '*', '-', '+', '%'].includes(tecla),
              eq: tecla === '=',
            }"
            @click="agregar(tecla)"
          >
            {{ tecla }}
          </button>
        </div>
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

.display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 108px;
  padding: 18px;
  margin-bottom: 18px;
  border-radius: 18px;
  background:
    radial-gradient(120% 140% at 80% 0%, rgba(90, 200, 250, 0.22), transparent 60%),
    linear-gradient(160deg, rgba(10, 24, 46, 0.9), rgba(6, 12, 26, 0.92));
  border: 1px solid var(--line);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 18px 40px -24px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.expr {
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
  word-break: break-all;
  text-align: right;
  line-height: 1.15;
}

.err {
  font-size: 0.78rem;
  color: #ffb4b4;
  margin-top: 6px;
}

.keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.key {
  height: 58px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.07);
  color: var(--ink);
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  transition: transform 0.18s var(--spring), background 0.18s, border-color 0.18s, box-shadow 0.18s;
}

.key:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 12px 24px -14px rgba(0, 0, 0, 0.8);
}

.key:active {
  transform: scale(0.96);
}

.key.op {
  background: rgba(10, 132, 255, 0.16);
  border-color: rgba(90, 200, 250, 0.3);
  color: var(--aqua);
}

.key.eq {
  background: linear-gradient(150deg, #3d9bff, var(--blue-deep));
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 12px 26px -12px rgba(10, 132, 255, 0.8);
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
