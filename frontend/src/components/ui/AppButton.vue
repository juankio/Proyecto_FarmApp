<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'ghost' | 'light' | 'danger';
    size?: 'md' | 'sm' | 'lg';
    disabled?: boolean;
    block?: boolean;
  }>(),
  { type: 'button', variant: 'primary', size: 'md', disabled: false, block: false },
);
</script>

<template>
  <button
    class="app-button"
    :class="[variant, size, { block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 14px;
  border: 1px solid transparent;
  font-size: 0.94rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.22s var(--ease), box-shadow 0.22s var(--ease),
    background 0.22s, border-color 0.22s;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.app-button:active:not(:disabled) {
  transform: translateY(0) scale(0.985);
}

.app-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.primary {
  background: linear-gradient(150deg, #2396ff, var(--blue-deep));
  color: #fff;
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    0 14px 28px -12px rgba(0, 98, 204, 0.75);
}

.primary:hover:not(:disabled) {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 20px 36px -14px rgba(0, 98, 204, 0.85);
}

.secondary {
  background: rgba(255, 255, 255, 0.7);
  color: var(--ink);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: var(--inset), 0 10px 22px -14px rgba(8, 47, 77, 0.45);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
}

.ghost {
  background: transparent;
  color: var(--blue-deep);
  border-color: rgba(10, 132, 255, 0.24);
}

.ghost:hover:not(:disabled) {
  background: rgba(10, 132, 255, 0.08);
}

.danger {
  background: linear-gradient(150deg, #ff7a7a, #c62828);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    0 14px 28px -12px rgba(198, 40, 40, 0.7);
}

.danger:hover:not(:disabled) {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.44),
    0 20px 36px -14px rgba(198, 40, 40, 0.8);
}

.light {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.34);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.light:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.26);
}

.sm {
  min-height: 40px;
  padding: 0 16px;
  font-size: 0.86rem;
  border-radius: 12px;
}

.lg {
  min-height: 54px;
  padding: 0 30px;
  font-size: 1rem;
}

.block {
  width: 100%;
}
</style>
