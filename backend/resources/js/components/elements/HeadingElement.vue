<script setup lang="ts">
import { computed } from 'vue';
import type { HeadingProps, ComponentStyles } from '../../types/builder';
import { useDesignSystem } from '../../composables/useDesignSystem';

const props = defineProps<{
  props: HeadingProps;
  styles?: ComponentStyles;
}>();

const classMap: Record<string, string> = {
  h1: 'text-5xl font-bold tracking-tight',
  h2: 'text-4xl font-bold tracking-tight',
  h3: 'text-3xl font-semibold',
  h4: 'text-2xl font-semibold',
  h5: 'text-xl font-medium',
  h6: 'text-lg font-medium',
};

const Tag = computed(() => props.props.level);

const { resolveColor, resolveFont } = useDesignSystem();

const computedStyles = computed(() => {
  return {
    textAlign: props.styles?.textAlign || props.props.alignment,
    color: resolveColor(props.styles?.color || props.props.color),
    fontFamily: resolveFont(props.styles?.fontFamily),
    fontSize: props.styles?.fontSize || (props.props.level === 'h1' ? '40px' : props.props.level === 'h2' ? '32px' : '24px'),
    fontWeight: props.styles?.fontWeight,
    lineHeight: props.styles?.fontSize ? '1.2' : undefined,
    marginTop: '0',
    marginBottom: '0',
  };
});
</script>

<template>
  <component
    :is="Tag"
    :class="classMap[props.props.level]"
    :style="computedStyles"
  >
    {{ props.props.text }}
  </component>
</template>
