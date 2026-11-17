<script setup lang="ts">
defineProps<{ modelValue: string; type?: string; placeholder?: string; required?: boolean }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    class="app-input"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.app-input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid rgba(10, 132, 255, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--ink);
  font-size: 0.98rem;
  box-shadow: inset 0 1px 3px rgba(9, 62, 98, 0.06);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.app-input::placeholder { color: #7c95a6; }
.app-input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.16); }
</style>
