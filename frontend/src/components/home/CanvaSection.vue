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
  background:
    radial-gradient(120% 160% at 90% 0%, rgba(90, 200, 250, 0.4), transparent 60%),
    linear-gradient(150deg, rgba(8, 47, 77, 0.92), rgba(10, 90, 140, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), var(--shadow-md);
}

.canva-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 64ch;
}

.canva .eyebrow {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.22);
  color: #dff4ff;
  width: fit-content;
}

.canva h2,
.canva p {
  color: #fff;
}

.canva p {
  color: rgba(234, 246, 251, 0.78);
}

@media (max-width: 900px) {
  .canva {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
