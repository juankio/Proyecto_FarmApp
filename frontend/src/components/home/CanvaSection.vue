<script setup lang="ts">
import AppButton from '../ui/AppButton.vue';
import { site } from '../../data/site';
</script>

<template>
  <section class="section reveal">
    <div class="canva">
      <div class="canva-copy">
        <span class="eyebrow">Presentación</span>
        <h2>Descubre nuestra presentación en Canva</h2>
        <p>
          Explora más sobre FarmApp a través de nuestra presentación interactiva en Canva. ¡Haz clic
          en el botón y conócenos mejor!
        </p>
      </div>
      <a :href="site.canva" target="_blank" rel="noopener">
        <AppButton size="lg">Ver presentación</AppButton>
      </a>
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
