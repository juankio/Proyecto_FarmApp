<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFocusTrap } from '../../composables/useFocusTrap';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    width?: string;
  }>(),
  { width: '560px' },
);

const emit = defineEmits<{ close: [] }>();

const modalRef = ref<HTMLElement | null>(null);
const isOpen = computed(() => props.open);

function handleClose(): void {
  emit('close');
}

useFocusTrap(isOpen, modalRef, () => emit('close'));
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-modal">
      <div v-if="open" class="backdrop" @click.self="handleClose">
        <div ref="modalRef" class="dialog" :style="{ maxWidth: width }" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title">
          <header>
            <h2>{{ title }}</h2>
            <button type="button" aria-label="Cerrar" @click="handleClose">✕</button>
          </header>
          <div class="body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 4, 10, 0.62);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  overflow-y: auto;
}

[data-theme="light"] .backdrop {
  background: rgba(15, 23, 42, 0.35);
}

.dialog {
  width: 100%;
  margin: auto;
  border-radius: var(--radius-lg);
  outline: none;
  background: var(--glass-strong);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-md);
  overflow: hidden;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line-soft);
}

header h2 {
  font-size: 1.12rem;
}

header button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
  color: var(--ink-soft);
  font-size: 0.82rem;
  cursor: pointer;
}

header button:hover {
  background: rgba(255, 255, 255, 0.14);
}

.body {
  padding: 22px 24px 24px;
  max-height: min(76vh, 680px);
  overflow-y: auto;
}

.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.22s ease;
}

.admin-modal-enter-active .dialog,
.admin-modal-leave-active .dialog {
  transition: transform 0.28s var(--ease), opacity 0.24s ease;
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
}

.admin-modal-enter-from .dialog,
.admin-modal-leave-to .dialog {
  transform: translateY(14px) scale(0.98);
  opacity: 0;
}
</style>
