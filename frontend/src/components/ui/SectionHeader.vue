<script setup lang="ts">
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lede?: string; left?: boolean }>(),
  { left: false },
);
</script>

<template>
  <header class="section-head" :class="{ left }">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
    <p v-if="lede" class="lede">{{ lede }}</p>
    <slot />
  </header>
</template>
