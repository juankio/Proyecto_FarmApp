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
  <div class="app-empty-state">
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
}

.app-empty-state__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  background: rgba(10, 132, 255, 0.08);
  color: var(--blue-deep);
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
