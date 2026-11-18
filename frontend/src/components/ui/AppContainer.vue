<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'full';
    padding?: string | boolean;
  }>(),
  { size: 'md', padding: true },
);

const maxWidth = computed(() => {
  switch (props.size) {
    case 'sm':
      return '720px';
    case 'lg':
      return '1280px';
    case 'full':
      return '100%';
    default:
      return '1080px';
  }
});

const paddingValue = computed(() => {
  if (props.padding === false) return '0';
  if (props.padding === true) return 'var(--space-5)';
  return props.padding as string;
});
</script>

<template>
  <div class="app-container" :style="{ maxWidth, padding: paddingValue }">
    <slot />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  margin-inline: auto;
}
</style>
