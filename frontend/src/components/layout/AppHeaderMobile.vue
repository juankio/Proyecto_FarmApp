<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { navegacion } from '../../data/site';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const route = useRoute();
const abierto = ref(false);

watch(
  () => route.fullPath,
  () => {
    abierto.value = false;
  },
);
</script>

<template>
  <button
    class="burger"
    type="button"
    :aria-expanded="abierto"
    aria-label="Abrir menú"
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
      <div v-if="auth.user" class="mobile-user">
        <span>{{ auth.user.nombres }} {{ auth.user.apellidos }}</span>
        <small>{{ auth.user.email }}</small>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.burger {
  display: none;
  place-items: center;
  width: 42px;
  height: 42px;
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
  .burger {
    display: grid;
  }
  .mobile {
    display: flex;
  }
}
</style>
