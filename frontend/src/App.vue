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
  <div class="ambient" aria-hidden="true">
    <span class="orb orb-a" />
    <span class="orb orb-b" />
    <span class="orb orb-c" />
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

.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint;
}

.orb {
  position: absolute;
  display: block;
  border-radius: 50%;
  opacity: 0.55;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.orb-a {
  top: -16vw;
  left: -12vw;
  width: clamp(260px, 48vw, 760px);
  aspect-ratio: 1;
  background: radial-gradient(circle at 40% 40%, rgba(90, 200, 250, 0.55), transparent 68%);
}

.orb-b {
  top: 4%;
  right: -16vw;
  width: clamp(240px, 40vw, 640px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(185, 168, 255, 0.42), transparent 70%);
}

.orb-c {
  bottom: -18vw;
  left: 16%;
  width: clamp(260px, 44vw, 700px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(126, 224, 192, 0.38), transparent 70%);
}

@media (prefers-reduced-motion: no-preference) {
  .orb-a {
    animation: orb-drift-a 28s ease-in-out infinite alternate;
  }
  .orb-b {
    animation: orb-drift-b 34s ease-in-out infinite alternate;
  }
  .orb-c {
    animation: orb-drift-c 40s ease-in-out infinite alternate;
  }
}

@keyframes orb-drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(8vw, 8vh, 0) scale(1.18);
  }
}

@keyframes orb-drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.06);
  }
  to {
    transform: translate3d(-9vw, 6vh, 0) scale(0.94);
  }
}

@keyframes orb-drift-c {
  from {
    transform: translate3d(0, 0, 0) scale(0.98);
  }
  to {
    transform: translate3d(6vw, -7vh, 0) scale(1.15);
  }
}
</style>
