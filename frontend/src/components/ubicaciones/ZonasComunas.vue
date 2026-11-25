<script setup lang="ts">
import { computed } from 'vue';
import type { Drogueria } from '../../data/droguerias';
import { COMUNAS } from '../../data/comunas';

const props = defineProps<{ droguerias: Drogueria[]; activa: number | null; vertical?: boolean }>();
const emit = defineEmits<{ (e: 'select', id: number | null): void }>();

const totales = computed(() => {
  const mapa = new Map<number, number>();
  props.droguerias.forEach((d) => mapa.set(d.comuna, (mapa.get(d.comuna) ?? 0) + 1));
  return mapa;
});

function seleccionar(id: number): void {
  emit('select', props.activa === id ? null : id);
}
</script>

<template>
  <div class="zonas-barra" :class="{ vertical }">
    <span class="zonas-label">Zonas</span>
    <div class="zonas-lista">
      <button
        v-for="comuna in COMUNAS"
        :key="comuna.id"
        type="button"
        class="zona"
        :class="{ activa: activa === comuna.id, vacia: (totales.get(comuna.id) ?? 0) === 0 }"
        :style="{ '--zona-color': comuna.color }"
        :title="`Comuna ${comuna.id} · ${comuna.nombre} · ${totales.get(comuna.id) ?? 0} droguerías`"
        :aria-label="`Comuna ${comuna.id}, ${comuna.nombre}, ${totales.get(comuna.id) ?? 0} droguerías`"
        :aria-pressed="activa === comuna.id"
        :disabled="(totales.get(comuna.id) ?? 0) === 0"
        @click="seleccionar(comuna.id)"
      >
        {{ comuna.id }}
      </button>
    </div>
    <button v-if="activa" type="button" class="limpiar" @click="emit('select', null)">
      Todas
    </button>
  </div>
</template>

<style scoped>
.zonas-barra {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 6px 0 4px;
  background: var(--bg-1);
}

.zonas-barra.vertical {
  flex-direction: column;
  width: 52px;
  flex: 0 0 52px;
  gap: 8px;
  padding: 4px 0;
  justify-content: flex-start;
}

.zonas-barra.vertical .zonas-label {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
}

.zonas-barra.vertical .zonas-lista {
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  padding-bottom: 0;
}

.zonas-barra.vertical .limpiar {
  padding: 6px;
  font-size: 0.62rem;
}

.zonas-label {
  flex: 0 0 auto;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--verde);
}

.zonas-lista {
  display: flex;
  gap: 6px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 2px;
}

.zona {
  display: grid;
  flex: 0 0 34px;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--bg-1);
  border: 2px solid var(--zona-color);
  color: var(--zona-color);
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.16s var(--ease), background-color 0.16s, color 0.16s;
}

.zona:hover:not(:disabled) {
  transform: translateY(-2px);
}

.zona:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.zona.activa {
  background: var(--zona-color);
  color: var(--sobre-acento);
}

.zona.vacia {
  opacity: 0.35;
}

.limpiar {
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: transparent;
  color: var(--verde-deep);
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 680px) {
  .zonas-barra.vertical {
    flex-direction: row;
    width: 100%;
    flex: 1 1 auto;
    padding: 6px 0;
  }
  .zonas-barra.vertical .zonas-label {
    display: none;
  }
  .zonas-barra.vertical .zonas-lista {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
    overflow: visible;
    max-height: none;
  }
  .zonas-barra.vertical .zona {
    flex: 1 1 auto;
  }
}
</style>
