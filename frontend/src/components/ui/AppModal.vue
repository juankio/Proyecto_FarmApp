<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from './AppButton.vue';
import { useFocusTrap } from '../../composables/useFocusTrap';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    closeVariant?: 'primary' | 'secondary' | 'ghost';
  }>(),
  { closeVariant: 'primary' },
);
const emit = defineEmits<{ close: [] }>();

const modalRef = ref<HTMLElement | null>(null);
const isOpen = computed(() => props.open);

useFocusTrap(isOpen, modalRef, () => emit('close'));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="backdrop" @click.self="$emit('close')">
        <div
          ref="modalRef"
          class="surface surface--raised modal"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
        <div class="modal-head">
          <h2>{{ title }}</h2>
          <button type="button" class="modal-x" aria-label="Cerrar" @click="$emit('close')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div class="content"><slot /></div>
        <AppButton block :variant="closeVariant" @click="$emit('close')">Cerrar</AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
  background: rgba(2, 4, 10, 0.62);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
}

[data-theme="light"] .backdrop {
  background: rgba(15, 23, 42, 0.35);
}

.modal {
  width: min(100%, 480px);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: var(--radius-lg);
  outline: none;
  margin: auto;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex: 0 0 auto;
  padding-right: 4px;
}

.modal-x {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--surface-border);
  background: var(--bg-2);
  color: var(--ink);
  cursor: pointer;
}

.modal h2 {
  font-size: 1.4rem;
  margin-bottom: 14px;
}

.content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: 0 0 18px;
  padding-right: 4px;
  color: var(--muted);
  font-size: 0.94rem;
}

.modal > :deep(.app-button) {
  flex: 0 0 auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.26s ease;
}

.modal-leave-active {
  pointer-events: none;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    transform 0.34s var(--spring),
    opacity 0.28s ease,
    filter 0.34s var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(22px) scale(0.96);
  opacity: 0;
  filter: blur(6px);
}
</style>
