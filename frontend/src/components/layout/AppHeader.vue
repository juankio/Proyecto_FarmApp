<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { navegacion } from '../../data/site';
import { LOGO_URL } from '../../data/logo';
import { useAuthStore } from '../../stores/auth';
import { useUiStore } from '../../stores/ui';
import { optimizarCloudinary } from '../../utils/imagen';
import AppHeaderMobile from './AppHeaderMobile.vue';

const auth = useAuthStore();
const ui = useUiStore();
const route = useRoute();
const router = useRouter();

const logoSrc = optimizarCloudinary(LOGO_URL, 128);

async function salir(): Promise<void> {
  await auth.logout();
  if (route.path.startsWith('/admin')) router.push('/');
}
</script>

<template>
  <header class="header">
    <div class="bar glass glass--bright">
      <RouterLink to="/" class="brand" aria-label="FarmApp, ir al inicio">
        <img :src="logoSrc" alt="Logo de FarmApp" width="32" height="32" />
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

.brand img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(10, 132, 255, 0.5));
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
  background: rgba(255, 255, 255, 0.1);
  color: var(--ink);
}

.desktop a.router-link-active {
  background: linear-gradient(150deg, rgba(61, 155, 255, 0.28), rgba(10, 132, 255, 0.18));
  color: #bcdcff;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
  border: 1px solid var(--line);
  background: var(--bg-2);
  color: var(--ink);
  cursor: pointer;
  transition: background 0.22s, transform 0.24s var(--spring), border-color 0.22s;
}

.theme-toggle:hover {
  background: var(--bg-3);
  border-color: var(--line);
  transform: translateY(-1px);
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
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
  color: var(--ink-soft);
  font-size: 0.84rem;
  font-weight: 600;
  transition: background 0.22s, transform 0.24s var(--spring), border-color 0.22s;
}

.panel:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
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
