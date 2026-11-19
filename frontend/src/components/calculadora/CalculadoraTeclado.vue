<script setup lang="ts">
defineProps<{
  teclas: string[][];
}>();

const emit = defineEmits<{ (e: 'press', value: string): void }>();

function esOperador(tecla: string): boolean {
  return ['/', '*', '-', '+', '%'].includes(tecla);
}
</script>

<template>
  <div class="keys">
    <button
      v-for="tecla in teclas.flat()"
      :key="tecla"
      type="button"
      class="key"
      :class="{ op: esOperador(tecla), eq: tecla === '=' }"
      @click="emit('press', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
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
</style>