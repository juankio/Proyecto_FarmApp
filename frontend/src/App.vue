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
let cuadroScroll = 0;

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
      ambiente.style.setProperty('--px', `${(x * 24).toFixed(1)}px`);
      ambiente.style.setProperty('--py', `${(y * 16).toFixed(1)}px`);
    }

    const hero = document.querySelector<HTMLElement>('.page-hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${(punteroX - rect.left).toFixed(1)}px`);
      hero.style.setProperty('--my', `${(punteroY - rect.top).toFixed(1)}px`);
    }
  });
}

function actualizarScroll(): void {
  cuadroScroll = 0;
  if (reduceMotion.matches) return;

  const ambiente = document.querySelector<HTMLElement>('.ambient');
  if (ambiente) {
    ambiente.style.setProperty('--scroll', `${window.scrollY}`);
  }
}

function manejarScroll(): void {
  if (cuadroScroll) return;
  cuadroScroll = requestAnimationFrame(actualizarScroll);
}

function sesionExpirada(): void {
  auth.logout();
  router.push({ path: '/login', query: { redirect: route.fullPath } });
}

onMounted(async () => {
  window.addEventListener('farmapp:unauthorized', sesionExpirada);
  window.addEventListener('pointermove', moverAmbiente, { passive: true });
  window.addEventListener('scroll', manejarScroll, { passive: true });
  manejarScroll();

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
    }
  }

  start();
});

onBeforeUnmount(() => {
  window.removeEventListener('farmapp:unauthorized', sesionExpirada);
  window.removeEventListener('pointermove', moverAmbiente);
  window.removeEventListener('scroll', manejarScroll);
  cancelAnimationFrame(cuadro);
  cancelAnimationFrame(cuadroScroll);
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
    <span class="orb orb-d" />
    <span class="orb orb-e" />
    <span class="orb orb-f" />
    <div class="caustics" />
    <div class="dots" />
    <div class="rings" />
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

<style>
.page-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.55s var(--ease),
    filter 0.45s ease;
}

.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.26s ease,
    filter 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translate3d(0, 22px, 0) scale(0.985);
  filter: blur(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translate3d(0, -12px, 0) scale(0.996);
  filter: blur(4px);
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
  background: linear-gradient(90deg, var(--aqua), var(--blue), var(--lavender));
  box-shadow: 0 0 14px rgba(10, 132, 255, 0.6);
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

.ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint;
  transform: translate3d(var(--px, 0px), calc(var(--py, 0px) + var(--scroll, 0) * 0.05px), 0);
  transition: transform 0.5s ease-out;
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
  inset: calc(-36% + var(--scroll, 0) * 0.02px);
  background:
    radial-gradient(34% 30% at 20% 28%, rgba(10, 132, 255, 0.5), transparent 70%),
    radial-gradient(30% 28% at 80% 18%, rgba(139, 92, 246, 0.42), transparent 70%),
    radial-gradient(36% 32% at 66% 82%, rgba(45, 212, 191, 0.3), transparent 70%),
    radial-gradient(28% 26% at 28% 80%, rgba(255, 122, 184, 0.24), transparent 70%);
  filter: blur(42px) saturate(150%);
  opacity: 0.68;
  margin-top: calc(var(--scroll, 0) * 0.02px);
}

.caustics {
  top: 90px;
  left: 0;
  right: 0;
  height: 700px;
  background: url('./assets/bg-caustics.svg') center / 100% 100% no-repeat;
  opacity: 0.42;
  mix-blend-mode: screen;
}

.dots {
  top: 110px;
  left: -30px;
  width: 320px;
  height: 320px;
  background: url('./assets/bg-dots.svg') center / 100% 100% no-repeat;
  opacity: 0.32;
  mix-blend-mode: screen;
}

.rings {
  top: 150px;
  right: 10px;
  width: 360px;
  height: 360px;
  background: url('./assets/bg-rings.svg') center / 100% 100% no-repeat;
  opacity: 0.3;
  mix-blend-mode: screen;
}

.grain {
  position: absolute;
  inset: -2%;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
}

.sweep {
  position: fixed;
  inset: -30%;
  z-index: 2;
  background: linear-gradient(
    112deg,
    transparent 42%,
    rgba(120, 200, 255, 0.16) 47%,
    rgba(220, 245, 255, 0.3) 50%,
    rgba(120, 200, 255, 0.16) 53%,
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
  filter: blur(90px);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.orb-a {
  top: calc(-18vw + var(--scroll, 0) * 0.08px);
  left: -14vw;
  width: clamp(300px, 52vw, 820px);
  aspect-ratio: 1;
  background: radial-gradient(circle at 40% 40%, rgba(10, 132, 255, 0.5), transparent 68%);
  opacity: 0.5;
}

.orb-b {
  top: calc(2% + var(--scroll, 0) * -0.05px);
  right: -18vw;
  width: clamp(260px, 44vw, 700px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.42), transparent 70%);
  opacity: 0.42;
}

.orb-c {
  bottom: calc(-20vw + var(--scroll, 0) * 0.12px);
  left: 14%;
  width: clamp(280px, 46vw, 760px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.34), transparent 70%);
  opacity: 0.36;
}

.orb-d {
  bottom: calc(8% + var(--scroll, 0) * -0.03px);
  right: 22%;
  width: clamp(220px, 34vw, 560px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(255, 122, 184, 0.3), transparent 70%);
  opacity: 0.3;
}

.orb-e {
  top: calc(40% + var(--scroll, 0) * 0.15px);
  left: 60%;
  width: clamp(200px, 30vw, 500px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(90, 200, 250, 0.32), transparent 70%);
  opacity: 0.28;
  filter: blur(80px);
}

.orb-f {
  bottom: calc(30% + var(--scroll, 0) * -0.1px);
  left: 10%;
  width: clamp(180px, 26vw, 440px);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(185, 168, 255, 0.28), transparent 70%);
  opacity: 0.24;
  filter: blur(80px);
}

