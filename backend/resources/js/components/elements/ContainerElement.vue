<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import type { ContainerProps, ComponentStyles } from '../../types/builder';
import { useDesignSystem } from '../../composables/useDesignSystem';
// @ts-ignore
import draggable from 'vuedraggable';

const props = defineProps<{
  props: ContainerProps;
  styles?: ComponentStyles;
  componentId: string;
  componentType: string;
}>();

const store = useBuilderStore();

// Read/write computed property for this container's children
const children = computed({
  get: () => {
    // Find this container in the store and return its children
    // In Vue 3, this is reactive as long as it tracks the state properly.
    const comp = store.components; // trigger reactivity
    const self = findDeep(comp, props.componentId);
    return self?.children || [];
  },
  set: (newChildren) => {
    // VueDraggable emits updates when items are moved. We need to apply this to the specific child array.
    const parent = findDeep(store.components, props.componentId);
    if (parent) {
      parent.children = newChildren;
    }
  }
});

const findDeep = (list: any[], id: string): any => {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findDeep(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const { resolveColor } = useDesignSystem();

const computedStyles = computed(() => {
  return {
    display: props.styles?.display || 'flex',
    flexDirection: props.styles?.flexDirection || 'column',
    alignItems: props.styles?.alignItems || 'stretch',
    justifyContent: props.styles?.justifyContent || 'flex-start',
    gap: props.styles?.gap || '16px',
    padding: props.styles?.padding || '24px',
    backgroundColor: resolveColor(props.styles?.backgroundColor) || 'transparent',
    borderRadius: props.styles?.borderRadius || '0px',
    width: props.styles?.width || '100%',
    minHeight: props.styles?.minHeight || '50px',
  };
});

const tag = computed(() => {
  if (props.componentType === 'section') return 'section';
  if (props.componentType === 'form') return 'form';
  return 'div';
});
</script>

<template>
  <component :is="tag" :style="computedStyles" class="foundry-container" @submit.prevent>
    <draggable
      v-model="children"
      group="canvas"
      item-key="id"
      class="nested-drop-zone"
      handle=".drag-handle"
      ghost-class="ghost-drop"
      animation="200"
    >
      <template #item="{ element }">
        <CanvasComponent
          :component="element"
          :parent-id="componentId"
        />
      </template>
    </draggable>

    <!-- Empty nested state -->
    <div v-if="children.length === 0" class="empty-container-state">
      Drop components here
    </div>
  </component>
</template>

<style scoped>
.foundry-container {
  width: 100%;
  min-height: 50px;
  border: 1px dashed var(--color-border);
  transition: all var(--transition-fast);
  position: relative;
}

.nested-drop-zone {
  width: 100%;
  min-height: 100%;
  display: inherit; /* inherit flex layout from parent container */
  flex-direction: inherit;
  align-items: inherit;
  justify-content: inherit;
  gap: inherit;
}

.empty-container-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text-tertiary);
  background: rgba(0, 0, 0, 0.02);
  border-radius: var(--radius-sm);
  pointer-events: none;
}
</style>
