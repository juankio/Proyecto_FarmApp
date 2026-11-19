<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import AppButton from './AppButton.vue';

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
let previouslyFocused: HTMLElement | null = null;

function focusables(): HTMLElement[] {
  if (!modalRef.value) return [];
  return Array.from(
    modalRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    return;
  }
  if (event.key !== 'Tab') return;
  const list = focusables();
  if (!list.length) {
    event.preventDefault();
    modalRef.value?.focus();
    return;
  }
  const first = list[0];
  const last = list[list.length - 1];
  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      await nextTick();
      modalRef.value?.focus();
    } else if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  },
);

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
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
          <h2>{{ title }}</h2>
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
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 4, 10, 0.62);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
}

.modal {
  width: min(100%, 480px);
  padding: 34px;
  border-radius: var(--radius-lg);
  outline: none;
}

.modal h2 {
  font-size: 1.4rem;
  margin-bottom: 14px;
}

.content {
  margin: 0 0 24px;
  color: var(--muted);
  font-size: 0.94rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.26s ease;
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
