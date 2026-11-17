<script setup lang="ts">
import type { Pregunta } from '../../data/faq';

defineProps<{ items: Pregunta[] }>();
</script>

<template>
  <div class="accordion-list">
    <details v-for="item in items" :key="item.pregunta" class="accordion">
      <summary>{{ item.pregunta }}</summary>
      <div class="answer">{{ item.respuesta }}</div>
    </details>
  </div>
</template>

<style scoped>
.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
