import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { BuilderComponent, ComponentType, ComponentStyles } from '../types/builder';
import type { TemplateDefinition } from '../data/templateRegistry';

const generateId = () => `comp_${Math.random().toString(36).substring(2, 9)}`;

export const useBuilderStore = defineStore('builder', () => {
  const components = ref<BuilderComponent[]>([]);
  const selectedComponentId = ref<string | null>(null);

  // Hydrate from localStorage on load
  const savedState = localStorage.getItem('foundry_builder_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.components && Array.isArray(parsed.components)) {
        components.value = parsed.components;
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }

  // Persist to localStorage automatically
  watch(components, (newVal) => {
    localStorage.setItem('foundry_builder_state', JSON.stringify({ components: newVal }));
  }, { deep: true });

  // ---- History State ----
  const past = ref<string[]>([]);
  const future = ref<string[]>([]);
  let debounceTimeout: any = null;
  let pendingSnapshot: string | null = null;

  const commitHistory = (debounce = false) => {
    const capture = JSON.stringify({
      components: components.value,
      selectedComponentId: selectedComponentId.value
    });

    if (debounce) {
      if (!debounceTimeout) {
        pendingSnapshot = capture;
      }
      
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (pendingSnapshot) {
          if (past.value.length === 0 || past.value[past.value.length - 1] !== pendingSnapshot) {
            past.value.push(pendingSnapshot);
            if (past.value.length > 50) past.value.shift();
            future.value = [];
          }
          pendingSnapshot = null;
        }
        debounceTimeout = null;
      }, 500);
    } else {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
        pendingSnapshot = null;
      }
      if (past.value.length === 0 || past.value[past.value.length - 1] !== capture) {
        past.value.push(capture);
        if (past.value.length > 50) past.value.shift();
        future.value = [];
      }
    }
  };

  const undo = () => {
    if (past.value.length === 0) return;
    
    // Flush any pending debounced commits so we don't lose the current state
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = null;
      pendingSnapshot = null;
    }

    const currentSnapshot = JSON.stringify({
      components: components.value,
      selectedComponentId: selectedComponentId.value
    });
    future.value.push(currentSnapshot);
    
    const previousSnapshot = past.value.pop()!;
    const state = JSON.parse(previousSnapshot);
    components.value = state.components;
    selectedComponentId.value = state.selectedComponentId;
  };

  const redo = () => {
    if (future.value.length === 0) return;
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = null;
      pendingSnapshot = null;
    }

    const currentSnapshot = JSON.stringify({
      components: components.value,
      selectedComponentId: selectedComponentId.value
    });
    past.value.push(currentSnapshot);
    
    const nextSnapshot = future.value.pop()!;
    const state = JSON.parse(nextSnapshot);
    components.value = state.components;
    selectedComponentId.value = state.selectedComponentId;
  };

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
        return { text: 'New Heading', level: 'h2', alignment: 'left', color: 'textPrimary' };
      case 'text':
        return { text: 'Add your text here. Click to edit content and style.', alignment: 'left', color: 'textSecondary' };
      case 'button':
        return { text: 'Get Started', url: '#', variant: 'primary', alignment: 'left' };
      case 'image':
        return { url: 'https://placehold.co/800x400/F5F5F5/A3A3A3?text=Image', altText: 'Placeholder Image', width: '100%', alignment: 'center' };
      case 'container':
      case 'section':
      case 'columns':
      case 'grid':
      case 'form':
        return {};
      case 'divider':
        return { thickness: '1px', style: 'solid', color: 'border' };
      case 'spacer':
        return { height: '40px' };
      case 'video':
        return { url: '' };
      case 'icon':
        return { icon: 'star', size: '32px', color: 'accent' };
      case 'input':
        return { placeholder: 'Enter text...', type: 'text' };
      case 'newsletter':
        return { placeholder: 'Enter your email', buttonText: 'Subscribe' };
      default:
        return {};
    }
  };

  // ---- Actions ----

  const addComponent = (type: ComponentType, index?: number, parentId?: string, initialProps?: any) => {
    commitHistory();
    const isContainerLike = ['container', 'section', 'columns', 'grid', 'form'].includes(type);

    let defaultStyles: any = {};
    if (isContainerLike) {
      defaultStyles = {
        display: type === 'grid' ? 'grid' : 'flex',
        flexDirection: type === 'columns' ? 'row' : 'column',
        gap: 'var(--theme-spacing)',
        padding: 'var(--theme-spacing)',
        backgroundColor: 'transparent',
        borderRadius: type === 'section' ? '0px' : 'var(--theme-radius)',
        width: '100%',
      };
      if (type === 'section') {
        defaultStyles.minHeight = '300px';
      }
    }

    const newComponent: BuilderComponent = {
      id: generateId(),
      type,
      props: { ...getDefaultProps(type), ...(initialProps || {}) },
      styles: { ...defaultStyles },
    };

    if (isContainerLike) {
      newComponent.children = [];
    }

    if (parentId) {
      const parent = findComponentById(parentId, components.value);
      if (parent && ['container', 'section', 'columns', 'grid', 'form'].includes(parent.type) && parent.children) {
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
    commitHistory(true);
    const component = findComponentById(id, components.value);
    if (component) {
      component.props = { ...component.props, ...newProps };
    }
  };

  const updateComponentBindings = (id: string, newBindings: Record<string, string | null>) => {
    commitHistory(true);
    const component = findComponentById(id, components.value);
    if (component) {
      const currentBindings = component.bindings || {};
      const updatedBindings = { ...currentBindings };
      
      for (const [key, value] of Object.entries(newBindings)) {
        if (value === null) {
          delete updatedBindings[key];
        } else {
          updatedBindings[key] = value;
        }
      }
      
      component.bindings = updatedBindings;
    }
  };

  const updateComponentStyles = (id: string, newStyles: Partial<ComponentStyles>) => {
    commitHistory(true);
    const component = findComponentById(id, components.value);
    if (component) {
      component.styles = { ...component.styles, ...newStyles };
    }
  };

  const removeComponent = (id: string) => {
    commitHistory();
    removeComponentById(id, components.value);
    if (selectedComponentId.value === id) {
      selectedComponentId.value = null;
    }
  };

  const reorderComponents = (newOrder: BuilderComponent[]) => {
    // Note: vuedraggable might mutate the array directly before calling this setter,
    // so capturing history here might capture the post-mutation state if we're not careful.
    // We'll commit here anyway.
    commitHistory();
    components.value = newOrder;
  };

  // ---- Templates ----

  const addTemplate = (templateName: 'hero' | 'features' | 'cta') => {
    commitHistory();
    const templates: Record<string, () => BuilderComponent[]> = {
      hero: () => [
        {
          id: generateId(),
          type: 'heading',
          props: { text: 'Build Something Beautiful', level: 'h1', alignment: 'center', color: 'textPrimary' },
          styles: { fontFamily: 'heading', fontSize: '48px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Create stunning pages with a simple drag-and-drop interface. No code required.', alignment: 'center', color: 'textSecondary' },
          styles: { fontFamily: 'body', fontSize: '18px', fontWeight: '400' },
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
          props: { text: 'Why Choose Us', level: 'h2', alignment: 'left', color: 'textPrimary' },
          styles: { fontFamily: 'heading', fontSize: '32px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'We combine cutting-edge technology with beautiful design to deliver an experience that stands out from the crowd.', alignment: 'left', color: 'textSecondary' },
          styles: { fontFamily: 'body', fontSize: '16px', fontWeight: '400' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Our platform is trusted by thousands of creators, designers, and businesses worldwide to build their online presence.', alignment: 'left', color: 'textSecondary' },
          styles: { fontFamily: 'body', fontSize: '16px', fontWeight: '400' },
        },
      ],
      cta: () => [
        {
          id: generateId(),
          type: 'heading',
          props: { text: 'Ready to Get Started?', level: 'h2', alignment: 'center', color: 'textPrimary' },
          styles: { fontFamily: 'heading', fontSize: '36px', fontWeight: '700' },
        },
        {
          id: generateId(),
          type: 'text',
          props: { text: 'Join thousands of creators who are already building with Foundry. Start for free today.', alignment: 'center', color: 'textSecondary' },
          styles: { fontFamily: 'body', fontSize: '18px', fontWeight: '400' },
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

  const addTemplateFromRegistry = (template: TemplateDefinition) => {
    commitHistory();
    const templateComponents = template.builder();
    if (templateComponents.length > 0) {
      components.value.push(...templateComponents);
      selectedComponentId.value = templateComponents[0].id;
    }
  };

  const clearAll = () => {
    commitHistory();
    components.value = [];
    selectedComponentId.value = null;
  };

  return {
    components,
    selectedComponentId,
    past,
    future,
    undo,
    redo,
    selectedComponent,
    usedFonts,
    addComponent,
    selectComponent,
    updateComponentProps,
    updateComponentBindings,
    updateComponentStyles,
    removeComponent,
    reorderComponents,
    addTemplate,
    addTemplateFromRegistry,
    clearAll,
  };
});
