<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>();
</script>

<template>
  <article class="surface surface--glass service">
    <span class="icon-wrap">
      <svg class="lg-icon" viewBox="0 0 24 24" aria-hidden="true" v-html="icon" />
    </span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </article>
</template>

<style scoped>
.service {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 26px;
  border-radius: var(--radius);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.service:hover {
  transform: translateY(-6px);
  box-shadow: var(--inset), var(--glow-blue);
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.24), rgba(90, 200, 250, 0.1));
  border: 1px solid rgba(90, 200, 250, 0.3);
  color: var(--aqua);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.lg-icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: block;
}

h3 {
  font-size: 1.08rem;
  margin-top: 2px;
}

p {
  font-size: 0.9rem;
}
</style>
