<script setup lang="ts">
import AppButton from './AppButton.vue';

defineProps<{ open: boolean; title: string }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="backdrop" @click.self="$emit('close')">
        <div class="modal">
          <h2>{{ title }}</h2>
          <div class="content"><slot /></div>
          <AppButton block @click="$emit('close')">Cerrar</AppButton>
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
  background: rgba(8, 47, 77, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.modal {
  width: min(100%, 480px);
  padding: 34px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--inset), var(--depth-lg);
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
  transition: opacity 0.24s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.28s var(--ease), opacity 0.28s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(16px) scale(0.97);
  opacity: 0;
}
</style>
