<script setup lang="ts">
withDefaults(
  defineProps<{
    reveal?: boolean;
    eyebrow?: string;
    title?: string;
    lede?: string;
  }>(),
  { reveal: true },
);
</script>

<template>
  <section class="app-section" :class="{ reveal }">
    <header v-if="$slots.header || eyebrow || title || lede" class="app-section__header">
      <slot name="header">
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="lede" class="lede">{{ lede }}</p>
      </slot>
    </header>
    <div class="app-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.app-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-section__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.eyebrow {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue-deep);
}

.app-section__header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--ink);
  margin: 0;
}

.lede {
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 62ch;
  margin: 0;
}

.app-section__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
