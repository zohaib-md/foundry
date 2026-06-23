<script setup lang="ts">
import { computed } from 'vue';
import type { BuilderComponent } from '../../types/builder';
import HeadingElement from '../elements/HeadingElement.vue';
import TextElement from '../elements/TextElement.vue';
import ButtonElement from '../elements/ButtonElement.vue';
import ImageElement from '../elements/ImageElement.vue';

const props = defineProps<{
  component: BuilderComponent;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
  (e: 'remove'): void;
}>();

const componentMap = {
  heading: HeadingElement,
  text: TextElement,
  button: ButtonElement,
  image: ImageElement,
};

const dynamicComponent = computed(() => componentMap[props.component.type]);
</script>

<template>
  <div
    class="relative group cursor-pointer p-4 outline-2 outline-transparent hover:outline-blue-300 transition-all rounded-md"
    :class="{ '!outline-blue-500 bg-blue-50/50': isSelected }"
    @click.stop="emit('select')"
  >
    <!-- Delete button (visible on hover or select) -->
    <div
      v-show="isSelected"
      class="absolute -top-3 -right-3 z-10"
    >
      <button
        @click.stop="emit('remove')"
        class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md"
        title="Remove Component"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Drag handle (visible on hover) -->
    <div
      v-show="isSelected"
      class="drag-handle absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-200 text-gray-500 p-1 px-2 rounded shadow-md cursor-grab active:cursor-grabbing"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
      </svg>
    </div>

    <!-- Render the actual content -->
    <component
      :is="dynamicComponent"
      :props="component.props"
    />
  </div>
</template>
