import { useThemeStore } from '../stores/useThemeStore';

export function useDesignSystem() {
  const store = useThemeStore();

  const resolveColor = (value?: string): string | undefined => {
    if (!value) return undefined;
    
    // Check if the value is a known theme token
    const tokenKeys = [
      'primary', 'secondary', 'accent', 'background', 
      'surface', 'textPrimary', 'textSecondary', 'border'
    ];
    
    if (tokenKeys.includes(value)) {
      return `var(--theme-color-${value})`;
    }
    
    // Otherwise, treat as a raw hex/rgba override
    return value;
  };

  const resolveFont = (value?: string): string | undefined => {
    if (!value) return undefined;

    if (value === 'heading') {
      return 'var(--theme-font-heading)';
    }
    if (value === 'body') {
      return 'var(--theme-font-body)';
    }

    // Otherwise, it's a specific font override (e.g. "Inter")
    return `"${value}", var(--font-ui)`;
  };

  return {
    resolveColor,
    resolveFont,
  };
}
