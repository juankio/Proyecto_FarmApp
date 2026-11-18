<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    lede?: string;
    compact?: boolean;
    centered?: boolean;
  }>(),
  { compact: false, centered: false },
);
</script>

<template>
  <section class="page-hero" :class="{ compact, centered, 'has-media': Boolean($slots.media) }">
    <div class="glow glow-a" />
    <div class="glow glow-b" />

    <div class="copy">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h1>{{ title }}</h1>
      <p v-if="lede" class="lede">{{ lede }}</p>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.media" class="media">
      <slot name="media" />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: clamp(28px, 5vw, 64px);
  padding: clamp(36px, 5.4vw, 76px);
  border-radius: var(--radius-xl);
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(255, 255, 255, 0.72), transparent 58%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.22));
  -webkit-backdrop-filter: blur(30px) saturate(190%);
  backdrop-filter: blur(30px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--inset), var(--depth-lg);
}

.page-hero.centered,
.page-hero:not(.has-media) {
  grid-template-columns: 1fr;
  text-align: center;
  max-width: 1000px;
  margin-inline: auto;
}

.page-hero:not(.has-media) .copy {
  align-items: center;
}

.page-hero.compact {
  padding: clamp(30px, 4vw, 54px);
}

.page-hero::after {
  content: '';
  position: absolute;
  inset: -40% -60%;
  z-index: 0;
  background: linear-gradient(
    105deg,
    transparent 42%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 58%
  );
  transform: translate3d(-90%, 0, 0) rotate(6deg);
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .page-hero::after {
    animation: hero-sheen 15s ease-in-out infinite;
  }
}

@keyframes hero-sheen {
  0%,
  62% {
    transform: translate3d(-90%, 0, 0) rotate(6deg);
    opacity: 0;
  }
  72% {
    opacity: 0.55;
  }
  100% {
    transform: translate3d(90%, 0, 0) rotate(6deg);
    opacity: 0;
  }
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.6;
  z-index: -1;
  pointer-events: none;
}

.glow-a {
  width: 380px;
  height: 380px;
  top: -140px;
  right: -60px;
  background: radial-gradient(circle, rgba(90, 200, 250, 0.7), transparent 68%);
}

.glow-b {
  width: 320px;
  height: 320px;
  bottom: -160px;
  left: -80px;
  background: radial-gradient(circle, rgba(185, 168, 255, 0.6), transparent 68%);
}

@media (prefers-reduced-motion: no-preference) {
  .glow-a {
    animation: glow-drift-a 18s ease-in-out infinite alternate;
  }
  .glow-b {
    animation: glow-drift-b 22s ease-in-out infinite alternate;
  }
}

@keyframes glow-drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-34px, 26px, 0) scale(1.12);
  }
}

@keyframes glow-drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.04);
  }
  to {
    transform: translate3d(28px, -22px, 0) scale(0.94);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  position: relative;
  z-index: 1;
}

.page-hero.centered .copy {
  align-items: center;
}

h1 {
  font-size: clamp(2.1rem, 5vw, 3.7rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.03;
  max-width: 18ch;
}

.page-hero.centered h1,
.page-hero:not(.has-media) h1 {
  max-width: 22ch;
}

.lede {
  font-size: clamp(1rem, 1.5vw, 1.14rem);
  color: var(--muted);
  max-width: 56ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}

.media {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-width: 0;
}

@media (max-width: 900px) {
  .page-hero,
  .page-hero.has-media {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .copy {
    align-items: center;
  }
  .actions {
    justify-content: center;
  }
  h1 {
    max-width: 22ch;
  }
}
</style>
