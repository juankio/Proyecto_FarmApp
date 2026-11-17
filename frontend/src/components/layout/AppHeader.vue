<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
</script>

<template>
  <header class="glass-header">
    <div class="inner">
      <RouterLink to="/" class="brand">
        <svg class="heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12h4l2.5-6 4 12 2.5-6H22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>FarmApp</span>
      </RouterLink>

      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/servicios">Servicios</RouterLink>
        <RouterLink to="/feria">Feria</RouterLink>
        <RouterLink to="/contactos">Contacto</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login" class="accent">Ingresar</RouterLink>
        <button v-else class="accent" @click="auth.logout()">Salir</button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.glass-header {
  position: sticky;
  top: 14px;
  z-index: 1000;
  width: var(--shell);
  margin: 14px auto 0;
  height: 62px;
  border-radius: 20px;
  background: var(--glass-strong);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), 0 8px 30px rgba(0, 0, 0, 0.06);
}
.inner { height: 100%; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 1.3rem; letter-spacing: -0.03em; color: var(--ink); }
.heart { width: 22px; height: 22px; color: var(--blue); }
nav { display: flex; align-items: center; gap: 4px; }
nav a, nav button { padding: 9px 16px; border-radius: 999px; font-size: 0.88rem; font-weight: 600; color: var(--ink); border: 0; background: transparent; cursor: pointer; transition: background .2s, transform .2s; }
nav a:hover, nav button:hover { background: rgba(255,255,255,.6); transform: translateY(-1px); }
nav .accent { background: var(--blue); color: #fff; box-shadow: 0 8px 20px rgba(0,98,204,.25); }
nav .accent:hover { background: var(--blue-deep); }
@media (max-width: 767px) { nav a:not(.accent) { display: none; } }
</style>
