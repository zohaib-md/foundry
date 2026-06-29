<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentStyles } from '../../types/builder';
import { useDesignSystem } from '../../composables/useDesignSystem';

const props = defineProps<{
  props: { placeholder?: string; type?: string; value?: string };
  styles?: ComponentStyles;
}>();

const { resolveColor } = useDesignSystem();

const computedStyles = computed(() => ({
  width: props.styles?.width || '100%',
  padding: props.styles?.padding || '10px 14px',
  fontSize: props.styles?.fontSize || '14px',
  fontFamily: props.styles?.fontFamily ? `var(--theme-font-${props.styles.fontFamily})` : 'inherit',
  color: resolveColor(props.styles?.color) || 'var(--theme-color-text-primary, #171717)',
  backgroundColor: resolveColor(props.styles?.backgroundColor) || 'var(--theme-color-surface, #FFFFFF)',
  border: `1px solid ${resolveColor('border') || '#E5E5E5'}`,
  borderRadius: props.styles?.borderRadius || 'var(--theme-radius, 6px)',
  outline: 'none',
}));
</script>

<template>
  <input
    :type="props.props.type || 'text'"
    :placeholder="props.props.placeholder || 'Enter text...'"
    :value="props.props.value"
    :style="computedStyles"
    class="foundry-input"
    readonly
  />
</template>

<style scoped>
.foundry-input {
  box-sizing: border-box;
  transition: border-color var(--transition-fast);
}

.foundry-input:focus {
  border-color: var(--color-accent);
}
</style>
