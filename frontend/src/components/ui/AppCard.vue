<script setup lang="ts">
const toneClass = {
  glass: 'surface--glass',
  solid: 'surface--raised',
  dark: 'surface--dark',
} as const;

withDefaults(
  defineProps<{
    padded?: boolean;
    hover?: boolean;
    tone?: 'glass' | 'solid' | 'dark';
  }>(),
  { padded: true, hover: false, tone: 'solid' },
);
</script>

<template>
  <article class="surface" :class="[toneClass[tone], { padded, hover }]">
    <slot />
  </article>
</template>

<style scoped>
.padded {
  padding: clamp(20px, 2.6vw, 30px);
}

.hover {
  transition: transform 0.38s var(--ease), box-shadow 0.38s var(--ease);
}

.hover:hover {
  transform: translateY(-6px);
  box-shadow: var(--inset), var(--glow-blue);
}
</style>
