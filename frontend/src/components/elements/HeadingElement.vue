<script setup lang="ts">
import { computed } from 'vue';
import type { HeadingProps } from '../../types/builder';

const props = defineProps<{ props: HeadingProps }>();

const classMap: Record<string, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
};

const Tag = computed(() => props.props.level);
</script>

<template>
  <component
    :is="Tag"
    :class="classMap[props.props.level]"
    :style="{ textAlign: props.props.alignment, color: props.props.color }"
  >
    {{ props.props.text }}
  </component>
</template>
