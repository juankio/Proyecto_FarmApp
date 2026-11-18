<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tone?: 'glass' | 'solid' | 'dark';
    radius?: string;
    shadow?: string;
    blur?: 'none' | 'sm' | 'md' | 'lg';
  }>(),
  {
    tone: 'solid',
    radius: 'var(--radius)',
    shadow: 'var(--shadow-sm)',
    blur: 'none',
  },
);

const blurMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'var(--blur-sm)',
  md: 'var(--blur-md)',
  lg: 'var(--blur-lg)',
};

const blurValue = computed(() => (props.blur === 'none' ? '' : blurMap[props.blur]));
</script>

<template>
  <div
    class="app-surface"
    :class="tone"
    :style="{
      borderRadius: radius,
      boxShadow: shadow,
      backdropFilter: blurValue || undefined,
      WebkitBackdropFilter: blurValue || undefined,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.app-surface {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.glass {
  background: var(--glass);
  border: 1px solid var(--line);
}

.solid {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.dark {
  background: var(--glass-dark);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #eaf6fb;
}
</style>
