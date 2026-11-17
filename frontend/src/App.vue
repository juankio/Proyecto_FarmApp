<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import { useReveal } from './composables/useReveal';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { start, revealAll } = useReveal();

function sesionExpirada(): void {
  auth.logout();
  router.push({ path: '/login', query: { redirect: route.fullPath } });
}

onMounted(async () => {
  window.addEventListener('farmapp:unauthorized', sesionExpirada);

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
    }
  }

  await nextTick();
  start();
});

onBeforeUnmount(() => {
  window.removeEventListener('farmapp:unauthorized', sesionExpirada);
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
