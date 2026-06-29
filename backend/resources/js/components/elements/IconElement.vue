<script setup lang="ts">
import { computed } from 'vue';
import { useDesignSystem } from '../../composables/useDesignSystem';
import type { ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: { icon?: string; size?: string; color?: string; customPath?: string };
  styles?: ComponentStyles;
}>();

const { resolveColor } = useDesignSystem();

// A curated set of common SVG icons
const iconPaths: Record<string, string> = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  check: 'M20 6L9 17l-5-5',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  zap: 'M13 2L3 14h9l-1 10 10-12h-9l1-10z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
};

const currentIcon = computed(() => props.props.icon || 'star');
const iconPath = computed(() => {
  if (currentIcon.value === 'custom') {
    return props.props.customPath || '';
  }
  return iconPaths[currentIcon.value] || iconPaths.star;
});
const iconSize = computed(() => props.props.size || '32px');

const iconStyles = computed(() => ({
  width: iconSize.value,
  height: iconSize.value,
  color: resolveColor(props.props.color) || 'var(--theme-color-accent, #3B82F6)',
}));
</script>

<template>
  <div class="foundry-icon" :style="{ textAlign: props.styles?.textAlign || 'center' }">
    <svg :style="iconStyles" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path :d="iconPath" />
    </svg>
  </div>
</template>

<style scoped>
.foundry-icon {
  display: flex;
  justify-content: center;
}

.foundry-icon[style*="left"] {
  justify-content: flex-start;
}

.foundry-icon[style*="right"] {
  justify-content: flex-end;
}
</style>
