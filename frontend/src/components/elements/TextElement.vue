<script setup lang="ts">
import type { TextProps } from '../../types/builder';

const props = defineProps<{ props: TextProps }>();
</script>

<template>
  <p
    class="text-base"
    :style="{ textAlign: props.props.alignment, color: props.props.color }"
  >
    {{ props.props.text }}
  </p>
</template>
