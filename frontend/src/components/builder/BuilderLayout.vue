<script setup lang="ts">
import BuilderSidebar from './BuilderSidebar.vue';
import BuilderCanvas from './BuilderCanvas.vue';
import PropertyEditor from './PropertyEditor.vue';
import { useBuilderStore } from '../../stores/useBuilderStore';

const store = useBuilderStore();

const emit = defineEmits<{
  (e: 'save'): void;
}>();
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 font-sans text-gray-900">
    
    <!-- Topbar -->
    <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold">PB</div>
        <h1 class="font-semibold text-gray-800">Page Builder POC</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <router-link
          to="/preview"
          class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Preview Mode
        </router-link>
        <button
          @click="emit('save')"
          class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
        >
          Save Page
        </button>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar (Components) -->
      <BuilderSidebar @add="(type) => store.addComponent(type)" />
      
      <!-- Center Canvas -->
      <BuilderCanvas />
      
      <!-- Right Sidebar (Properties) -->
      <PropertyEditor />
    </div>

  </div>
</template>
