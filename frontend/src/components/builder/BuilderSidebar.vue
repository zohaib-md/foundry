<script setup lang="ts">
import type { ComponentType } from '../../types/builder';

const emit = defineEmits<{
  (e: 'add', type: ComponentType): void;
}>();

const blocks: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'button', label: 'Button', icon: 'B' },
  { type: 'image', label: 'Image', icon: 'I' },
];
</script>

<template>
  <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Components</h2>
      <p class="text-xs text-gray-500 mt-1">Click to add to canvas</p>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="block in blocks"
        :key="block.type"
        @click="emit('add', block.type)"
        class="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <div class="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold font-mono">
          {{ block.icon }}
        </div>
        <span class="font-medium text-gray-700">{{ block.label }}</span>
      </div>
    </div>
  </div>
</template>
