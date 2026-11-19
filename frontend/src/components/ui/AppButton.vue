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
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: 0.94rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  transition:
    transform 0.24s var(--spring),
    box-shadow 0.24s var(--ease),
    background 0.24s,
    border-color 0.24s;
}

.app-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background: linear-gradient(
    150deg,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.05) 42%,
    rgba(255, 255, 255, 0.22) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.app-button:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button:focus-visible {
  outline: 2px solid var(--aqua);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

.primary {
  background: linear-gradient(150deg, #1a8cff, var(--blue-deep));
  color: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 14px 34px -14px rgba(10, 132, 255, 0.75);
}

.primary:hover:not(:disabled) {
  background: linear-gradient(150deg, #2a9bff, #0a6fd4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 22px 48px -16px rgba(10, 132, 255, 0.9);
}

.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--ink);
  border-color: var(--line);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.28);
}

.ghost {
  background: transparent;
  color: var(--aqua);
  border-color: rgba(90, 200, 250, 0.32);
}

.ghost:hover:not(:disabled) {
  background: rgba(90, 200, 250, 0.1);
  border-color: rgba(90, 200, 250, 0.5);
}

.danger {
  background: linear-gradient(150deg, #ff8a8a, #d32f2f);
  color: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 14px 34px -14px rgba(211, 47, 47, 0.7);
}

.danger:hover:not(:disabled) {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 22px 48px -16px rgba(211, 47, 47, 0.85);
}

.light {
  background: rgba(255, 255, 255, 0.16);
  color: var(--ink);
  border-color: rgba(255, 255, 255, 0.34);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.light:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.26);
}

.sm {
  min-height: 44px;
  padding: 0 16px;
  font-size: 0.86rem;
}

.lg {
  min-height: 56px;
  padding: 0 32px;
  font-size: 1.02rem;
}

.block {
  width: 100%;
}
</style>
