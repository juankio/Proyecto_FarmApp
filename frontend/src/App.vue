<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import { useReveal } from './composables/useReveal';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { start, revealAll } = useReveal();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const navegando = ref(false);

let cuadro = 0;
let inicioNavegacion = 0;
let temporizadorBarra: number | undefined;
let punteroX = 0;
let punteroY = 0;

const quitarGuardia = router.beforeEach(() => {
  inicioNavegacion = performance.now();
  navegando.value = true;
});

const quitarSeguimiento = router.afterEach(() => {
  const restante = Math.max(0, 420 - (performance.now() - inicioNavegacion));
  window.clearTimeout(temporizadorBarra);
  temporizadorBarra = window.setTimeout(() => {
    navegando.value = false;
  }, restante);
});

function moverAmbiente(event: PointerEvent): void {
  if (event.pointerType === 'touch' || reduceMotion.matches) return;

  punteroX = event.clientX;
  punteroY = event.clientY;
  if (cuadro) return;

  cuadro = requestAnimationFrame(() => {
    cuadro = 0;
    const x = punteroX / window.innerWidth - 0.5;
    const y = punteroY / window.innerHeight - 0.5;

    const ambiente = document.querySelector<HTMLElement>('.ambient');
    if (ambiente) {
      ambiente.style.setProperty('--px', `${(x * 28).toFixed(1)}px`);
      ambiente.style.setProperty('--py', `${(y * 18).toFixed(1)}px`);
    }

    const hero = document.querySelector<HTMLElement>('.page-hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${(punteroX - rect.left).toFixed(1)}px`);
      hero.style.setProperty('--my', `${(punteroY - rect.top).toFixed(1)}px`);
    }
  });
}

function sesionExpirada(): void {
  auth.logout();
  router.push({ path: '/login', query: { redirect: route.fullPath } });
}

onMounted(async () => {
  window.addEventListener('farmapp:unauthorized', sesionExpirada);
  window.addEventListener('pointermove', moverAmbiente, { passive: true });

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
  window.removeEventListener('pointermove', moverAmbiente);
  cancelAnimationFrame(cuadro);
  window.clearTimeout(temporizadorBarra);
  quitarGuardia();
  quitarSeguimiento();
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
    <span class="orb orb-c" />
    <div class="caustics" />
    <div class="dots" />
    <div class="rings" />
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

<style>
.page-enter-active {
  transition:
    opacity 0.38s ease,
    transform 0.5s var(--ease),
    filter 0.38s ease;
}

.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.26s ease,
    filter 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translate3d(0, 18px, 0) scale(0.992);
  filter: blur(5px);
}

.page-leave-to {
  opacity: 0;
  transform: translate3d(0, -10px, 0) scale(0.997);
  filter: blur(3px);
}

.route-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  height: 2px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.route-progress.active {
  opacity: 1;
  transition: none;
}

.route-progress span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--aqua), var(--blue), var(--mint));
  box-shadow: 0 0 12px rgba(10, 132, 255, 0.45);
}

@media (prefers-reduced-motion: no-preference) {
  .route-progress.active span {
    animation: route-progress 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
}

@keyframes route-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 1;
    transform: none;
    filter: none;
  }

  .route-progress,
  .route-progress.active {
    transition: none;
  }
}

.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint;
  transform: translate3d(var(--px, 0px), var(--py, 0px), 0);
  transition: transform 0.4s ease-out;
  will-change: transform;
}

.aurora,
.caustics,
.dots,
.rings {
  position: absolute;
  pointer-events: none;
  will-change: transform;
}

.aurora {
  inset: -30%;
  background:
    radial-gradient(30% 26% at 22% 30%, rgba(90, 200, 250, 0.55), transparent 70%),
    radial-gradient(28% 24% at 78% 22%, rgba(185, 168, 255, 0.5), transparent 70%),
    radial-gradient(32% 28% at 62% 78%, rgba(126, 224, 192, 0.45), transparent 70%);
  opacity: 0.38;
}

