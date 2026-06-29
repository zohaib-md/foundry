<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: { height?: string };
  styles?: ComponentStyles;
}>();

const spacerStyles = computed(() => ({
  height: props.styles?.minHeight || props.props.height || '40px',
  width: '100%',
}));
</script>

<template>
  <div :style="spacerStyles" class="foundry-spacer">
    <span class="spacer-label">{{ props.styles?.minHeight || props.props.height || '40px' }}</span>
  </div>
</template>

<style scoped>
.foundry-spacer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(0,0,0,0.02) 4px,
    rgba(0,0,0,0.02) 8px
  );
  border: 1px dashed var(--color-border);
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.spacer-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  background: var(--color-surface);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
}
</style>
