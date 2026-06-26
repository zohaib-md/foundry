<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps, ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: ButtonProps;
  styles?: ComponentStyles;
}>();

const variantClasses = computed(() => {
  switch (props.props.variant) {
    case 'primary': return 'btn-primary';
    case 'secondary': return 'btn-secondary';
    case 'outline': return 'btn-outline';
    default: return 'btn-primary';
  }
});

const wrapperStyles = computed(() => {
  return {
    textAlign: props.styles?.textAlign || props.props.alignment,
  };
});

const buttonStyles = computed(() => {
  return {
    color: props.styles?.color,
    fontFamily: props.styles?.fontFamily ? `"${props.styles.fontFamily}", var(--font-ui)` : undefined,
    fontSize: props.styles?.fontSize || '14px',
    fontWeight: props.styles?.fontWeight || '500',
  };
});
</script>

<template>
  <div :style="wrapperStyles">
    <a
      :href="props.props.url"
      class="foundry-btn"
      :class="variantClasses"
      :style="buttonStyles"
      @click.prevent
    >
      {{ props.props.text }}
    </a>
  </div>
</template>

<style scoped>
.foundry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-primary {
  background: var(--color-text-primary);
  color: var(--color-text-inverse) !important;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary) !important;
}

.btn-secondary:hover {
  background: var(--color-border-light);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-text-primary);
  color: var(--color-text-primary) !important;
}

.btn-outline:hover {
  background: var(--color-text-primary);
  color: var(--color-text-inverse) !important;
}
</style>
