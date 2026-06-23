<script setup lang="ts">
import type { ImageProps } from '../../types/builder';

const props = defineProps<{ props: ImageProps }>();
</script>

<template>
  <div :style="{ textAlign: props.props.alignment }">
    <img
      :src="props.props.url"
      :alt="props.props.altText"
      :style="{ width: props.props.width, maxWidth: '100%' }"
      class="inline-block object-cover"
    />
  </div>
</template>
