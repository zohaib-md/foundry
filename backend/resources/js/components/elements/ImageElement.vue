<script setup lang="ts">
import { computed } from 'vue';
import type { ImageProps, ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: ImageProps;
  styles?: ComponentStyles;
}>();

const wrapperStyles = computed(() => {
  return {
    textAlign: props.styles?.textAlign || props.props.alignment,
  };
});
</script>

<template>
  <div :style="wrapperStyles">
    <img
      :src="props.props.url"
      :alt="props.props.altText"
      :style="{ width: props.props.width }"
      class="foundry-img"
    />
  </div>
</template>

<style scoped>
.foundry-img {
  display: inline-block;
  max-width: 100%;
  object-fit: cover;
  border-radius: var(--theme-radius, var(--radius-md));
}
</style>
