<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string | number;
    label: string;
    tone?: 'default' | 'blue' | 'mint' | 'aqua' | 'lavender' | 'rose';
  }>(),
  { tone: 'default' },
);
</script>

<template>
  <div class="surface surface--glass app-stat" :class="tone">
    <span class="app-stat__value">{{ value }}</span>
    <span class="app-stat__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.app-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
}

.app-stat__value {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 2.4vw, 2.1rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.045em;
  color: var(--ink);
}

.app-stat__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--muted);
}

.blue .app-stat__value {
  color: var(--blue-bright);
  text-shadow: 0 0 24px rgba(10, 132, 255, 0.5);
}

.mint .app-stat__value {
  color: var(--mint);
  text-shadow: 0 0 24px rgba(126, 224, 192, 0.45);
}

.aqua .app-stat__value {
  color: var(--aqua);
  text-shadow: 0 0 24px rgba(90, 200, 250, 0.45);
}

.lavender .app-stat__value {
  color: var(--lavender);
  text-shadow: 0 0 24px rgba(185, 168, 255, 0.45);
}

.rose .app-stat__value {
  color: var(--rose);
  text-shadow: 0 0 24px rgba(255, 122, 184, 0.45);
}
</style>
