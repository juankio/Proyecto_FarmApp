<script setup lang="ts">
import AppCard from '../ui/AppCard.vue';

defineProps<{ title: string; description?: string }>();
</script>

<template>
  <AppCard large class="hero">
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
    <div class="actions"><slot /></div>
  </AppCard>
</template>

<style scoped>
.hero { margin-bottom: 36px; }
.actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
</style>
