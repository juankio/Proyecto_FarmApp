<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    width?: string;
  }>(),
  { width: '560px' },
);

defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-modal">
      <div v-if="open" class="backdrop" @click.self="$emit('close')">
        <div class="dialog" :style="{ maxWidth: width }" role="dialog" aria-modal="true">
          <header>
            <h2>{{ title }}</h2>
            <button type="button" aria-label="Cerrar" @click="$emit('close')">✕</button>
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
  background: rgba(8, 47, 77, 0.44);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  overflow-y: auto;
}

.dialog {
  width: 100%;
  margin: auto;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--inset), var(--depth-lg);
  overflow: hidden;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(12, 74, 112, 0.1);
}

header h2 {
  font-size: 1.12rem;
}

header button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(12, 74, 112, 0.12);
  background: rgba(255, 255, 255, 0.8);
  color: var(--ink-soft);
  font-size: 0.82rem;
  cursor: pointer;
}

header button:hover {
  background: #fff;
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
