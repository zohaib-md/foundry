import type { BuilderComponent } from '../../types/builder';

export const mockShopifyContext: Record<string, string> = {
  'product.title': 'Premium Leather Sneaker',
  'product.price | money': '$120.00',
  'product.description': 'This is a high-quality product showcasing dynamic data binding in action.',
  'product.url': '/products/mock-sneaker',
  'collection.title': 'Summer Collection',
  'collection.url': '/collections/summer',
  'shop.name': 'Foundry Store',
};

export const resolveInlineBindings = (text: string): string => {
  if (!text) return text;
  // Match {variable} or {{variable}}
  return text.replace(/\{\{?\s*([^}]+)\s*\}?\}/g, (match, variableName) => {
    const trimmedVar = variableName.trim();
    if (mockShopifyContext[trimmedVar]) {
      return mockShopifyContext[trimmedVar];
    }
    return `[${trimmedVar}]`; // Fallback for unknown variables
  });
};

export const resolveComponentProps = (component: BuilderComponent) => {
  const finalProps = { ...component.props };
  
  // 1. Resolve explicit bindings (from dropdown)
  if (component.bindings) {
    for (const [key, source] of Object.entries(component.bindings)) {
      if (source && mockShopifyContext[source]) {
        finalProps[key] = mockShopifyContext[source];
      } else if (source) {
        finalProps[key] = `[${source}]`;
      }
    }
  }

  // 2. Resolve inline mustache bindings in all string props (if not overridden by explicit binding)
  for (const key in finalProps) {
    if (typeof finalProps[key] === 'string' && !component.bindings?.[key]) {
      finalProps[key] = resolveInlineBindings(finalProps[key]);
    }
  }
  
  return finalProps;
};
