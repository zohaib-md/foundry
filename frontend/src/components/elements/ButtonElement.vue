<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from '../../types/builder';

const props = defineProps<{ props: ButtonProps }>();

const variantClasses = computed(() => {
  switch (props.props.variant) {
    case 'primary': return 'bg-blue-600 text-white hover:bg-blue-700';
    case 'secondary': return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
    case 'outline': return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
    default: return 'bg-blue-600 text-white';
  }
});
</script>

<template>
  <div :style="{ textAlign: props.props.alignment }">
    <a
      :href="props.props.url"
      class="inline-block px-6 py-3 rounded-md font-medium transition-colors cursor-pointer"
      :class="variantClasses"
      @click.prevent
    >
      {{ props.props.text }}
    </a>
  </div>
</template>
