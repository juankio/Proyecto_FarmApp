<script setup lang="ts">
import { computed } from 'vue';
import AppSurface from '../ui/AppSurface.vue';
import AppLogo from '../ui/AppLogo.vue';
import { drogueriasVillavicencio } from '../../data/droguerias';

// 6 droguerías de Villavicencio orbitando en la constelación visual
const destacadas = computed(() => drogueriasVillavicencio.slice(0, 6));
</script>

<template>
  <div class="visual">
    <div class="halo" />
    <div class="halo-core" />
    <div class="halo-ring" />

    <!-- Núcleo central con el logo de FarmApp -->
    <div class="logo-wrapper">
      <AppLogo :size="160" class="hero-logo" />
    </div>

    <!-- Droguerías de Villavicencio orbitando con acceso interactivo -->
    <RouterLink
      v-for="(drog, idx) in destacadas"
      :key="drog.id"
      to="/ubicaciones"
      class="float-badge"
      :class="`pos-${idx}`"
      :title="`Ver ${drog.nombre}`"
      :aria-label="`Ver ${drog.nombre}`"
    >
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <div class="badge-content">
        <span class="badge-title">{{ drog.cadena }}</span>
        <span class="badge-subtitle">{{ drog.barrio }} • {{ drog.es24h ? '24H' : 'Domicilio' }}</span>
      </div>
    </RouterLink>

    <!-- Indicador inferior de cobertura local -->
    <AppSurface tone="glass" radius="999px" class="chip">
      <span class="dot" />
      <span>Droguerías en Villavicencio • Cobertura Local</span>
    </AppSurface>
  </div>
</template>

<style scoped>
.visual {
  position: relative;
  width: min(100%, 480px);
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  margin-inline: auto;
}

/* Fondo halo con rico contraste y resplandor en modo claro y oscuro */
.halo {
  position: absolute;
  inset: -6%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(10, 132, 255, 0.45) 0%,
    rgba(0, 180, 255, 0.22) 42%,
    rgba(117, 251, 253, 0.12) 65%,
    transparent 76%
  );
  filter: blur(28px);
  pointer-events: none;
}

[data-theme="light"] .halo {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 102, 255, 0.38) 0%,
    rgba(10, 132, 255, 0.24) 40%,
    rgba(56, 189, 248, 0.14) 65%,
    transparent 78%
  );
  filter: blur(24px);
}

.halo-core {
  position: absolute;
  width: 56%;
  height: 56%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(10, 132, 255, 0.32) 0%,
    rgba(90, 200, 250, 0.15) 55%,
    transparent 72%
  );
  filter: blur(14px);
  pointer-events: none;
}

[data-theme="light"] .halo-core {
  background: radial-gradient(
    circle,
    rgba(0, 98, 204, 0.42) 0%,
    rgba(10, 132, 255, 0.22) 55%,
    transparent 72%
  );
  filter: blur(14px);
}

.halo-ring {
  position: absolute;
  inset: 13%;
  border-radius: 50%;
  border: 1px dashed rgba(140, 210, 255, 0.22);
  pointer-events: none;
  animation: spin-slow 50s linear infinite;
}

[data-theme="light"] .halo-ring {
  border-color: rgba(0, 102, 255, 0.22);
  box-shadow: inset 0 0 36px rgba(0, 102, 255, 0.06);
}

/* Núcleo central del logo */
.logo-wrapper {
  position: relative;
  width: 36%;
  max-width: 170px;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  z-index: 2;
  animation: float-main 7s ease-in-out infinite;
}

.hero-logo {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 20px 42px rgba(10, 132, 255, 0.55));
}

[data-theme="light"] .hero-logo {
  filter: drop-shadow(0 18px 36px rgba(0, 85, 212, 0.42));
}

/* Badges flotantes de las empresas */
.float-badge {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 7px;
  border-radius: 999px;
  text-decoration: none;
  background: rgba(18, 26, 44, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.float-badge:hover {
  transform: translateY(-4px) scale(1.06);
  border-color: rgba(117, 251, 253, 0.5);
  box-shadow:
    0 14px 30px -4px rgba(10, 132, 255, 0.35),
    0 0 16px rgba(117, 251, 253, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

[data-theme="light"] .float-badge {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 102, 255, 0.18);
  box-shadow: 0 10px 24px -4px rgba(10, 132, 255, 0.12), inset 0 1px 0 #ffffff;
}

[data-theme="light"] .float-badge:hover {
  transform: translateY(-4px) scale(1.06);
  border-color: rgba(0, 102, 255, 0.45);
  box-shadow:
    0 14px 28px -4px rgba(0, 102, 255, 0.24),
    0 0 12px rgba(0, 102, 255, 0.15),
    inset 0 1px 0 #ffffff;
}

/* Posiciones simétricas en constelación alrededor del logo central */
.pos-0 {
  top: 3%;
  left: 0%;
  animation: float-a 7s ease-in-out infinite 0s;
}

.pos-1 {
  top: 3%;
  right: 0%;
  animation: float-b 6.6s ease-in-out infinite -1.8s;
}

.pos-2 {
  top: 38%;
  right: -4%;
  animation: float-a 7.4s ease-in-out infinite -3.2s;
}

.pos-3 {
  bottom: 8%;
  right: 1%;
  animation: float-b 6.8s ease-in-out infinite -4.5s;
}

.pos-4 {
  bottom: 8%;
  left: 1%;
  animation: float-a 6.4s ease-in-out infinite -2.2s;
}

.pos-5 {
  top: 38%;
  left: -4%;
  animation: float-b 7.2s ease-in-out infinite -5s;
}

.badge-icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  overflow: hidden;
}

[data-theme="light"] .badge-icon {
  background: rgba(240, 246, 255, 0.95);
  border-color: rgba(0, 102, 255, 0.15);
}

.badge-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.badge-content {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: left;
}

.badge-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}

[data-theme="light"] .badge-title {
  color: #0f172a;
}

.badge-subtitle {
  font-size: 0.64rem;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
}

[data-theme="light"] .badge-subtitle {
  color: #64748b;
}

/* Chip inferior */
.chip {
  position: absolute;
  bottom: -4%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--ink-soft);
  z-index: 4;
  white-space: nowrap;
}

[data-theme="light"] .chip {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(0, 102, 255, 0.16);
  box-shadow: 0 8px 20px -4px rgba(10, 132, 255, 0.1), inset 0 1px 0 #ffffff;
  color: #334155;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 0 4px rgba(126, 224, 192, 0.22);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes float-main {
  0%,
  100% {
    transform: translateY(0) rotate(-0.5deg);
  }
  50% {
    transform: translateY(-10px) rotate(0.8deg);
  }
}

@keyframes float-a {
  0%,
  100% {
    transform: translateY(0) rotate(-0.8deg);
  }
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes float-b {
  0%,
  100% {
    transform: translateY(0) rotate(0.8deg);
  }
  50% {
    transform: translateY(-9px) rotate(-1deg);
  }
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
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
  .logo-wrapper,
  .float-badge {
    animation: none;
  }
  .visual {
    width: min(100%, 380px);
  }
}

@media (max-width: 440px) {
  .badge-content {
    display: none;
  }
  .float-badge {
    padding: 6px;
    border-radius: 50%;
  }
  .badge-icon {
    width: 30px;
    height: 30px;
    min-width: 30px;
  }
  .badge-icon img {
    width: 22px;
    height: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-wrapper,
  .float-badge,
  .halo-ring,
  .dot {
    animation: none !important;
  }
}
</style>
