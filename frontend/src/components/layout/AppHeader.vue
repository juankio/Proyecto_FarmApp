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
    <div class="bar glass glass--bright">
      <RouterLink to="/" class="brand" aria-label="FarmApp, ir al inicio">
        <AppLogo :size="32" />
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
  top: 14px;
  z-index: 1000;
  width: var(--shell);
  margin: 14px auto 0;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  height: 66px;
  padding: 0 12px 0 18px;
  border-radius: 22px;
}

[data-theme="light"] .bar {
  background: rgba(255, 255, 255, 0.82) !important;
  border: 1px solid rgba(255, 255, 255, 0.95) !important;
  box-shadow:
    inset 0 1px 0 #ffffff,
    0 8px 24px -6px rgba(10, 132, 255, 0.08),
    0 2px 6px -2px rgba(15, 23, 42, 0.04) !important;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.24rem;
  letter-spacing: -0.045em;
  color: var(--ink);
  flex-shrink: 0;
}

.brand :deep(.app-logo),
.brand img {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 6px 16px rgba(10, 132, 255, 0.5));
}

[data-theme="light"] .brand :deep(.app-logo),
[data-theme="light"] .brand img {
  filter: drop-shadow(0 4px 12px rgba(0, 102, 255, 0.35));
}

.desktop {
  display: flex;
  align-items: center;
  gap: 2px;
}

.desktop a {
  min-height: 44px;
  padding: 12px 14px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: background 0.22s, color 0.22s, box-shadow 0.22s;
}

.desktop a:hover {
  background: var(--nav-hover-bg);
  color: var(--ink);
}

.desktop a.router-link-active {
  background: var(--nav-active-bg);
  color: var(--nav-active-color);
  font-weight: 600;
  box-shadow: inset 0 1px 0 var(--nav-active-border);
}

[data-theme="light"] .desktop a.router-link-active {
  background: rgba(10, 132, 255, 0.14);
  color: #0062cc !important;
  box-shadow: inset 0 1px 0 rgba(10, 132, 255, 0.25);
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
  border-radius: 12px;
  border: 1px solid var(--glass-control-border);
  background: var(--glass-control-bg);
  box-shadow: var(--glass-control-shadow);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: var(--ink);
  cursor: pointer;
  transition:
    background 0.22s,
    transform 0.24s var(--spring),
    border-color 0.22s,
    box-shadow 0.22s,
    color 0.22s;
}

.theme-toggle:hover {
  background: var(--glass-control-bg-hover);
  border-color: var(--glass-control-border-hover);
  box-shadow: var(--glass-control-shadow-hover);
  color: var(--blue-bright);
  transform: translateY(-1px);
}

[data-theme="light"] .theme-toggle,
[data-theme="light"] .panel {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: inset 0 1px 0 #ffffff, 0 2px 6px -2px rgba(15, 23, 42, 0.04);
  color: var(--ink);
}

[data-theme="light"] .theme-toggle:hover,
[data-theme="light"] .panel:hover {
  background: rgba(10, 132, 255, 0.12);
  border-color: rgba(10, 132, 255, 0.3);
  box-shadow: inset 0 1px 0 #ffffff, 0 4px 14px -3px rgba(10, 132, 255, 0.2);
  color: #0062cc;
}

[data-theme="light"] .login {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 8px 20px -6px rgba(10, 132, 255, 0.45);
}

[data-theme="light"] .login:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 12px 26px -8px rgba(10, 132, 255, 0.6);
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
  border: 1px solid var(--glass-control-border);
  background: var(--glass-control-bg);
  box-shadow: var(--glass-control-shadow);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: var(--ink-soft);
  font-size: 0.84rem;
  font-weight: 600;
  transition:
    background 0.22s,
    transform 0.24s var(--spring),
    border-color 0.22s,
    box-shadow 0.22s,
    color 0.22s;
}

.panel:hover {
  background: var(--glass-control-bg-hover);
  border-color: var(--glass-control-border-hover);
  box-shadow: var(--glass-control-shadow-hover);
  color: var(--ink);
  transform: translateY(-1px);
}

.login {
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 12px;
  background: linear-gradient(150deg, #3d9bff, var(--blue-deep));
  color: #fff;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 12px 26px -12px rgba(10, 132, 255, 0.85);
  transition: transform 0.24s var(--spring), box-shadow 0.24s var(--ease);
}

.login:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 18px 34px -14px rgba(10, 132, 255, 1);
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
    padding: 0 10px 0 14px;
    gap: 8px;
  }
}

@media (max-width: 420px) {
  .brand {
    font-size: 1.12rem;
    gap: 8px;
  }
}
</style>
