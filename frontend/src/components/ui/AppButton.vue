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
  border-radius: 10px;
  border: 1.5px solid transparent;
  font-family: inherit;
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.18s var(--ease),
    box-shadow 0.18s var(--ease),
    background-color 0.18s,
    border-color 0.18s,
    color 0.18s;
}

.app-button:hover:not(:disabled) {
  transform: translate(-1px, -1px);
}

.app-button:active:not(:disabled) {
  transform: translate(0, 0);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button:focus-visible {
  outline: 2px solid var(--verde);
  outline-offset: 3px;
  border-radius: 10px;
}

.primary {
  background: var(--verde);
  color: var(--sobre-acento);
  border-color: var(--verde-deep);
  box-shadow: 3px 3px 0 var(--verde-deep);
}

.primary:hover:not(:disabled) {
  background: var(--verde-deep);
  box-shadow: 5px 5px 0 rgba(18, 69, 47, 0.85);
}

.secondary {
  background: transparent;
  color: var(--ink);
  border-color: var(--ink);
  box-shadow: 3px 3px 0 rgba(22, 36, 29, 0.16);
}

.secondary:hover:not(:disabled) {
  background: rgba(22, 36, 29, 0.05);
  box-shadow: 5px 5px 0 rgba(22, 36, 29, 0.2);
}

.ghost {
  background: transparent;
  color: var(--verde);
  border-color: transparent;
  padding-inline: 10px;
}

.ghost:hover:not(:disabled) {
  background: rgba(31, 107, 79, 0.08);
  border-color: rgba(31, 107, 79, 0.24);
}

.danger {
  background: var(--terracota);
  color: var(--sobre-acento);
  border-color: #8f3e1d;
  box-shadow: 3px 3px 0 rgba(143, 62, 29, 0.5);
}

.danger:hover:not(:disabled) {
  background: #a84a26;
}

.light {
  background: var(--bg-1);
  color: var(--ink);
  border-color: var(--surface-border);
  box-shadow: var(--shadow-sm);
}

.light:hover:not(:disabled) {
  background: #ffffff;
  border-color: rgba(31, 107, 79, 0.4);
}

.sm {
  min-height: 44px;
  padding: 0 16px;
  font-size: 0.86rem;
}

.lg {
  min-height: 54px;
  padding: 0 28px;
  font-size: 1rem;
}

.block {
  width: 100%;
}
</style>
