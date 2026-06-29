export type ComponentType = 'heading' | 'text' | 'button' | 'image' | 'container' | 'divider' | 'spacer' | 'section' | 'columns' | 'grid' | 'video' | 'icon' | 'form' | 'input' | 'newsletter';

// ---- Typography Styles ----
export interface ComponentStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  minHeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  // Layout specific styles
  display?: 'flex' | 'grid' | 'block';
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  borderRadius?: string;
  customCss?: string;
}

// ---- Component Props ----
export interface HeadingProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface TextProps {
  text: string;
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface ButtonProps {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
  alignment: 'left' | 'center' | 'right';
}

export interface ImageProps {
  url: string;
  altText: string;
  width: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ContainerProps {
  // Empty for now, keeping actual flex logic in styles
  preset?: 'row' | 'column' | 'grid';
}

// ---- Builder Component (core data model) ----
export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: any;
  styles?: ComponentStyles;
  children?: BuilderComponent[];
  bindings?: Record<string, string>; // Maps a prop name (e.g. 'text') to a Shopify object (e.g. 'product.title')
}

// ---- Device Modes ----
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

// ---- Curated Font List ----
export const FONT_FAMILIES = [
  'Geist',
  'Inter',
  'Manrope',
  'DM Sans',
  'Playfair Display',
  'Space Grotesk',
] as const;

export const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '32px', '40px', '48px', '64px',
] as const;

export const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
] as const;

// ---- Theme Engine ----
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
  layout: {
    borderRadius: string;
    containerWidth: string;
    spacing: string;
  };
}
