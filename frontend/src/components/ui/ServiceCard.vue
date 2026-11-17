<script setup lang="ts">
import AppCard from './AppCard.vue';

defineProps<{ title: string; description: string; icon: string }>();
</script>

<template>
  <AppCard class="service">
    <svg class="lg-icon" viewBox="0 0 24 24" aria-hidden="true" v-html="icon" />
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </AppCard>
</template>

<style scoped>
.service { display: flex; flex-direction: column; align-items: flex-start; transition: transform .25s, box-shadow .25s; }
.service:hover { transform: translateY(-4px); box-shadow: var(--inset), 0 34px 70px rgba(9,62,98,.22); }
h3 { font-size: 1.1rem; margin: 0 0 8px; }
p { font-size: .92rem; }
</style>
