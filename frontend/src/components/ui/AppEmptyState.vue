<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    icon?: string;
  }>(),
  {},
);
</script>

<template>
  <div class="surface surface--glass app-empty-state">
    <div class="app-empty-state__icon">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <h3 v-if="title" class="app-empty-state__title">{{ title }}</h3>
    <p v-if="description" class="app-empty-state__description">{{ description }}</p>
    <div v-if="$slots.action" class="app-empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-6);
  border-radius: var(--radius-md);
}

.app-empty-state__icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: var(--radius-sm);
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.2), rgba(185, 168, 255, 0.1));
  border: 1px solid rgba(90, 200, 250, 0.26);
  color: var(--aqua);
  font-size: 1.5rem;
}

.app-empty-state__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.app-empty-state__description {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 46ch;
  margin: 0;
}

.app-empty-state__action {
  margin-top: var(--space-2);
}
</style>
