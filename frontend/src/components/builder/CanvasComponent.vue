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
    class="component-wrapper"
    :class="{ 'is-selected': isSelected }"
    @click.stop="emit('select')"
  >
    <!-- Selection Badge -->
    <div v-show="isSelected" class="selection-badge">
      {{ component.type }}
    </div>

    <!-- Actions (Top Right) -->
    <div v-show="isSelected" class="action-bar">
      <div class="drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <button class="delete-btn" @click.stop="emit('remove')" title="Delete Component">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Render the actual content -->
    <div class="component-content">
      <component
        :is="dynamicComponent"
        :props="component.props"
        :styles="component.styles"
      />
    </div>
  </div>
</template>

<style scoped>
.component-wrapper {
  position: relative;
  cursor: default;
  outline: 1px solid transparent;
  transition: outline var(--transition-fast), background-color var(--transition-fast);
}

/* Hover state (when not selected) */
.component-wrapper:not(.is-selected):hover {
  outline: 1px solid var(--color-border);
  background-color: var(--color-surface-alt);
}

/* Selected state */
.component-wrapper.is-selected {
  outline: 1px solid var(--color-accent);
  background-color: var(--color-accent-subtle);
  z-index: 2;
}

/* Content wrapper keeps spacing internal to the component */
.component-content {
  padding: var(--space-4);
  pointer-events: none; /* Let the wrapper handle clicks */
}

/* ---- Badge ---- */
.selection-badge {
  position: absolute;
  top: -12px;
  left: -1px;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: var(--radius-sm) var(--radius-sm) var(--radius-sm) 0;
  pointer-events: none;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

/* ---- Action Bar ---- */
.action-bar {
  position: absolute;
  top: -14px;
  right: -1px;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  z-index: 10;
  overflow: hidden;
}

.drag-handle {
  padding: 4px;
  color: var(--color-text-tertiary);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--color-border);
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle:hover {
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
}

.delete-btn {
  padding: 4px;
  color: var(--color-text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  background: var(--color-danger);
  color: var(--color-text-inverse);
}
</style>
