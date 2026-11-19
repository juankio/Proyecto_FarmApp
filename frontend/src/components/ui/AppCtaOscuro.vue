<script setup lang="ts">
import AppCard from './AppCard.vue';

defineProps<{
  eyebrow?: string;
  title?: string;
  description?: string;
}>();
</script>

<template>
  <AppCard tone="dark" class="cta">
    <div class="cta-glow" aria-hidden="true" />
    <div class="cta-copy">
      <span v-if="eyebrow" class="cta-eyebrow">{{ eyebrow }}</span>
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="cta-actions">
      <slot name="actions" />
    </div>
  </AppCard>
</template>

<style scoped>
.cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: clamp(28px, 4vw, 52px);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 160% at 88% 0%, rgba(90, 200, 250, 0.22), transparent 58%),
    radial-gradient(90% 120% at 0% 100%, rgba(139, 92, 246, 0.2), transparent 60%),
    var(--glass-dark);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: var(--inset), var(--glow-blue);
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: -40%;
  right: -6%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(90, 200, 250, 0.34), transparent 68%);
  filter: blur(50px);
  pointer-events: none;
}

.cta-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 62ch;
}

.cta-eyebrow {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--aqua);
}

.cta h2,
.cta p {
  color: #fff;
}

.cta p {
  color: rgba(226, 238, 252, 0.78);
}

.cta-actions {
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
