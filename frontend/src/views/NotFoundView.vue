<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
</script>

<template>
  <section class="notfound">
    <AppCard class="card">
      <span class="code">404</span>
      <h1>Esta página no existe</h1>
      <p>Puede que el enlace haya cambiado o que la página se haya movido.</p>
      <div class="actions">
        <RouterLink to="/"><AppButton>Volver al inicio</AppButton></RouterLink>
        <RouterLink to="/servicios"><AppButton variant="secondary">Ver servicios</AppButton></RouterLink>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.notfound {
  display: grid;
  place-items: center;
  min-height: 60vh;
  padding: 30px 0;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 560px;
  padding: 54px 40px;
  text-align: center;
}

.code {
  font-size: clamp(3.4rem, 9vw, 5.4rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
  background: linear-gradient(140deg, var(--blue), var(--aqua));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h1 {
  font-size: 1.8rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 10px;
}
</style>
