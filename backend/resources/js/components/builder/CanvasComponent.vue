<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import type { BuilderComponent } from '../../types/builder';
import HeadingElement from '../elements/HeadingElement.vue';
import TextElement from '../elements/TextElement.vue';
import ButtonElement from '../elements/ButtonElement.vue';
import ImageElement from '../elements/ImageElement.vue';
import ContainerElement from '../elements/ContainerElement.vue';
import DividerElement from '../elements/DividerElement.vue';
import SpacerElement from '../elements/SpacerElement.vue';
import VideoElement from '../elements/VideoElement.vue';
import IconElement from '../elements/IconElement.vue';
import InputElement from '../elements/InputElement.vue';
import NewsletterElement from '../elements/NewsletterElement.vue';

const props = defineProps<{
  component: BuilderComponent;
  parentId?: string | null;
}>();

const store = useBuilderStore();

const isSelected = computed(() => store.selectedComponentId === props.component.id);
const isContainerLike = computed(() => ['container', 'section', 'columns', 'grid', 'form'].includes(props.component.type));

const componentMap: Record<string, any> = {
  heading: HeadingElement,
  text: TextElement,
  button: ButtonElement,
  image: ImageElement,
  container: ContainerElement,
  divider: DividerElement,
  spacer: SpacerElement,
  video: VideoElement,
  icon: IconElement,
  input: InputElement,
  newsletter: NewsletterElement,
  section: ContainerElement,
  columns: ContainerElement,
  grid: ContainerElement,
  form: ContainerElement,
};

const dynamicComponent = computed(() => componentMap[props.component.type]);

const handleSelect = (e: MouseEvent) => {
  e.stopPropagation();
  store.selectComponent(props.component.id);
};

const handleRemove = (e: MouseEvent) => {
  e.stopPropagation();
  store.removeComponent(props.component.id);
};

import { resolveComponentProps } from '../../utils/shopify/mockContext';

const resolvedProps = computed(() => {
  return resolveComponentProps(props.component);
});

const wrapperStyles = computed(() => {
  let styleStr = '';
  if (props.component.styles?.paddingTop) styleStr += `padding-top: ${props.component.styles.paddingTop}; `;
  if (props.component.styles?.paddingBottom) styleStr += `padding-bottom: ${props.component.styles.paddingBottom}; `;
  if (props.component.styles?.customCss) styleStr += props.component.styles.customCss;
  return styleStr;
});
</script>

<template>
  <div
    class="component-wrapper"
    :class="{ 'is-selected': isSelected, 'is-container': isContainerLike }"
    @click="handleSelect"
  >
    <!-- Selection Badge -->
    <div v-show="isSelected" class="selection-badge">
      {{ component.type }}
    </div>

    <!-- Actions (Top Right) -->
    <div v-show="isSelected" class="action-bar">
      <button v-if="parentId" class="parent-btn" @click.stop="store.selectComponent(parentId)" title="Select Parent Container">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
      <div class="drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <button class="delete-btn" @click="handleRemove" title="Delete Component">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div :class="['canvas-component', { selected: isSelected }]" @click.stop="handleSelect" :style="wrapperStyles">
      
      <!-- The Actual Element -->
      <component
        :is="dynamicComponent"
        :props="resolvedProps"
        :styles="component.styles"
        :component-id="component.id"
        :component-type="component.type"
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

/* Container needs some min-height if empty */
.component-wrapper.is-container {
  min-height: 50px;
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
}

.pointer-events-none {
  pointer-events: none; /* Let the wrapper handle clicks for basic elements */
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

.parent-btn {
  padding: 4px;
  color: var(--color-text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.parent-btn:hover {
  background: var(--color-surface-alt);
  color: var(--color-accent);
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
