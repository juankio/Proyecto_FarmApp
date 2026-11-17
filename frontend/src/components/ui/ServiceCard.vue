<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>();
</script>

<template>
  <article class="service glass">
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
  gap: 12px;
  padding: 26px;
  border-radius: var(--radius);
  background: var(--glass);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--depth-sm);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.service:hover {
  transform: translateY(-5px);
  box-shadow: var(--inset), var(--depth);
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.16), rgba(90, 200, 250, 0.08));
  border: 1px solid rgba(10, 132, 255, 0.2);
  color: var(--blue-deep);
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
  font-size: 1.06rem;
  margin-top: 2px;
}

p {
  font-size: 0.9rem;
}
</style>
