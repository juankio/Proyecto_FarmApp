<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { navegacion } from '../../data/site';
import { LOGO_URL } from '../../data/logo';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const abierto = ref(false);

watch(
  () => route.fullPath,
  () => {
    abierto.value = false;
  },
);

function salir(): void {
  auth.logout();
  abierto.value = false;
  if (route.path.startsWith('/admin')) router.push('/');
}
</script>

<template>
  <header class="header">
    <div class="bar glass">
      <RouterLink to="/" class="brand" aria-label="FarmApp, ir al inicio">
        <img :src="LOGO_URL" alt="Logo de FarmApp" />
        <span>FarmApp</span>
      </RouterLink>

      <nav class="desktop" aria-label="Navegación principal">
        <RouterLink v-for="item in navegacion" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="actions">
        <span v-if="auth.user" class="user-name">{{ auth.user.nombres }}</span>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="panel">Panel</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login" class="login">Ingresar</RouterLink>
        <button v-else class="login" type="button" @click="salir">Salir</button>

        <button
          class="burger"
          type="button"
          :aria-expanded="abierto"
          aria-label="Abrir menú"
          @click="abierto = !abierto"
        >
          <span :class="{ open: abierto }" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <nav v-if="abierto" class="mobile glass" aria-label="Navegación móvil">
        <RouterLink v-for="item in navegacion" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin">Panel de administración</RouterLink>
        <RouterLink to="/encuesta">Encuesta</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/registro">Crear cuenta</RouterLink>
        <div v-if="auth.user" class="mobile-user">
          <span>{{ auth.user.nombres }} {{ auth.user.apellidos }}</span>
          <small>{{ auth.user.email }}</small>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 12px;
  z-index: 1000;
  width: var(--shell);
  margin: 12px auto 0;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  height: 66px;
  padding: 0 14px 0 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(26px) saturate(190%);
  backdrop-filter: blur(26px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: var(--inset), 0 12px 34px -18px rgba(8, 47, 77, 0.42);
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 1.24rem;
  letter-spacing: -0.04em;
  color: var(--ink);
  flex-shrink: 0;
}

.brand img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.desktop {
  display: flex;
  align-items: center;
  gap: 2px;
}

.desktop a {
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 550;
  color: var(--ink-soft);
  transition: background 0.2s, color 0.2s;
}

.desktop a:hover {
  background: rgba(255, 255, 255, 0.75);
  color: var(--ink);
}

.desktop a.router-link-active {
  background: rgba(10, 132, 255, 0.12);
  color: var(--blue-deep);
  font-weight: 650;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.user-name {
  display: none;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.panel {
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid rgba(12, 74, 112, 0.14);
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink-soft);
  font-size: 0.84rem;
  font-weight: 650;
  transition: background 0.2s, transform 0.2s var(--ease);
}

.panel:hover {
  background: #fff;
  transform: translateY(-1px);
}

.login {
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background: linear-gradient(150deg, #2396ff, var(--blue-deep));
  color: #fff;
  font-size: 0.86rem;
  font-weight: 650;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 10px 22px -12px rgba(0, 98, 204, 0.8);
  transition: transform 0.2s var(--ease);
}

.login:hover {
  transform: translateY(-1px);
}

.burger {
  display: none;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(12, 74, 112, 0.1);
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.burger span,
.burger span::before,
.burger span::after {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transition: transform 0.28s var(--ease), opacity 0.2s;
  content: '';
}

.burger span {
  position: relative;
}

.burger span::before {
  position: absolute;
  top: -6px;
}

.burger span::after {
  position: absolute;
  top: 6px;
}

.burger span.open {
  background: transparent;
}

.burger span.open::before {
  transform: translateY(6px) rotate(45deg);
}

.burger span.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile {
  display: none;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  -webkit-backdrop-filter: blur(26px);
  backdrop-filter: blur(26px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--inset), 0 20px 44px -22px rgba(8, 47, 77, 0.5);
}

.mobile a {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 550;
  font-size: 0.95rem;
  color: var(--ink);
}

.mobile a:hover,
.mobile a.router-link-active {
  background: rgba(10, 132, 255, 0.1);
  color: var(--blue-deep);
}

.mobile-user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  padding: 12px 14px;
  border-top: 1px solid rgba(12, 74, 112, 0.1);
}

.mobile-user span {
  font-size: 0.88rem;
  font-weight: 650;
}

.mobile-user small {
  font-size: 0.76rem;
  color: var(--muted);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.22s ease, transform 0.24s var(--ease);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 1180px) {
  .user-name {
    display: block;
  }
}

@media (max-width: 980px) {
  .desktop {
    display: none;
  }
  .burger {
    display: grid;
  }
  .mobile {
    display: flex;
  }
}

@media (max-width: 420px) {
  .brand span {
    display: none;
  }
  .login {
    padding: 10px 14px;
  }
  .panel {
    padding: 10px 12px;
  }
}
</style>