@media (prefers-reduced-motion: no-preference) {
  .aurora {
    animation: aurora-drift 26s ease-in-out infinite alternate;
  }
  .caustics {
    animation: caustics-drift 18s ease-in-out infinite alternate;
  }
  .dots {
    animation: dots-float 11s ease-in-out infinite alternate;
  }
  .rings {
    animation: rings-turn 24s ease-in-out infinite alternate;
  }
  .orb-a {
    animation: orb-drift-a 16s ease-in-out infinite alternate;
  }
  .orb-b {
    animation: orb-drift-b 20s ease-in-out infinite alternate;
  }
  .orb-c {
    animation: orb-drift-c 24s ease-in-out infinite alternate;
  }
  .orb-d {
    animation: orb-drift-d 19s ease-in-out infinite alternate;
  }
  .sweep {
    animation: light-sweep 13s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}

@keyframes aurora-drift {
  from {
    transform: rotate(-8deg) scale(1.04) translate3d(-1%, 0, 0);
  }
  to {
    transform: rotate(8deg) scale(1.14) translate3d(2%, -2%, 0);
  }
}

@keyframes caustics-drift {
  from {
    transform: translate3d(-2.2%, 0, 0) scale(1.02);
  }
  to {
    transform: translate3d(2.2%, 34px, 0) scale(1.06);
  }
}

@keyframes dots-float {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(20px, -30px, 0);
  }
}

@keyframes rings-turn {
  from {
    transform: rotate(-12deg) translate3d(0, 0, 0);
  }
  to {
    transform: rotate(12deg) translate3d(-16px, 14px, 0);
  }
}

@keyframes light-sweep {
  0%,
  44% {
    transform: translate3d(-74%, -18%, 0);
    opacity: 0;
  }
  50% {
    transform: translate3d(-36%, -9%, 0);
    opacity: 0.5;
  }
  62% {
    transform: translate3d(36%, 9%, 0);
    opacity: 0.5;
  }
  70% {
    transform: translate3d(74%, 18%, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(74%, 18%, 0);
    opacity: 0;
  }
}

@keyframes orb-drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(12vw, 12vh, 0) scale(1.24);
  }
}

@keyframes orb-drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.06);
  }
  to {
    transform: translate3d(-12vw, 9vh, 0) scale(0.88);
  }
}

@keyframes orb-drift-c {
  from {
    transform: translate3d(0, 0, 0) scale(0.98);
  }
  to {
    transform: translate3d(9vw, -10vh, 0) scale(1.22);
  }
}

@keyframes orb-drift-d {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-8vw, -7vh, 0) scale(1.16);
  }
}

@media (max-width: 640px) {
  .caustics {
    top: 80px;
    height: 520px;
  }
  .dots {
    top: 90px;
    left: -60px;
    width: 240px;
    height: 240px;
  }
  .rings {
    top: 140px;
    right: -20px;
    width: 260px;
    height: 260px;
  }
  .aurora {
    opacity: 0.48;
  }
}
</style>
