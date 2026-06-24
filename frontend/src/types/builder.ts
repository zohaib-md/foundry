export type ComponentType = 'heading' | 'text' | 'button' | 'image';

// ---- Typography Styles ----
export interface ComponentStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
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

// ---- Builder Component (core data model) ----
export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: any;
  styles?: ComponentStyles;
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
