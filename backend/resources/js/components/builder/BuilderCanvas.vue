<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { useBuilderStore } from '../../stores/useBuilderStore';
import CanvasComponent from './CanvasComponent.vue';
// @ts-ignore
import draggable from 'vuedraggable';
import type { DeviceMode } from '../../types/builder';

const props = defineProps<{
  deviceMode: DeviceMode;
}>();

const store = useBuilderStore();

const components = computed({
  get: () => store.components,
  set: (val) => store.reorderComponents(val)
});

const canvasWidth = computed(() => {
  switch (props.deviceMode) {
    case 'mobile': return '375px';
    case 'tablet': return '768px';
    case 'desktop': default: return '100%';
  }
});

const isDraggingFile = ref(false);
let dragCounter = 0; // Prevent flicker when dragging over child elements

const handleDragEnter = (e: DragEvent) => {
  if (e.dataTransfer?.types.includes('Files')) {
    dragCounter++;
    isDraggingFile.value = true;
  }
};

const handleDragOver = (e: DragEvent) => {
  if (e.dataTransfer?.types.includes('Files')) {
    e.dataTransfer.dropEffect = 'copy';
  }
};

const handleDragLeave = (e: DragEvent) => {
  if (e.dataTransfer?.types.includes('Files')) {
    dragCounter--;
    if (dragCounter === 0) {
      isDraggingFile.value = false;
    }
  }
};

const handleDrop = async (e: DragEvent) => {
  dragCounter = 0;
  isDraggingFile.value = false;
  
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    alert('Please drop an image file.');
    return;
  }
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.url) {
      // Add the image component to the store
      store.addComponent('image', undefined, undefined, { url: response.data.url });
    }
  } catch (error) {
    console.error('Upload failed', error);
    alert('Failed to upload image.');
  }
};
</script>

<template>
  <div 
    class="workspace" 
    @click="store.selectComponent(null)"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Overlay for file drag -->
    <div v-if="isDraggingFile" class="file-drop-overlay">
      <div class="overlay-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <h2>Drop Image to Upload</h2>
      </div>
    </div>
    <div class="canvas-container" :style="{ maxWidth: canvasWidth }">
      <div class="canvas-page">
        <draggable
          v-model="components"
          group="canvas"
          item-key="id"
          class="drop-zone"
          handle=".drag-handle"
          ghost-class="ghost-drop"
          animation="200"
        >
          <template #item="{ element }">
            <CanvasComponent
              :component="element"
              :parent-id="null"
            />
          </template>
        </draggable>

        <!-- Empty State -->
        <div v-if="components.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3>Start Building</h3>
          <p>Drag components from the left panel or choose a template.</p>
          
          <div class="quick-actions">
            <button @click.stop="store.addTemplate('hero')">Add Hero</button>
            <button @click.stop="store.addTemplate('features')">Add Features</button>
            <button @click.stop="store.addTemplate('cta')">Add CTA</button>
          </div>
        </div>
        
        <!-- Debug Helper (Visible only if there's a bug with invisible components) -->
        <div v-else-if="components.length > 0 && (!components[0] || !components[0].type)" class="empty-state" style="background: rgba(255,0,0,0.1);">
          <h3>Invisible Component Bug!</h3>
          <p>You have {{ components.length }} components but they might be broken.</p>
          <button @click="store.components = []" style="padding: 8px 16px; background: red; color: white; border-radius: 4px; border: none; cursor: pointer; margin-top: 10px;">Clear Canvas</button>
        </div>
      </div>

      <!-- AI Generating Premium Overlay -->
      <Transition name="fade">
        <div v-if="store.isAiGenerating" class="ai-generating-overlay">
          <div class="minimal-panel">
            <div class="pixel-grid">
              <div 
                v-for="i in 9" 
                :key="i" 
                class="pixel" 
                :style="{ animationDelay: `${((i - 1) % 3) * 0.15 + Math.floor((i - 1) / 3) * 0.15}s` }"
              ></div>
            </div>
            <div class="loader-text">
              <h3>Generating Layout</h3>
              <p>Please wait</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  flex: 1;
  background-color: var(--color-bg);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding: var(--space-8);
  /* Dotted background pattern for a professional workspace feel */
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 0);
  background-size: 24px 24px;
  position: relative;
}

.file-drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(4px);
  border: 2px dashed var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Let the drop hit the workspace */
}

.overlay-content {
  background: var(--color-surface);
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-accent);
}

.overlay-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.canvas-container {
  width: 100%;
  transition: max-width var(--transition-slow);
  margin: 0 auto;
}

.canvas-page {
  background-color: var(--theme-color-background, var(--color-surface));
  min-height: 800px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-page);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  position: relative;
}

.drop-zone {
  flex: 1;
  padding: var(--space-8) 0;
  position: relative;
  min-height: 100%;
}

/* Empty State */
.empty-state {
  position: absolute;
  inset: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-alt);
  opacity: 0.8;
}

.empty-icon {
  color: var(--color-accent);
  margin-bottom: var(--space-4);
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6) 0;
  max-width: 300px;
  text-align: center;
}

.quick-actions {
  display: flex;
  gap: var(--space-2);
  pointer-events: auto;
}

.quick-actions button {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-ui);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-actions button:hover {
  border-color: var(--color-border-focus);
  color: var(--color-text-primary);
  background: var(--color-surface-alt);
}

/* Dragging state */
.ghost-drop {
  opacity: 0.4;
  background: var(--color-accent-subtle);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- AI Generating Minimal Overlay ---- */
.ai-generating-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(18, 18, 20, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: inherit;
  overflow: hidden;
}

.minimal-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 3.5rem;
  background: rgba(25, 25, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.pixel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.pixel {
  width: 4px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 1px;
  animation: pixelPulse 1.5s infinite ease-in-out;
}

@keyframes pixelPulse {
  0%, 100% { opacity: 0.1; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

.loader-text {
  text-align: center;
  font-family: inherit;
}

.loader-text h3 {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 0.4rem 0;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.loader-text p {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: lowercase;
}

/* Light mode overrides for overlay */
html[data-theme="light"] .ai-generating-overlay {
  background: rgba(255, 255, 255, 0.5);
}

html[data-theme="light"] .minimal-panel {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

html[data-theme="light"] .pixel {
  background-color: rgba(0, 0, 0, 0.6);
}

html[data-theme="light"] .loader-text h3 {
  color: rgba(0, 0, 0, 0.7);
}

html[data-theme="light"] .loader-text p {
  color: rgba(0, 0, 0, 0.4);
}

</style>
