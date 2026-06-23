export type ComponentType = 'heading' | 'text' | 'button' | 'image';

export interface BaseProps {
  [key: string]: any;
}

export interface HeadingProps extends BaseProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface TextProps extends BaseProps {
  text: string;
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface ButtonProps extends BaseProps {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
  alignment: 'left' | 'center' | 'right';
}

export interface ImageProps extends BaseProps {
  url: string;
  altText: string;
  width: string; // e.g., '100%', '300px'
  alignment: 'left' | 'center' | 'right';
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: any;
}
