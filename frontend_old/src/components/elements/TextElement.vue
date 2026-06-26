<script setup lang="ts">
import { computed } from 'vue';
import type { TextProps, ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: TextProps;
  styles?: ComponentStyles;
}>();

const computedStyles = computed(() => {
  return {
    textAlign: props.styles?.textAlign || props.props.alignment,
    color: props.styles?.color || props.props.color,
    fontFamily: props.styles?.fontFamily ? `"${props.styles.fontFamily}", var(--font-ui)` : undefined,
    fontSize: props.styles?.fontSize || '16px',
    fontWeight: props.styles?.fontWeight || '400',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '0',
  };
});
</script>

<template>
  <p :style="computedStyles">
    {{ props.props.text }}
  </p>
</template>
