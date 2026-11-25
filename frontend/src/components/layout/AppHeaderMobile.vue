<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { navegacion } from '../../data/site';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const abierto = ref(false);

async function salir(): Promise<void> {
  await auth.logout();
  abierto.value = false;
  if (route.path.startsWith('/admin')) router.push('/');
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && abierto.value) {
    abierto.value = false;
  }
}

watch(
  () => route.fullPath,
  () => {
    abierto.value = false;
  },
);

watch(abierto, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);
  } else {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeydown);
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <button
    class="burger"
    type="button"
    :aria-expanded="abierto"
    :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
    @click="abierto = !abierto"
  >
    <span :class="{ open: abierto }" />
  </button>

  <Teleport to="body">
    <Transition name="mobile-backdrop">
      <div
        v-if="abierto"
        class="mobile-backdrop"
        aria-hidden="true"
        @click="abierto = false"
      />
    </Transition>

    <Transition name="mobile-drawer">
      <nav
        v-if="abierto"
        class="mobile-drawer"
        aria-label="Navegación móvil"
      >
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-title">Menú de navegación</span>
          <button
            type="button"
            class="mobile-close-btn"
            aria-label="Cerrar menú"
            @click="abierto = false"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="mobile-drawer-links">
          <RouterLink
            v-for="item in navegacion"
            :key="item.to"
            :to="item.to"
            class="mobile-link"
          >
            {{ item.label }}
          </RouterLink>
          <RouterLink to="/encuesta" class="mobile-link">Encuesta</RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="mobile-link mobile-link--admin">
            Panel de administración
          </RouterLink>
        </div>

        <div class="mobile-drawer-footer">
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/login" class="mobile-action-btn mobile-action-btn--primary">
              Iniciar sesión
            </RouterLink>
            <RouterLink to="/registro" class="mobile-action-btn mobile-action-btn--secondary">
              Crear cuenta
            </RouterLink>
          </template>
          <template v-else>
            <div class="mobile-user-card">
              <span class="mobile-user-avatar">
                {{ (auth.user?.nombres?.[0] || 'U').toUpperCase() }}
              </span>
              <div class="mobile-user-meta">
                <span class="mobile-user-name">{{ auth.user?.nombres }} {{ auth.user?.apellidos }}</span>
                <small class="mobile-user-email">{{ auth.user?.email }}</small>
              </div>
            </div>
            <button type="button" class="mobile-logout-btn" @click="salir">
              Cerrar sesión
            </button>
          </template>
        </div>
      </nav>
    </Transition>
  </Teleport>
</template>

<style scoped>
.burger {
  display: none;
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
  cursor: pointer;
  transition:
    background 0.22s,
    transform 0.24s var(--spring),
    border-color 0.22s,
    box-shadow 0.22s;
}

.burger:hover {
  background: var(--glass-control-bg-hover);
  border-color: var(--glass-control-border-hover);
  box-shadow: var(--glass-control-shadow-hover);
  transform: translateY(-1px);
}

[data-theme="light"] .burger {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: inset 0 1px 0 #ffffff, 0 2px 6px -2px rgba(15, 23, 42, 0.04);
  color: var(--ink);
}

[data-theme="light"] .burger:hover {
  background: rgba(10, 132, 255, 0.12);
  border-color: rgba(10, 132, 255, 0.3);
  box-shadow: inset 0 1px 0 #ffffff, 0 4px 14px -3px rgba(10, 132, 255, 0.2);
  color: #0062cc;
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

/* Backdrop */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(2, 4, 10, 0.72);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

[data-theme="light"] .mobile-backdrop {
  background: rgba(15, 23, 42, 0.45);
}

/* Floating Drawer (100% opaco, fondo sólido para evitar confusión con el contenido) */
.mobile-drawer {
  position: fixed;
  top: 86px;
  left: clamp(12px, 3vw, 24px);
  right: clamp(12px, 3vw, 24px);
  max-width: 480px;
  margin-inline: auto;
  max-height: calc(100dvh - 104px);
  overflow-y: auto;
  overscroll-behavior: contain;
  z-index: 1060;
  display: flex;
  flex-direction: column;
  padding: 18px;
  border-radius: 24px;
  background: var(--bg-0);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 24px 64px -12px rgba(0, 0, 0, 0.9),
    0 8px 24px -4px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .mobile-drawer {
  background: #ffffff !important;
  border: 1px solid rgba(15, 23, 42, 0.12) !important;
  box-shadow:
    0 24px 60px -12px rgba(15, 23, 42, 0.22),
    0 8px 20px -4px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 #ffffff !important;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px 12px;
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 10px;
}

[data-theme="light"] .mobile-drawer-header {
  border-bottom-color: rgba(15, 23, 42, 0.08);
}

.mobile-drawer-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.mobile-close-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--ink);
}

[data-theme="light"] .mobile-close-btn {
  background: #f1f5f9;
  border-color: rgba(15, 23, 42, 0.12);
  color: #475569;
}

[data-theme="light"] .mobile-close-btn:hover {
  background: #e2e8f0;
  color: #0b1220;
}

.mobile-drawer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  display: flex;
  align-items: center;
  min-height: 46px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  background: var(--nav-active-bg);
  color: var(--nav-active-color);
  font-weight: 600;
  transform: translateX(2px);
}

[data-theme="light"] .mobile-link {
  color: #1e293b;
}

[data-theme="light"] .mobile-link:hover {
  background: rgba(10, 132, 255, 0.08);
  color: #0062cc;
}

[data-theme="light"] .mobile-link.router-link-active {
  background: rgba(10, 132, 255, 0.12);
  color: #0062cc !important;
}

.mobile-link--admin {
  color: var(--aqua);
  font-weight: 600;
}

[data-theme="light"] .mobile-link--admin {
  color: #0284c7;
}

.mobile-drawer-footer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

[data-theme="light"] .mobile-drawer-footer {
  border-top-color: rgba(15, 23, 42, 0.08);
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.94rem;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s var(--spring), box-shadow 0.2s;
}

.mobile-action-btn--primary {
  background: var(--verde);
  color: var(--sobre-acento);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px -6px rgba(10, 132, 255, 0.6);
}

.mobile-action-btn--secondary {
  background: var(--bg-2);
  color: var(--ink);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

[data-theme="light"] .mobile-action-btn--secondary {
  background: #f1f5f9;
  color: var(--ink);
  border: 1px solid rgba(15, 23, 42, 0.12);
}

.mobile-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--bg-2);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="light"] .mobile-user-card {
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.mobile-user-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--verde);
  color: var(--sobre-acento);
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.mobile-user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-user-email {
  font-size: 0.78rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-logout-btn {
  min-height: 42px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 59, 48, 0.12);
  color: #ff453a;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.mobile-logout-btn:hover {
  background: rgba(255, 59, 48, 0.2);
}

/* Transitions */
.mobile-backdrop-enter-active,
.mobile-backdrop-leave-active {
  transition: opacity 0.24s ease;
}

.mobile-backdrop-enter-from,
.mobile-backdrop-leave-to {
  opacity: 0;
}

.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition: opacity 0.26s ease, transform 0.32s var(--spring);
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.97);
}

@media (max-width: 980px) {
  .burger {
    display: grid;
  }
}
</style>