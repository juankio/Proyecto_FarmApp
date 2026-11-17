<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import { useReveal } from './composables/useReveal';

const route = useRoute();
const { start, revealAll } = useReveal();

onMounted(async () => {
  await nextTick();
  start();
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    revealAll();
  },
);
</script>

<template>
  <AppHeader />
  <main class="page shell">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <div :key="route.fullPath" class="view-root">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.26s var(--ease);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
