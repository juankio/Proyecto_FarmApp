<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppButton from '../ui/AppButton.vue';
</script>

<template>
  <section class="section reveal">
    <div class="canva">
      <div class="canva-copy">
        <span class="eyebrow">Red de Farmacias</span>
        <h2>¿Administras una droguería en Villavicencio?</h2>
        <p>
          Únete al directorio de FarmApp. Permite que los habitantes de tu barrio encuentren tus medicamentos,
          comparen tus precios competitivos y te hagan pedidos directamente a tu línea de WhatsApp.
        </p>
      </div>
      <RouterLink to="/contactos">
        <AppButton size="lg">Afiliar mi droguería</AppButton>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.canva {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: clamp(28px, 4vw, 50px);
  border-radius: var(--radius-lg);
  background: var(--glass);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--shadow-md);
}

.canva-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 64ch;
}

.canva .eyebrow {
  background: var(--line-soft);
  border-color: var(--line);
  color: var(--aqua);
  width: fit-content;
}

.canva h2 {
  color: var(--ink);
}

.canva p {
  color: var(--muted);
}

@media (max-width: 900px) {
  .canva {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
