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

const toneClass = computed(() => ({
  glass: 'surface--glass',
  solid: 'surface--raised',
  dark: 'surface--dark',
}[props.tone]));

const blurValue = computed(() => (props.blur === 'none' ? '' : blurMap[props.blur]));
</script>

<template>
  <div
    class="surface"
    :class="toneClass"
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
