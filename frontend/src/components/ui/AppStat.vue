<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string | number;
    label: string;
    tone?: 'default' | 'blue' | 'mint' | 'aqua' | 'lavender';
  }>(),
  { tone: 'default' },
);
</script>

<template>
  <div class="app-stat" :class="tone">
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
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.85);
}

.app-stat__value {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1;
  color: var(--ink);
}

.app-stat__label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--muted);
}

.blue .app-stat__value { color: var(--blue-deep); }
.mint .app-stat__value { color: #1fa97a; }
.aqua .app-stat__value { color: #0a7fc4; }
.lavender .app-stat__value { color: #6b5bd6; }
</style>
