<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    radius?: string;
    circle?: boolean;
  }>(),
  { width: '100%', height: '14px', radius: '8px', circle: false },
);
</script>

<template>
  <span
    class="app-skeleton"
    :style="{ width, height, borderRadius: circle ? '50%' : radius }"
    aria-hidden="true"
  />
</template>

<style scoped>
.app-skeleton {
  display: block;
  position: relative;
  flex: none;
  overflow: hidden;
  background: var(--skeleton-bg, rgba(255, 255, 255, 0.08));
  border: 1px solid var(--skeleton-border, rgba(255, 255, 255, 0.06));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.app-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(
    --skeleton-shimmer,
    linear-gradient(
      100deg,
      transparent 18%,
      rgba(255, 255, 255, 0.22) 46%,
      rgba(255, 255, 255, 0.1) 58%,
      transparent 82%
    )
  );
  transform: translate3d(-110%, 0, 0);
  animation: skeleton-shimmer 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes skeleton-shimmer {
  to {
    transform: translate3d(110%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-skeleton::after {
    animation: none;
    opacity: 0;
  }
}
</style>
