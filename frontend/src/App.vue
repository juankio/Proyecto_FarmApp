<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import AppSkeleton from './components/ui/AppSkeleton.vue';
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
        <Suspense>
          <div :key="route.path" class="view-root">
            <component :is="Component" />
          </div>
          <template #fallback>
            <div class="view-root page-skeleton-shell" aria-hidden="true">
              <div class="page-skeleton-hero">
                <AppSkeleton width="120px" height="22px" radius="10px" />
                <AppSkeleton width="55%" height="42px" radius="14px" />
                <AppSkeleton width="75%" height="18px" radius="8px" />
              </div>
              <div class="page-skeleton-grid">
                <div v-for="i in 3" :key="i" class="page-skeleton-card">
                  <AppSkeleton width="100%" height="130px" radius="14px" />
                  <AppSkeleton width="65%" height="18px" radius="8px" />
                  <AppSkeleton width="88%" height="12px" radius="6px" />
                </div>
              </div>
            </div>
          </template>
        </Suspense>
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
</template>
