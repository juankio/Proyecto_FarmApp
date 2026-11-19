<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>();
</script>

<template>
  <article class="surface surface--glass service">
    <span class="icon-wrap">
      <svg class="lg-icon" viewBox="0 0 24 24" aria-hidden="true">
        <template v-if="icon === 'pill'">
          <rect x="2.8" y="8" width="18.4" height="8" rx="4" transform="rotate(-35 12 12)" />
          <path d="M12 5.5v13" />
        </template>
        <template v-else-if="icon === 'pin'">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </template>
        <template v-else-if="icon === 'spark'">
          <path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" />
        </template>
        <template v-else-if="icon === 'mega'">
          <path d="M3 11v2a2 2 0 0 0 2 2h2l6 4V5L7 9H5a2 2 0 0 0-2 2Z" />
          <path d="M17 9a4 4 0 0 1 0 6" />
        </template>
        <template v-else-if="icon === 'chat'">
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1-5a8 8 0 1 1 17-6Z" />
          <path d="M9 12h.01M13 12h.01M17 12h.01" />
        </template>
      </svg>
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
  border-radius: var(--radius-md);
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

[data-theme="light"] .icon-wrap {
  background: linear-gradient(145deg, rgba(10, 132, 255, 0.12), rgba(90, 200, 250, 0.1));
  border-color: rgba(10, 132, 255, 0.2);
  color: #0284c7;
  box-shadow: inset 0 1px 0 #ffffff;
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
