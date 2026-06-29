<script setup lang="ts">
import { computed } from 'vue';
import type { BuilderComponent } from '../../types/builder';
import HeadingElement from '../elements/HeadingElement.vue';
import TextElement from '../elements/TextElement.vue';
import ButtonElement from '../elements/ButtonElement.vue';
import ImageElement from '../elements/ImageElement.vue';
import DividerElement from '../elements/DividerElement.vue';
import SpacerElement from '../elements/SpacerElement.vue';
import VideoElement from '../elements/VideoElement.vue';
import IconElement from '../elements/IconElement.vue';
import InputElement from '../elements/InputElement.vue';
import NewsletterElement from '../elements/NewsletterElement.vue';
import PreviewComponent from './PreviewComponent.vue'; // Self-reference

const props = defineProps<{
  component: BuilderComponent;
}>();

const componentMap: Record<string, any> = {
  heading: HeadingElement,
  text: TextElement,
  button: ButtonElement,
  image: ImageElement,
  divider: DividerElement,
  spacer: SpacerElement,
  video: VideoElement,
  icon: IconElement,
  input: InputElement,
  newsletter: NewsletterElement,
};

const isContainerLike = computed(() => ['container', 'section', 'columns', 'grid', 'form'].includes(props.component.type));

const containerTag = computed(() => {
  if (props.component.type === 'section') return 'section';
  if (props.component.type === 'form') return 'form';
  return 'div';
});

const dynamicComponent = computed(() => componentMap[props.component.type]);

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

const computedContainerStyles = computed(() => {
  if (!isContainerLike.value) return {};
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
  <component :is="containerTag" v-if="isContainerLike" :style="[computedContainerStyles, wrapperStyles]" class="preview-container">
    <PreviewComponent
      v-for="child in (component.children || [])"
      :key="child.id"
      :component="child"
    />
  </component>
  <div v-else class="preview-element-wrapper" :style="wrapperStyles">
    <component
      :is="dynamicComponent"
      :props="resolvedProps"
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
