<script setup lang="ts">
import { RouterLink } from 'vue-router';

withDefaults(
  defineProps<{
    src: string;
    title: string;
    text?: string;
    alt?: string;
    to?: string;
    href?: string;
    ratio?: 'wide' | 'square' | 'tall';
    fit?: 'cover' | 'contain';
    badge?: string;
  }>(),
  { ratio: 'wide', fit: 'cover' },
);
</script>

<template>
  <component
    :is="to ? RouterLink : href ? 'a' : 'div'"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener' : undefined"
    class="tile glass"
  >
    <div class="thumb" :class="[ratio, fit]">
      <img :src="src" :alt="alt ?? title" loading="lazy" />
      <span v-if="badge" class="badge">{{ badge }}</span>
    </div>
    <div class="body">
      <h3>{{ title }}</h3>
      <p v-if="text">{{ text }}</p>
      <span class="more" aria-hidden="true">Ver más <i>→</i></span>
    </div>
  </component>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  overflow: hidden;
  isolation: isolate;
  background: var(--glass);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--line);
  box-shadow: var(--inset), var(--depth);
  transition: transform 0.32s var(--ease), box-shadow 0.32s var(--ease);
  cursor: pointer;
}

.tile:hover {
  transform: translateY(-6px);
  box-shadow: var(--inset), var(--depth-lg);
}

.thumb {
  position: relative;
  width: 100%;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.72), rgba(230, 245, 252, 0.5));
  overflow: hidden;
}

.thumb img {
  width: 100%;
  height: 100%;
  transition: transform 0.5s var(--ease);
}

.tile:hover .thumb img {
  transform: scale(1.045);
}

.thumb.cover img {
  object-fit: cover;
}

.thumb.contain img {
  object-fit: contain;
  padding: 14px;
}

.thumb.wide {
  aspect-ratio: 16 / 10;
}

.thumb.square {
  aspect-ratio: 1 / 1;
}

.thumb.tall {
  aspect-ratio: 3 / 4;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.9);
  color: var(--blue-deep);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 22px 22px;
  flex: 1;
}

h3 {
  font-size: 1.08rem;
  font-weight: 700;
}

p {
  font-size: 0.9rem;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more {
  margin-top: auto;
  padding-top: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue-deep);
  opacity: 0.85;
}

.more i {
  font-style: normal;
  display: inline-block;
  transition: transform 0.25s var(--ease);
}

.tile:hover .more i {
  transform: translateX(4px);
}
</style>
