<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; disabled?: boolean; block?: boolean }>(), {
  type: 'button',
  disabled: false,
  block: false,
});
</script>

<template>
  <button class="app-button" :class="{ block }" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--blue), var(--blue-deep));
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 12px 26px rgba(0, 98, 204, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.app-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 16px 32px rgba(0,98,204,.36); }
.app-button:disabled { opacity: 0.55; cursor: not-allowed; }
.block { width: 100%; }
</style>
