<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { optimizarCloudinary } from '../../utils/imagen';

const props = withDefaults(
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

const srcOptimizada = computed(() => optimizarCloudinary(props.src, 1000));
</script>

<template>
  <component
    :is="to ? RouterLink : href ? 'a' : 'div'"
    :to="to"
    v-bind="href ? { href, target: '_blank', rel: 'noopener' } : {}"
    class="surface surface--glass tile"
  >
    <div class="thumb" :class="[ratio, fit]">
      <img :src="srcOptimizada" :alt="alt ?? title" width="600" height="600" loading="lazy" decoding="async" />
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
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.tile:hover {
  transform: translateY(-7px);
  box-shadow: var(--inset), var(--glow-blue);
}

.thumb {
  position: relative;
  width: 100%;
  background-color: var(--bg-1);
  background:
    radial-gradient(120% 120% at 20% 0%, rgba(90, 200, 250, 0.10), transparent 60%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--line);
  overflow: hidden;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s var(--ease);
}

.tile:hover .thumb img {
  transform: scale(1.05);
}

.thumb.cover img {
  object-fit: cover;
}

.thumb.contain img {
  object-fit: contain;
  padding: 16px;
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
  background: rgba(10, 132, 255, 0.18);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(90, 200, 250, 0.3);
  color: var(--aqua);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
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
  color: var(--aqua);
  opacity: 0.9;
}

.more i {
  font-style: normal;
  display: inline-block;
  transition: transform 0.3s var(--ease);
}

.tile:hover .more i {
  transform: translateX(5px);
}
</style>
