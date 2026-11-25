<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppLogo from '../components/ui/AppLogo.vue';
import { texto, valores } from '../data/informacion';
</script>

<template>
  <PageHero
    eyebrow="Nosotros"
    title="El origen de nuestro proyecto: una idea, un propósito y un esfuerzo conjunto"
    lede="FarmApp nació para resolver una necesidad real: acceder a información farmacéutica clara, confiable y cercana."
  >
    <template #actions>
      <AppButton size="lg" @click="$router.push('/servicios')">Ver servicios</AppButton>
    </template>

    <template #media>
      <div class="origin">
        <div class="ring" />
        <AppLogo :size="180" class="origin-logo" />
        <span class="pill blue">CódigoX · 2024</span>
      </div>
    </template>
  </PageHero>

  <section class="section reveal">
    <AppCard class="story">
      <p>{{ texto }}</p>
    </AppCard>
  </section>

  <section class="section reveal">
    <SectionHeader eyebrow="Lo que nos mueve" title="Nuestros valores" />
    <div class="grid grid-3">
      <AppCard v-for="v in valores" :key="v.titulo" hover>
        <h3>{{ v.titulo }}</h3>
        <p>{{ v.texto }}</p>
      </AppCard>
    </div>
  </section>

  <section class="section reveal">
    <AppCard tone="dark" class="cta">
      <div>
        <h2>¿Quieres saber más sobre FarmApp?</h2>
        <p>Escríbenos o explora nuestra presentación interactiva en Canva.</p>
      </div>
      <div class="actions">
        <RouterLink to="/contactos"><AppButton variant="light">Escríbenos</AppButton></RouterLink>
        <a href="https://farmapp.my.canva.site/presentacion-farmapp" target="_blank" rel="noopener">
          <AppButton variant="light">Ver presentación</AppButton>
        </a>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.origin {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 360px);
  aspect-ratio: 1 / 1;
}

.ring {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: radial-gradient(circle at 40% 35%, rgba(255, 255, 255, 0.3), rgba(90, 200, 250, 0.24) 60%, transparent 74%);
}

.origin :deep(.app-logo),
.origin img {
  position: relative;
  width: 54%;
  height: auto;
  filter: drop-shadow(0 22px 34px rgba(10, 132, 255, 0.45));
}

[data-theme="light"] .origin :deep(.app-logo),
[data-theme="light"] .origin img {
  filter: drop-shadow(0 18px 32px rgba(0, 102, 255, 0.35));
}

[data-theme="light"] .origin .ring {
  background: radial-gradient(
    circle at 40% 35%,
    rgba(10, 132, 255, 0.25),
    rgba(0, 102, 255, 0.14) 60%,
    transparent 74%
  );
}

.origin .pill {
  position: absolute;
  bottom: 8%;
}

.story p {
  font-size: 1.02rem;
  line-height: 1.85;
  color: var(--ink-soft);
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: clamp(28px, 4vw, 48px);
  border-radius: var(--radius-lg);
}

.cta h2 {
  color: var(--ink);
}

.cta p {
  color: var(--ink-soft);
  margin-top: 8px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 820px) {
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
