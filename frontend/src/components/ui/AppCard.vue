<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean;
    hover?: boolean;
    tone?: 'glass' | 'solid' | 'dark';
  }>(),
  { padded: true, hover: false, tone: 'glass' },
);
</script>

<template>
  <article class="app-card" :class="[tone, { padded, hover }]">
    <slot />
  </article>
</template>

<style scoped>
.app-card {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.32s var(--ease), box-shadow 0.32s var(--ease);
}

.glass {
  background: var(--glass);
  -webkit-backdrop-filter: blur(26px) saturate(185%);
  backdrop-filter: blur(26px) saturate(185%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--depth);
}

.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.52) 0%,
    rgba(255, 255, 255, 0.08) 34%,
    transparent 58%
  );
  pointer-events: none;
  z-index: -1;
}

.solid {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 44px -22px rgba(8, 47, 77, 0.4);
}

.dark {
  background: var(--glass-dark);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: var(--inset), 0 30px 60px -24px rgba(3, 24, 40, 0.7);
  color: #eaf6fb;
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
}

.padded {
  padding: clamp(20px, 2.6vw, 30px);
}

.hover:hover {
  transform: translateY(-5px);
  box-shadow: var(--inset), var(--depth-lg);
}
</style>
