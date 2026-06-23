import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BuilderComponent, ComponentType } from '../types/builder';

const generateId = () => `comp_${Math.random().toString(36).substring(2, 9)}`;

export const useBuilderStore = defineStore('builder', () => {
  const components = ref<BuilderComponent[]>([]);
  const selectedComponentId = ref<string | null>(null);

  const getDefaultProps = (type: ComponentType) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 'h2', alignment: 'left', color: '#111827' };
      case 'text':
        return { text: 'Add your text here...', alignment: 'left', color: '#4B5563' };
      case 'button':
        return { text: 'Click Me', url: '#', variant: 'primary', alignment: 'left' };
      case 'image':
        return { url: 'https://placehold.co/600x400', altText: 'Placeholder Image', width: '100%', alignment: 'center' };
      default:
        return {};
    }
  };

  const addComponent = (type: ComponentType, index?: number) => {
    const newComponent: BuilderComponent = {
      id: generateId(),
      type,
      props: getDefaultProps(type),
    };

    if (index !== undefined) {
      components.value.splice(index, 0, newComponent);
    } else {
      components.value.push(newComponent);
    }
    
    selectedComponentId.value = newComponent.id;
  };

  const selectComponent = (id: string | null) => {
    selectedComponentId.value = id;
  };

  const updateComponentProps = (id: string, newProps: any) => {
    const component = components.value.find(c => c.id === id);
    if (component) {
      component.props = { ...component.props, ...newProps };
    }
  };

  const removeComponent = (id: string) => {
    components.value = components.value.filter(c => c.id !== id);
    if (selectedComponentId.value === id) {
      selectedComponentId.value = null;
    }
  };

  const reorderComponents = (newOrder: BuilderComponent[]) => {
    components.value = newOrder;
  };

  return {
    components,
    selectedComponentId,
    addComponent,
    selectComponent,
    updateComponentProps,
    removeComponent,
    reorderComponents
  };
});
