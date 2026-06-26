import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BuilderComponent, ComponentType, ComponentStyles } from '../types/builder';

const generateId = () => `comp_${Math.random().toString(36).substring(2, 9)}`;

export const useBuilderStore = defineStore('builder', () => {
  const components = ref<BuilderComponent[]>([]);
  const selectedComponentId = ref<string | null>(null);

  // ---- Helpers ----
  const findComponentById = (id: string, list: BuilderComponent[]): BuilderComponent | null => {
    for (const comp of list) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponentById(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  };

  const removeComponentById = (id: string, list: BuilderComponent[]): boolean => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list.splice(i, 1);
        return true;
      }
      if (list[i].children) {
        const removed = removeComponentById(id, list[i].children!);
        if (removed) return true;
      }
    }
    return false;
  };

  // ---- Computed ----

  const selectedComponent = computed(() =>
    selectedComponentId.value ? findComponentById(selectedComponentId.value, components.value) : null
  );

  const usedFonts = computed(() => {
    const fonts = new Set<string>();
    const scanFonts = (list: BuilderComponent[]) => {
      list.forEach(c => {
        if (c.styles?.fontFamily) {
          fonts.add(c.styles.fontFamily);
        }
        if (c.children) {
          scanFonts(c.children);
        }
      });
    };
    scanFonts(components.value);
    return fonts;
  });

  // ---- Default Props ----

  const getDefaultProps = (type: ComponentType) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 'h2', alignment: 'left', color: '#171717' };
      case 'text':
        return { text: 'Add your text here. Click to edit content and style.', alignment: 'left', color: '#525252' };
      case 'button':
        return { text: 'Get Started', url: '#', variant: 'primary', alignment: 'left' };
      case 'image':
        return { url: 'https://placehold.co/800x400/F5F5F5/A3A3A3?text=Image', altText: 'Placeholder Image', width: '100%', alignment: 'center' };
      case 'container':
        return { preset: 'col' };
      default:
        return {};
    }
  };

  // ---- Actions ----

  const addComponent = (type: ComponentType, index?: number, parentId?: string, initialProps?: any) => {
    const newComponent: BuilderComponent = {
      id: generateId(),
      type,
      props: { ...getDefaultProps(type), ...(initialProps || {}) },
      styles: type === 'container' ? {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '8px'
      } : {},
    };

    if (type === 'container') {
      newComponent.children = [];
    }

    if (parentId) {
      const parent = findComponentById(parentId, components.value);
      if (parent && parent.type === 'container' && parent.children) {
        if (index !== undefined) {
          parent.children.splice(index, 0, newComponent);
        } else {
          parent.children.push(newComponent);
        }
      }
    } else {
      if (index !== undefined) {
        components.value.splice(index, 0, newComponent);
      } else {
        components.value.push(newComponent);
      }
    }

    selectedComponentId.value = newComponent.id;
  };

  const selectComponent = (id: string | null) => {
    selectedComponentId.value = id;
  };

  const updateComponentProps = (id: string, newProps: any) => {
    const component = findComponentById(id, components.value);
    if (component) {
      component.props = { ...component.props, ...newProps };
    }
  };

  const updateComponentStyles = (id: string, newStyles: Partial<ComponentStyles>) => {
    const component = findComponentById(id, components.value);
    if (component) {
      component.styles = { ...component.styles, ...newStyles };
    }
  };

  const removeComponent = (id: string) => {
    removeComponentById(id, components.value);
    if (selectedComponentId.value === id) {
      selectedComponentId.value = null;
    }
  };

  const reorderComponents = (newOrder: BuilderComponent[]) => {
    components.value = newOrder;
  };

  // ---- Templates ----

  const addTemplate = (templateName: 'hero' | 'features' | 'cta') => {
    const templates: Record<string, () => BuilderComponent[]> = {
      hero: () => [
        {
          id: generateId(),
          type: 'heading',
          props: { text: 'Build Something Beautiful', level: 'h1', alignment: 'center', color: '#171717' },
          styles: { fontFamily: 'Inter', fontSize: '48px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Create stunning pages with a simple drag-and-drop interface. No code required.', alignment: 'center', color: '#525252' },
          styles: { fontFamily: 'Inter', fontSize: '18px', fontWeight: '400' },
        },
        {
          id: generateId(),
          type: 'button',
          props: { text: 'Get Started Free', url: '#', variant: 'primary', alignment: 'center' },
          styles: { fontSize: '16px', fontWeight: '600' },
        },
      ],
      features: () => [
        {
          id: generateId(),
          type: 'heading',
          props: { text: 'Why Choose Us', level: 'h2', alignment: 'left', color: '#171717' },
          styles: { fontFamily: 'Inter', fontSize: '32px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'We combine cutting-edge technology with beautiful design to deliver an experience that stands out from the crowd.', alignment: 'left', color: '#525252' },
          styles: { fontFamily: 'Inter', fontSize: '16px', fontWeight: '400' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Our platform is trusted by thousands of creators, designers, and businesses worldwide to build their online presence.', alignment: 'left', color: '#525252' },
          styles: { fontFamily: 'Inter', fontSize: '16px', fontWeight: '400' },
        },
      ],
      cta: () => [
        {
          id: generateId(),
          type: 'heading',
          props: { text: 'Ready to Get Started?', level: 'h2', alignment: 'center', color: '#171717' },
          styles: { fontFamily: 'Inter', fontSize: '36px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Join thousands of creators who are already building with Foundry. Start for free today.', alignment: 'center', color: '#525252' },
          styles: { fontFamily: 'Inter', fontSize: '18px', fontWeight: '400' },
        },
        {
          id: generateId(),
          type: 'button',
          props: { text: 'Start Building — It\'s Free', url: '#', variant: 'primary', alignment: 'center' },
          styles: { fontSize: '16px', fontWeight: '600' },
        },
      ],
    };

    const templateComponents = templates[templateName]?.();
    if (templateComponents) {
      components.value.push(...templateComponents);
      selectedComponentId.value = templateComponents[0].id;
    }
  };

  const clearAll = () => {
    components.value = [];
    selectedComponentId.value = null;
  };

  return {
    components,
    selectedComponentId,
    selectedComponent,
    usedFonts,
    addComponent,
    selectComponent,
    updateComponentProps,
    updateComponentStyles,
    removeComponent,
    reorderComponents,
    addTemplate,
    clearAll,
  };
});
