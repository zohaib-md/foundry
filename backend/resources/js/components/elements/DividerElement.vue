<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: { style?: 'solid' | 'dashed' | 'dotted'; color?: string; thickness?: string };
  styles?: ComponentStyles;
}>();

const dividerStyles = computed(() => ({
  borderTop: `${props.props.thickness || '1px'} ${props.props.style || 'solid'} ${props.props.color || 'var(--theme-color-border, #E5E5E5)'}`,
  width: '100%',
  margin: '8px 0',
}));
</script>

<template>
  <hr :style="dividerStyles" class="foundry-divider" />
</template>

<style scoped>
.foundry-divider {
  border: none;
  display: block;
}
</style>
