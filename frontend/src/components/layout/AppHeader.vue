<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { navegacion } from '../../data/site';
import AppLogo from '../ui/AppLogo.vue';
import { useAuthStore } from '../../stores/auth';
import { useUiStore } from '../../stores/ui';
import AppHeaderMobile from './AppHeaderMobile.vue';

const auth = useAuthStore();
const ui = useUiStore();
const route = useRoute();
const router = useRouter();

async function salir(): Promise<void> {
  await auth.logout();
  if (route.path.startsWith('/admin')) router.push('/');
}
</script>

<template>
  <header class="header">
    <div class="bar">
      <RouterLink to="/" class="brand" aria-label="FarmApp, ir al inicio">
        <AppLogo :size="34" />
        <span>FarmApp</span>
      </RouterLink>

      <nav class="desktop" aria-label="Navegación principal">
        <RouterLink v-for="item in navegacion" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="actions">
        <button
          type="button"
          class="theme-toggle"
          :aria-label="ui.isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          @click="ui.toggleTheme"
        >
          <svg v-if="ui.isDark" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <span v-if="auth.user" class="user-name">{{ auth.user.nombres }}</span>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="panel">Panel</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login" class="login">Ingresar</RouterLink>
        <button v-else class="login" type="button" @click="salir">Salir</button>

        <AppHeaderMobile />
      </div>
    </div>
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
  height: 64px;
  padding: 0 12px 0 16px;
  border-radius: 12px;
  background: rgba(255, 252, 245, 0.94);
  border: 1px solid rgba(22, 36, 29, 0.16);
  box-shadow: 0 2px 0 rgba(22, 36, 29, 0.04), 0 10px 30px -20px rgba(22, 36, 29, 0.45);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

[data-theme="dark"] .bar {
  background: rgba(17, 30, 25, 0.94);
  border-color: rgba(242, 239, 228, 0.16);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: -0.025em;
  color: var(--ink);
  flex-shrink: 0;
}

.brand :deep(.app-logo),
.brand img {
  width: 34px;
  height: 34px;
}

.desktop {
  display: flex;
  align-items: center;
  gap: 2px;
}

.desktop a {
  position: relative;
  min-height: 44px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: color 0.18s, background-color 0.18s;
}

.desktop a:hover {
  color: var(--verde-deep);
  background: rgba(31, 107, 79, 0.06);
}

.desktop a.router-link-active {
  color: var(--verde-deep);
  font-weight: 700;
  background: transparent;
  box-shadow: none;
}

.desktop a.router-link-active::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  height: 2px;
  border-radius: 2px;
  background: var(--verde);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.theme-toggle {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border-radius: 9px;
  border: 1px solid rgba(22, 36, 29, 0.16);
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  transition: background-color 0.18s, border-color 0.18s, color 0.18s;
}

.theme-toggle:hover {
  background: rgba(31, 107, 79, 0.08);
  border-color: rgba(31, 107, 79, 0.4);
  color: var(--verde-deep);
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
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1px solid rgba(31, 107, 79, 0.3);
  background: rgba(31, 107, 79, 0.08);
  color: var(--verde-deep);
  font-size: 0.84rem;
  font-weight: 700;
  transition: background-color 0.18s, border-color 0.18s;
}

.panel:hover {
  background: rgba(31, 107, 79, 0.14);
  border-color: rgba(31, 107, 79, 0.5);
}

.login {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border: 1px solid var(--verde-deep);
  border-radius: 9px;
  background: var(--verde);
  color: var(--sobre-acento);
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.18s, transform 0.18s var(--ease);
}

.login:hover {
  background: var(--verde-deep);
  transform: translateY(-1px);
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
}

@media (max-width: 680px) {
  .user-name,
  .panel,
  .login {
    display: none;
  }
  .bar {
    padding: 0 8px 0 12px;
    gap: 8px;
    height: 58px;
  }
}

@media (max-width: 420px) {
  .brand {
    font-size: 1.1rem;
    gap: 8px;
  }
}
</style>
