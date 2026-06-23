<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '../../stores/useBuilderStore';

const store = useBuilderStore();

const selectedComponent = computed(() => 
  store.components.find(c => c.id === store.selectedComponentId)
);

const updateProp = (key: string, value: any) => {
  if (store.selectedComponentId) {
    store.updateComponentProps(store.selectedComponentId, { [key]: value });
  }
};
</script>

<template>
  <div class="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800">Properties</h2>
      <span v-if="selectedComponent" class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded uppercase font-bold tracking-wider">
        {{ selectedComponent.type }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="!selectedComponent" class="text-center text-gray-500 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p>Select a component to edit its properties.</p>
      </div>

      <div v-else class="space-y-5">
        <!-- Common Properties -->
        <div class="space-y-2" v-if="'text' in selectedComponent.props">
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            :value="selectedComponent.props.text"
            @input="e => updateProp('text', (e.target as HTMLTextAreaElement).value)"
          ></textarea>
        </div>

        <div class="space-y-2" v-if="'url' in selectedComponent.props">
          <label class="block text-sm font-medium text-gray-700">URL / Link</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            :value="selectedComponent.props.url"
            @input="e => updateProp('url', (e.target as HTMLInputElement).value)"
          />
        </div>

        <div class="space-y-2" v-if="'alignment' in selectedComponent.props">
          <label class="block text-sm font-medium text-gray-700">Alignment</label>
          <div class="flex rounded-md shadow-sm">
            <button
              v-for="align in ['left', 'center', 'right']"
              :key="align"
              class="flex-1 px-3 py-1.5 text-sm border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px hover:bg-gray-50 focus:z-10 focus:ring-1 focus:ring-blue-500"
              :class="selectedComponent.props.alignment === align ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' : 'bg-white text-gray-700'"
              @click="updateProp('alignment', align)"
            >
              <span class="capitalize">{{ align }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-2" v-if="'color' in selectedComponent.props">
          <label class="block text-sm font-medium text-gray-700">Text Color</label>
          <div class="flex items-center gap-3">
             <input
              type="color"
              class="h-8 w-14 rounded cursor-pointer"
              :value="selectedComponent.props.color"
              @input="e => updateProp('color', (e.target as HTMLInputElement).value)"
            />
            <span class="text-sm font-mono text-gray-500">{{ selectedComponent.props.color }}</span>
          </div>
        </div>

        <!-- Specific Properties -->
        <div class="space-y-2" v-if="selectedComponent.type === 'heading'">
          <label class="block text-sm font-medium text-gray-700">Heading Level</label>
          <select
            class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            :value="selectedComponent.props.level"
            @change="e => updateProp('level', (e.target as HTMLSelectElement).value)"
          >
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
            <option value="h5">Heading 5 (H5)</option>
            <option value="h6">Heading 6 (H6)</option>
          </select>
        </div>

        <div class="space-y-2" v-if="selectedComponent.type === 'button'">
          <label class="block text-sm font-medium text-gray-700">Button Style</label>
          <select
            class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            :value="selectedComponent.props.variant"
            @change="e => updateProp('variant', (e.target as HTMLSelectElement).value)"
          >
            <option value="primary">Primary (Solid)</option>
            <option value="secondary">Secondary (Light)</option>
            <option value="outline">Outline</option>
          </select>
        </div>

        <div class="space-y-2" v-if="selectedComponent.type === 'image'">
          <label class="block text-sm font-medium text-gray-700">Image Width</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 100%, 300px"
            :value="selectedComponent.props.width"
            @input="e => updateProp('width', (e.target as HTMLInputElement).value)"
          />
        </div>

      </div>
    </div>
  </div>
</template>
