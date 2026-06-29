import type { ComponentType } from '../types/builder';

// ---- Component Definition ----
export interface ComponentDefinition {
  type: ComponentType | string;
  label: string;
  description: string;
  icon: string;                // SVG path data (24×24 viewBox)
  category: 'basic' | 'layout' | 'media' | 'interactive';
  available: boolean;          // false = "Coming Soon"
  keywords: string[];          // For search matching
}

// ---- Category Metadata ----
export interface CategoryMeta {
  id: string;
  label: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'basic', label: 'Basic', description: 'Essential building blocks' },
  { id: 'layout', label: 'Layout', description: 'Structure & arrangement' },
  { id: 'media', label: 'Media', description: 'Images, video & icons' },
  { id: 'interactive', label: 'Interactive', description: 'Buttons, forms & inputs' },
];

// ---- Component Registry ----
export const COMPONENT_REGISTRY: ComponentDefinition[] = [

  // ═══════════════ BASIC ═══════════════
  {
    type: 'heading',
    label: 'Heading',
    description: 'Title or section heading',
    icon: 'M4 6V18M20 6V18M12 6V18M7 6H1M7 18H1M23 6H17M23 18H17M15 12H9',
    category: 'basic',
    available: true,
    keywords: ['heading', 'title', 'h1', 'h2', 'h3', 'header', 'text'],
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Rich text paragraph',
    icon: 'M4 6H20M4 12H20M4 18H14',
    category: 'basic',
    available: true,
    keywords: ['text', 'paragraph', 'body', 'content', 'description'],
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action button',
    icon: 'M5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5C4 4.44772 4.44772 4 5 4ZM8 12H16',
    category: 'basic',
    available: true,
    keywords: ['button', 'cta', 'action', 'link', 'click'],
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal separator line',
    icon: 'M3 12H21',
    category: 'basic',
    available: true,
    keywords: ['divider', 'separator', 'line', 'hr', 'break'],
  },
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Adjustable empty space',
    icon: 'M12 5V19M5 12H19M5 5H19M5 19H19',
    category: 'basic',
    available: true,
    keywords: ['spacer', 'gap', 'space', 'padding', 'margin'],
  },

  // ═══════════════ LAYOUT ═══════════════
  {
    type: 'container',
    label: 'Layout Box',
    description: 'Flexible container with nesting',
    icon: 'M4 4H20V20H4ZM4 12H20',
    category: 'layout',
    available: true,
    keywords: ['container', 'layout', 'box', 'wrapper', 'section', 'div'],
  },
  {
    type: 'section',
    label: 'Section',
    description: 'Full-width page section',
    icon: 'M3 3H21V21H3ZM3 9H21M3 15H21',
    category: 'layout',
    available: true,
    keywords: ['section', 'block', 'full-width', 'area'],
  },
  {
    type: 'columns',
    label: 'Columns',
    description: 'Multi-column layout',
    icon: 'M3 3H21V21H3ZM9 3V21M15 3V21',
    category: 'layout',
    available: true,
    keywords: ['columns', 'grid', 'multi-column', 'side-by-side', 'row'],
  },
  {
    type: 'grid',
    label: 'Grid',
    description: 'CSS Grid layout',
    icon: 'M3 3H21V21H3ZM3 9H21M3 15H21M9 3V21M15 3V21',
    category: 'layout',
    available: true,
    keywords: ['grid', 'layout', 'matrix', 'tiles', 'mosaic'],
  },

  // ═══════════════ MEDIA ═══════════════
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed images',
    icon: 'M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z',
    category: 'media',
    available: true,
    keywords: ['image', 'photo', 'picture', 'upload', 'media', 'img'],
  },
  {
    type: 'video',
    label: 'Video',
    description: 'Embed video content',
    icon: 'M15 10L19.553 7.724C20.214 7.393 21 7.874 21 8.618V15.382C21 16.126 20.214 16.607 19.553 16.276L15 14M5 18H13C14.105 18 15 17.105 15 16V8C15 6.895 14.105 6 13 6H5C3.895 6 3 6.895 3 8V16C3 17.105 3.895 18 5 18Z',
    category: 'media',
    available: true,
    keywords: ['video', 'embed', 'youtube', 'vimeo', 'media', 'player'],
  },
  {
    type: 'icon',
    label: 'Icon',
    description: 'SVG icon element',
    icon: 'M14.828 14.828C15.578 14.078 16 13.061 16 12C16 9.791 14.209 8 12 8C10.939 8 9.922 8.422 9.172 9.172M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34',
    category: 'media',
    available: true,
    keywords: ['icon', 'svg', 'symbol', 'glyph', 'emoji'],
  },

  // ═══════════════ INTERACTIVE ═══════════════
  {
    type: 'form',
    label: 'Form',
    description: 'Contact or signup form',
    icon: 'M9 5H7C5.895 5 5 5.895 5 7V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V7C19 5.895 18.105 5 17 5H15M9 5C9 6.105 9.895 7 11 7H13C14.105 7 15 6.105 15 5M9 5C9 3.895 9.895 3 11 3H13C14.105 3 15 3.895 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01',
    category: 'interactive',
    available: true,
    keywords: ['form', 'contact', 'signup', 'submit', 'input'],
  },
  {
    type: 'input',
    label: 'Input',
    description: 'Text input field',
    icon: 'M4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17V7C3 6.44772 3.44772 6 4 6ZM7 12H7.01',
    category: 'interactive',
    available: true,
    keywords: ['input', 'text', 'field', 'textbox', 'entry'],
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    description: 'Email signup block',
    icon: 'M3 8L10.89 13.26C11.568 13.684 12.432 13.684 13.11 13.26L21 8M5 19H19C20.105 19 21 18.105 21 17V7C21 5.895 20.105 5 19 5H5C3.895 5 3 5.895 3 7V17C3 18.105 3.895 19 5 19Z',
    category: 'interactive',
    available: true,
    keywords: ['newsletter', 'email', 'subscribe', 'mailing', 'list'],
  },
];

// ---- Helpers ----
export const getComponentsByCategory = (category: string): ComponentDefinition[] => {
  return COMPONENT_REGISTRY.filter(c => c.category === category);
};

export const getAvailableComponents = (): ComponentDefinition[] => {
  return COMPONENT_REGISTRY.filter(c => c.available);
};

export const searchComponents = (query: string): ComponentDefinition[] => {
  const q = query.toLowerCase().trim();
  if (!q) return COMPONENT_REGISTRY;
  return COMPONENT_REGISTRY.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.keywords.some(k => k.includes(q))
  );
};
