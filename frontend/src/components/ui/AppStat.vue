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

.blue .app-stat__value,
.mint .app-stat__value,
.aqua .app-stat__value,
.lavender .app-stat__value,
.rose .app-stat__value {
  color: var(--verde-texto);
  text-shadow: 0 0 20px rgba(31, 107, 79, 0.25);
}

[data-theme="light"] .app-stat__value {
  text-shadow: none;
}
</style>
