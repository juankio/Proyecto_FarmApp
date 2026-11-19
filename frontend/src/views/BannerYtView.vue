<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';

const enlaces = [
  { titulo: 'Vademécum', texto: 'Consulta medicamentos y sus indicaciones.', to: '/servicios' },
  { titulo: 'Droguerías', texto: 'Ubica las droguerías más cercanas a ti.', to: '/servicios' },
  { titulo: 'Feria', texto: 'Descubre las empresas y sus productos.', to: '/feria' },
];
</script>

<template>
  <section class="banner reveal">
    <div class="capa">
      <span class="eyebrow">Nuestros servicios</span>
      <h1>Lea, aprenda y conozca más sobre nosotros</h1>
      <p>
        Un vistazo rápido a todo lo que FarmApp pone a tu disposición para cuidar tu salud y la de
        tu familia.
      </p>
      <div class="actions">
        <RouterLink to="/servicios"><AppButton size="lg">Leer más</AppButton></RouterLink>
        <RouterLink to="/feria"><AppButton size="lg" variant="light">Ver feria</AppButton></RouterLink>
      </div>
    </div>
  </section>

  <section class="section reveal">
    <div class="grid grid-3">
      <AppCard v-for="e in enlaces" :key="e.titulo" hover>
        <h3>{{ e.titulo }}</h3>
        <p>{{ e.texto }}</p>
        <RouterLink :to="e.to" class="link-inline">Ir ahora →</RouterLink>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.banner {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 520px;
  padding: clamp(36px, 6vw, 80px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(90% 120% at 20% 0%, rgba(255, 255, 255, 0.24), transparent 60%),
    linear-gradient(150deg, rgba(6, 36, 60, 0.92), rgba(10, 90, 140, 0.82)),
    linear-gradient(120deg, #0a84ff, #5ac8fa);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: var(--inset), var(--shadow-md);
}

.banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../assets/bg-dots.svg');
  background-size: 240px 240px;
  opacity: 0.25;
  pointer-events: none;
}

.capa {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  max-width: 760px;
}

.eyebrow {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.24);
  color: #dff4ff;
}

h1 {
  color: #fff;
  font-size: clamp(2rem, 5vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.045em;
}

p {
  color: rgba(234, 246, 251, 0.8);
  font-size: 1.05rem;
  max-width: 60ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.link-inline {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--aqua);
}
</style>
