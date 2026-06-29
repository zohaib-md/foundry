<script setup lang="ts">
import { computed } from 'vue';
import type { TextProps, ComponentStyles } from '../../types/builder';
import { useDesignSystem } from '../../composables/useDesignSystem';

const props = defineProps<{
  props: TextProps;
  styles?: ComponentStyles;
}>();

const { resolveColor, resolveFont } = useDesignSystem();

const computedStyles = computed(() => {
  return {
    textAlign: props.styles?.textAlign || props.props.alignment,
    color: resolveColor(props.styles?.color || props.props.color),
    fontFamily: resolveFont(props.styles?.fontFamily),
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
