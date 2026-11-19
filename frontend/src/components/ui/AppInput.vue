<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  error?: string | boolean;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    class="app-input"
    :class="{ 'app-input--error': !!error }"
    :id="id"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    :autocomplete="autocomplete"
    :name="name"
    :disabled="disabled"
    :aria-invalid="error ? 'true' : undefined"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.app-input {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.055);
  color: var(--ink);
  font-size: 0.96rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.app-input::placeholder {
  color: var(--muted-2);
}

.app-input:focus {
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.085);
  box-shadow:
    0 0 0 4px rgba(10, 132, 255, 0.18),
    0 0 24px -6px rgba(10, 132, 255, 0.55);
}

.app-input:focus-visible {
  outline: 2px solid var(--aqua);
  outline-offset: 2px;
}

.app-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-input--error {
  border-color: #ff7a7a;
}

.app-input__error {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #ffb3b3;
}

select.app-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2393a4c0' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 42px;
}
</style>
