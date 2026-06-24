<script setup lang="ts">
import { computed } from 'vue';
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
</script>

<template>
  <div class="workspace" @click="store.selectComponent(null)">
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
              :is-selected="store.selectedComponentId === element.id"
              @select="store.selectComponent(element.id)"
              @remove="store.removeComponent(element.id)"
            />
          </template>
          
          <!-- Empty State -->
          <template v-if="components.length === 0" #footer>
             <div class="empty-state">
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
          </template>
        </draggable>
      </div>
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
  background-image: radial-gradient(var(--color-border) 1px, transparent 0);
  background-size: 24px 24px;
}

.canvas-container {
  width: 100%;
  transition: max-width var(--transition-slow);
  margin: 0 auto;
}

.canvas-page {
  background: var(--color-surface);
  min-height: 800px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-page);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
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
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
  background: var(--color-bg);
  padding: var(--space-4);
  border-radius: var(--radius-full);
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
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
</style>
