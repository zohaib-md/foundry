<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import CanvasComponent from './CanvasComponent.vue';
// @ts-ignore
import draggable from 'vuedraggable';

const store = useBuilderStore();

const components = computed({
  get: () => store.components,
  set: (val) => store.reorderComponents(val)
});
</script>

<template>
  <div class="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center" @click="store.selectComponent(null)">
    <!-- Canvas Area -->
    <div class="bg-white shadow-lg w-full max-w-4xl min-h-[800px] flex flex-col">
      <draggable
        v-model="components"
        group="canvas"
        item-key="id"
        class="flex-1 p-8 space-y-4 empty:border-2 empty:border-dashed empty:border-gray-300 empty:m-8 empty:rounded-lg empty:flex empty:items-center empty:justify-center relative"
        handle=".drag-handle"
        ghost-class="opacity-50"
      >
        <template #item="{ element }">
          <CanvasComponent
            :component="element"
            :is-selected="store.selectedComponentId === element.id"
            @select="store.selectComponent(element.id)"
            @remove="store.removeComponent(element.id)"
          />
        </template>
        
        <!-- Empty State Fallback -->
        <template v-if="components.length === 0" #footer>
           <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p>Add components from the sidebar</p>
           </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling to make the draggable area fill remaining space nicely */
</style>
