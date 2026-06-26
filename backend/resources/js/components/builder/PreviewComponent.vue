<script setup lang="ts">
import { computed } from 'vue';
import type { BuilderComponent } from '../../types/builder';
import HeadingElement from '../elements/HeadingElement.vue';
import TextElement from '../elements/TextElement.vue';
import ButtonElement from '../elements/ButtonElement.vue';
import ImageElement from '../elements/ImageElement.vue';
import PreviewComponent from './PreviewComponent.vue'; // Self-reference

const props = defineProps<{
  component: BuilderComponent;
}>();

const componentMap: Record<string, any> = {
  heading: HeadingElement,
  text: TextElement,
  button: ButtonElement,
  image: ImageElement,
};

const dynamicComponent = computed(() => componentMap[props.component.type]);

const computedContainerStyles = computed(() => {
  if (props.component.type !== 'container') return {};
  const styles = props.component.styles || {};
  return {
    display: styles.display || 'flex',
    flexDirection: styles.flexDirection || 'column',
    alignItems: styles.alignItems || 'flex-start',
    justifyContent: styles.justifyContent || 'flex-start',
    gap: styles.gap || '16px',
    padding: styles.padding || '0px',
    backgroundColor: styles.backgroundColor || 'transparent',
    borderRadius: styles.borderRadius || '0px',
    width: '100%',
  };
});
</script>

<template>
  <div v-if="component.type === 'container'" :style="computedContainerStyles" class="preview-container">
    <PreviewComponent
      v-for="child in (component.children || [])"
      :key="child.id"
      :component="child"
    />
  </div>
  <div v-else class="preview-element-wrapper">
    <component
      :is="dynamicComponent"
      :props="component.props"
      :styles="component.styles"
    />
  </div>
</template>

<style scoped>
.preview-container {
  box-sizing: border-box;
}
.preview-element-wrapper {
  width: 100%;
}
</style>
