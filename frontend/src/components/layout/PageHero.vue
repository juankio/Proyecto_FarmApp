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
  <section
    class="surface surface--raised page-hero"
    :class="{ compact, centered, 'has-media': Boolean($slots.media) }"
  >
    <div class="glow" aria-hidden="true" />

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
  grid-template-columns: 1.12fr 0.88fr;
  align-items: center;
  gap: clamp(28px, 5vw, 64px);
  padding: clamp(38px, 5.4vw, 84px);
  border-radius: var(--radius-lg);
}

.page-hero.centered,
.page-hero:not(.has-media) {
  grid-template-columns: 1fr;
  text-align: center;
  max-width: 1040px;
  margin-inline: auto;
}

.page-hero:not(.has-media) .copy {
  align-items: center;
}

.page-hero.compact {
  padding: clamp(26px, 4vw, 52px);
}

.glow {
  position: absolute;
  top: -140px;
  right: -90px;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle, rgba(90, 200, 250, 0.55), transparent 68%);
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.page-hero.centered .copy {
  align-items: center;
}

h1 {
  font-size: clamp(2.3rem, 5.2vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.052em;
  line-height: 1.02;
  max-width: 17ch;
  background: linear-gradient(180deg, #ffffff 20%, #cfd9ec 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-hero.centered h1,
.page-hero:not(.has-media) h1 {
  max-width: 22ch;
}

.lede {
  font-size: clamp(1rem, 1.5vw, 1.16rem);
  color: var(--muted);
  max-width: 56ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.media {
  position: relative;
  z-index: 2;
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
  .glow {
    right: -30%;
  }
}
</style>
