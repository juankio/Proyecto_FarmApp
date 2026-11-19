<script setup lang="ts">
import AppSurface from '../ui/AppSurface.vue';
import { LOGO_URL } from '../../data/logo';
import { useProyectosStore } from '../../stores/proyectos';
import { optimizarCloudinary } from '../../utils/imagen';

const store = useProyectosStore();
const exfolpiel = store.getBySlug('exfolpiel')!;
const selene = store.getBySlug('selene')!;
</script>

<template>
  <div class="visual">
    <div class="halo" />
    <img class="hero-logo" :src="optimizarCloudinary(LOGO_URL, 400)" alt="Logo de FarmApp" />
    <AppSurface tone="glass" radius="20px" class="float float-a">
      <img :src="optimizarCloudinary(exfolpiel.logo, 128)" :alt="exfolpiel.producto" />
      <span>{{ exfolpiel.producto }}</span>
    </AppSurface>
    <AppSurface tone="glass" radius="20px" class="float float-b">
      <img :src="optimizarCloudinary(selene.logo, 128)" :alt="selene.producto" />
      <span>{{ selene.producto }}</span>
    </AppSurface>
    <AppSurface tone="glass" radius="999px" class="chip">
      <span class="dot" />
      Información actualizada
    </AppSurface>
  </div>
</template>

<style scoped>
.visual {
  position: relative;
  width: min(100%, 480px);
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
}

.halo {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    rgba(140, 210, 255, 0.5),
    rgba(90, 200, 250, 0.22) 48%,
    transparent 72%
  );
  filter: blur(18px);
}

.hero-logo {
  position: relative;
  width: 44%;
  max-width: 200px;
  filter: drop-shadow(0 26px 44px rgba(10, 132, 255, 0.5));
  animation: float 7s ease-in-out infinite;
}

.float {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 12px 14px;
  border-radius: 20px;
  animation: float 9s ease-in-out infinite;
}

.float img {
  width: 62px;
  height: 62px;
  object-fit: contain;
}

.float span {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.float-a {
  top: 3%;
  left: -3%;
  animation-delay: -2s;
}

.float-b {
  bottom: 5%;
  right: -3%;
  animation-delay: -4s;
}

.chip {
  position: absolute;
  bottom: 15%;
  left: 3%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 0 4px rgba(126, 224, 192, 0.22);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-12px) rotate(1deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

@media (max-width: 560px) {
  .float-a {
    left: -4%;
  }
  .float-b {
    right: -4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-logo,
  .float,
  .dot {
    animation: none;
  }
}
</style>
