<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: { placeholder?: string; buttonText?: string };
  styles?: ComponentStyles;
}>();

const wrapperStyles = computed(() => ({
  display: 'flex',
  width: props.styles?.width || '100%',
  gap: '8px',
  flexDirection: (props.styles?.flexDirection as 'row' | 'column') || 'row',
}));
</script>

<template>
  <div :style="wrapperStyles" class="foundry-newsletter">
    <input
      type="email"
      :placeholder="props.props.placeholder || 'Enter your email'"
      class="nl-input"
      readonly
    />
    <button class="nl-button" tabindex="-1">
      {{ props.props.buttonText || 'Subscribe' }}
    </button>
  </div>
</template>

<style scoped>
.foundry-newsletter {
  align-items: stretch;
}

.nl-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--theme-color-text-primary, #171717);
  background: var(--theme-color-surface, #FFFFFF);
  border: 1px solid var(--theme-color-border, #E5E5E5);
  border-radius: var(--theme-radius, 6px);
  outline: none;
}

.nl-button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: white;
  background: var(--theme-color-primary, #1D4ED8);
  border: none;
  border-radius: var(--theme-radius, 6px);
  cursor: default;
}

@media (max-width: 480px) {
  .foundry-newsletter[style*="flex-direction: row"] {
    flex-direction: column !important;
  }
}
</style>
