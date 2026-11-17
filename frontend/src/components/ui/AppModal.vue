<script setup lang="ts">
import AppButton from './AppButton.vue';

defineProps<{ open: boolean; title: string }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop" @click.self="$emit('close')">
      <div class="modal">
        <h2>{{ title }}</h2>
        <div class="content"><slot /></div>
        <AppButton @click="$emit('close')">Cerrar</AppButton>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; background: rgba(9, 62, 98, 0.35); backdrop-filter: blur(8px); }
.modal { width: min(90%, 460px); padding: 32px; border-radius: 26px; background: rgba(255,255,255,.9); border: 1px solid rgba(255,255,255,.85); box-shadow: var(--inset), var(--depth); }
.content { margin: 16px 0 24px; }
</style>
