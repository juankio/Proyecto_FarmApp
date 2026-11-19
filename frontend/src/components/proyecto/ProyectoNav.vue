<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Proyecto } from '../../data/proyectos';

defineProps<{ anterior: Proyecto; siguiente: Proyecto }>();
</script>

<template>
  <section class="section reveal">
    <div class="nav-projects">
      <RouterLink :to="`/proyectos/${anterior.slug}`" class="nav-card glass">
        <span>← Anterior</span>
        <strong>{{ anterior.producto }}</strong>
      </RouterLink>
      <RouterLink :to="`/proyectos/${siguiente.slug}`" class="nav-card glass right">
        <span>Siguiente →</span>
        <strong>{{ siguiente.producto }}</strong>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.nav-projects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 22px 24px;
  border-radius: var(--radius-md);
  background: var(--glass-strong);
  transition: transform 0.25s var(--ease);
}

.nav-card:hover {
  transform: translateY(-3px);
}

.nav-card.right {
  text-align: right;
}

.nav-card span {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--aqua);
}

.nav-card strong {
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

@media (max-width: 640px) {
  .nav-projects {
    grid-template-columns: 1fr;
  }
}
</style>