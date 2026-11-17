<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean; large?: boolean }>(), { padded: true, large: false });
</script>

<template>
  <article class="glass-card" :class="{ padded, large }">
    <slot />
  </article>
</template>

<style scoped>
.glass-card {
  position: relative;
  background: var(--glass);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
  backdrop-filter: url(#lg-refraction) blur(30px) saturate(190%);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--inset), var(--depth);
  overflow: hidden;
}
.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,.5), rgba(255,255,255,.06) 38%, transparent 62%);
  pointer-events: none;
}
.glass-card > * { position: relative; z-index: 1; }
.padded { padding: 28px; }
.large { border-radius: var(--radius-lg); padding: 52px 48px; text-align: center; }
@media (max-width: 767px) { .large { padding: 34px 24px; } }
</style>