.caustics {
  top: 120px;
  left: 0;
  right: 0;
  height: 620px;
  background: url('./assets/bg-caustics.svg') center / 100% 100% no-repeat;
  opacity: 0.85;
}

.dots {
  top: 120px;
  left: 18px;
  width: 256px;
  height: 256px;
  background: url('./assets/bg-dots.svg') center / 100% 100% no-repeat;
  opacity: 0.8;
}

.rings {
  top: 180px;
  right: 40px;
  width: 304px;
  height: 304px;
  background: url('./assets/bg-rings.svg') center / 100% 100% no-repeat;
  opacity: 0.8;
}

.sweep {
  position: fixed;
  inset: -30%;
  z-index: 2;
  background: linear-gradient(
    112deg,
    transparent 42%,
    rgba(255, 255, 255, 0.32) 47%,
    rgba(255, 255, 255, 0.62) 50%,
    rgba(255, 255, 255, 0.32) 53%,
    transparent 58%
  );
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.orb {
  position: absolute;
  display: block;
  border-radius: 50%;
  opacity: 0.48;
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
  .aurora {
    animation: aurora-drift 18s ease-in-out infinite alternate;
  }
  .caustics {
    animation: caustics-drift 14s ease-in-out infinite alternate;
  }
  .dots {
    animation: dots-float 9s ease-in-out infinite alternate;
  }
  .rings {
    animation: rings-turn 20s ease-in-out infinite alternate;
  }
  .orb-a {
    animation: orb-drift-a 13s ease-in-out infinite alternate;
  }
  .orb-b {
    animation: orb-drift-b 17s ease-in-out infinite alternate;
  }
  .orb-c {
    animation: orb-drift-c 21s ease-in-out infinite alternate;
  }
  .sweep {
    animation: light-sweep 11s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}

@keyframes aurora-drift {
  from {
    transform: rotate(-7deg) scale(1.02) translate3d(-1%, 0, 0);
  }
  to {
    transform: rotate(7deg) scale(1.12) translate3d(2%, -2%, 0);
  }
}

@keyframes caustics-drift {
  from {
    transform: translate3d(-2.2%, 0, 0) scale(1.02);
  }
  to {
    transform: translate3d(2.2%, 30px, 0) scale(1.06);
  }
}

@keyframes dots-float {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(16px, -26px, 0);
  }
}

@keyframes rings-turn {
  from {
    transform: rotate(-10deg) translate3d(0, 0, 0);
  }
  to {
    transform: rotate(10deg) translate3d(-14px, 12px, 0);
  }
}

@keyframes light-sweep {
  0%,
  44% {
    transform: translate3d(-72%, -18%, 0);
    opacity: 0;
  }
  50% {
    transform: translate3d(-36%, -9%, 0);
    opacity: 0.42;
  }
  62% {
    transform: translate3d(36%, 9%, 0);
    opacity: 0.42;
  }
  70% {
    transform: translate3d(72%, 18%, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(72%, 18%, 0);
    opacity: 0;
  }
}

@keyframes orb-drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(12vw, 12vh, 0) scale(1.22);
  }
}

@keyframes orb-drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.06);
  }
  to {
    transform: translate3d(-12vw, 9vh, 0) scale(0.9);
  }
}

@keyframes orb-drift-c {
  from {
    transform: translate3d(0, 0, 0) scale(0.98);
  }
  to {
    transform: translate3d(9vw, -10vh, 0) scale(1.2);
  }
}

@media (max-width: 640px) {
  .caustics {
    top: 90px;
    height: 460px;
  }
  .dots {
    top: 96px;
    left: 8px;
    width: 200px;
    height: 200px;
  }
  .rings {
    top: 150px;
    right: 8px;
    width: 220px;
    height: 220px;
  }
  .aurora {
    opacity: 0.32;
  }
}
</style>
