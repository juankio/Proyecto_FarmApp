<script setup lang="ts">
defineProps<{
  value: string;
  error?: string;
}>();
</script>

<template>
  <div class="display">
    <span class="expr">{{ value || '0' }}</span>
    <span v-if="error" class="err">{{ error }}</span>
  </div>
</template>

<style scoped>
.display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 108px;
  padding: 18px;
  margin-bottom: 18px;
  border-radius: 18px;
  background:
    radial-gradient(120% 140% at 80% 0%, rgba(90, 200, 250, 0.22), transparent 60%),
    linear-gradient(160deg, rgba(10, 24, 46, 0.9), rgba(6, 12, 26, 0.92));
  border: 1px solid var(--line);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 18px 40px -24px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.expr {
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
  word-break: break-all;
  text-align: right;
  line-height: 1.15;
}

.err {
  font-size: 0.78rem;
  color: #ffb4b4;
  margin-top: 6px;
}
</style>