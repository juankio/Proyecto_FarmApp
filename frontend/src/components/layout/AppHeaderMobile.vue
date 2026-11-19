<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { navegacion } from '../../data/site';
import { useAuthStore } from '../../stores/auth';
import { useUiStore } from '../../stores/ui';

const auth = useAuthStore();
const ui = useUiStore();
const route = useRoute();
const router = useRouter();
const abierto = ref(false);

async function salir(): Promise<void> {
  await auth.logout();
  abierto.value = false;
  if (route.path.startsWith('/admin')) router.push('/');
}

watch(
  () => route.fullPath,
  () => {
    abierto.value = false;
  },
);
</script>

<template>
  <button
    type="button"
    class="theme-toggle-mobile"
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

  <button
    class="burger"
    type="button"
    :aria-expanded="abierto"
    :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
    @click="abierto = !abierto"
  >
    <span :class="{ open: abierto }" />
  </button>

  <Transition name="menu">
    <nav v-if="abierto" class="surface surface--raised mobile" aria-label="Navegación móvil">
      <RouterLink v-for="item in navegacion" :key="item.to" :to="item.to">
        {{ item.label }}
      </RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin">Panel de administración</RouterLink>
      <RouterLink to="/encuesta">Encuesta</RouterLink>
      <RouterLink v-if="!auth.isAuthenticated" to="/registro">Crear cuenta</RouterLink>
      <button v-if="auth.isAuthenticated" type="button" class="mobile-logout" @click="salir">Salir</button>
      <div v-if="auth.user" class="mobile-user">
        <span>{{ auth.user.nombres }} {{ auth.user.apellidos }}</span>
        <small>{{ auth.user.email }}</small>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.theme-toggle-mobile {
  display: none;
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

.theme-toggle-mobile:hover {
  background: var(--bg-3);
  border-color: var(--line);
  transform: translateY(-1px);
}

.burger {
  display: none;
  place-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
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
  transition: transform 0.3s var(--spring), opacity 0.2s;
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
  margin-top: 10px;
  padding: 12px;
  border-radius: 20px;
}

.mobile a {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--ink-soft);
  transition: background 0.2s, color 0.2s;
}

.mobile a:hover,
.mobile a.router-link-active {
  background: rgba(10, 132, 255, 0.16);
  color: #bcdcff;
}

.mobile-logout {
  margin-top: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.08);
  color: var(--ink);
  font-weight: 600;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
}

.mobile-logout:hover {
  background: rgba(255, 255, 255, 0.16);
}

.mobile-user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  padding: 12px 14px;
  border-top: 1px solid var(--line-soft);
}

.mobile-user span {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--ink);
}

.mobile-user small {
  font-size: 0.76rem;
  color: var(--muted);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.24s ease, transform 0.3s var(--spring);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
}

@media (max-width: 980px) {
  .theme-toggle-mobile {
    display: grid;
  }
  .burger {
    display: grid;
  }
  .mobile {
    display: flex;
  }
}
</style>
