<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import { useReveal } from './composables/useReveal';
import { useNavigationProgress } from './composables/useNavigationProgress';
import { useAmbientParallax } from './composables/useAmbientParallax';
import { useScrollAmbient } from './composables/useScrollAmbient';
import { useAuthBootstrap } from './composables/useAuthBootstrap';
import { useUiStore } from './stores/ui';

const route = useRoute();
const ui = useUiStore();
const { start, revealAll } = useReveal();
const { navegando, instalar } = useNavigationProgress();

useAmbientParallax();
useScrollAmbient();
useAuthBootstrap();

const desinstalarNavegacion = instalar();

onMounted(() => {
  ui.initTheme();
  start();
});

onBeforeUnmount(() => {
  desinstalarNavegacion();
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
  <div class="ambient" aria-hidden="true">
    <div class="aurora" />
    <span class="orb orb-a" />
    <span class="orb orb-b" />
    <div class="grain" />
  </div>
  <div class="sweep" aria-hidden="true" />
  <div class="route-progress" :class="{ active: navegando }" aria-hidden="true">
    <span />
  </div>

  <AppHeader />
  <main class="page shell">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <div :key="route.path" class="view-root">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
</template>
