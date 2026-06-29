import type { BuilderComponent } from '../types/builder';

const generateId = () => `comp_${Math.random().toString(36).substring(2, 9)}`;

// ---- Template Definition ----
export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'faq' | 'footer' | 'about' | 'contact';
  accentColor: string;          // For gradient thumbnail
  secondaryColor: string;       // For gradient thumbnail
  builder: () => BuilderComponent[];
}

// ---- Category Metadata ----
export interface TemplateCategoryMeta {
  id: string;
  label: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategoryMeta[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta', label: 'CTA' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
];

// ---- Template Registry ----
export const TEMPLATE_REGISTRY: TemplateDefinition[] = [

  // ═══════════════ HERO ═══════════════
  {
    id: 'hero-saas',
    name: 'Modern SaaS Hero',
    description: 'Perfect for startups and product launches',
    category: 'hero',
    accentColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    builder: () => [
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
  },
  {
    id: 'hero-bold',
    name: 'Bold Hero',
    description: 'High-impact hero with large typography',
    category: 'hero',
    accentColor: '#EF4444',
    secondaryColor: '#F97316',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'The Future of Design Starts Here', level: 'h1', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '56px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'We\'re redefining what\'s possible. Join thousands of creators who are pushing the boundaries of web design.', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '20px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'button',
        props: { text: 'Start Creating', url: '#', variant: 'primary', alignment: 'center' },
        styles: { fontSize: '18px', fontWeight: '600' },
      },
    ],
  },

  // ═══════════════ FEATURES ═══════════════
  {
    id: 'features-grid',
    name: 'Features Grid',
    description: 'Showcase key features with descriptions',
    category: 'features',
    accentColor: '#10B981',
    secondaryColor: '#06B6D4',
    builder: () => [
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
  },
  {
    id: 'features-centered',
    name: 'Centered Features',
    description: 'Features with centered alignment',
    category: 'features',
    accentColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'Everything You Need', level: 'h2', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '36px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Powerful features that help you build, launch, and scale your online presence with confidence.', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '18px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'heading',
        props: { text: '⚡ Lightning Fast', level: 'h3', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '20px', fontWeight: '600' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Built for performance. Every page loads instantly with optimized delivery and smart caching.', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '15px', fontWeight: '400' },
      },
    ],
  },

  // ═══════════════ PRICING ═══════════════
  {
    id: 'pricing-simple',
    name: 'Pricing Section',
    description: 'Clean pricing table layout',
    category: 'pricing',
    accentColor: '#F59E0B',
    secondaryColor: '#EF4444',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'Simple, Transparent Pricing', level: 'h2', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '36px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'No hidden fees. No surprises. Pick the plan that works for you.', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '18px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'heading',
        props: { text: '$29/month', level: 'h2', alignment: 'center', color: 'accent' },
        styles: { fontFamily: 'heading', fontSize: '48px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: '✓ Unlimited pages  ✓ Custom domains  ✓ Priority support  ✓ Advanced analytics', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '16px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'button',
        props: { text: 'Start Free Trial', url: '#', variant: 'primary', alignment: 'center' },
        styles: { fontSize: '16px', fontWeight: '600' },
      },
    ],
  },

  // ═══════════════ TESTIMONIALS ═══════════════
  {
    id: 'testimonial-quote',
    name: 'Testimonial Quote',
    description: 'Customer quote with attribution',
    category: 'testimonials',
    accentColor: '#EC4899',
    secondaryColor: '#F43F5E',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'What Our Users Say', level: 'h2', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '32px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: '"Foundry completely transformed how we build landing pages. What used to take weeks now takes hours. The design quality is unmatched."', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'body', fontSize: '20px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: '— Sarah Chen, Head of Design at TechFlow', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '14px', fontWeight: '500' },
      },
    ],
  },

  // ═══════════════ CTA ═══════════════
  {
    id: 'cta-standard',
    name: 'Call to Action',
    description: 'Drive conversions with a strong CTA',
    category: 'cta',
    accentColor: '#6366F1',
    secondaryColor: '#3B82F6',
    builder: () => [
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
  },

  // ═══════════════ FAQ ═══════════════
  {
    id: 'faq-simple',
    name: 'FAQ Section',
    description: 'Common questions and answers',
    category: 'faq',
    accentColor: '#14B8A6',
    secondaryColor: '#22C55E',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'Frequently Asked Questions', level: 'h2', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '32px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'How does Foundry work?', level: 'h4', alignment: 'left', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '18px', fontWeight: '600' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Foundry uses a visual drag-and-drop interface. Simply pick components, arrange them on your canvas, and customize everything with our property inspector.', alignment: 'left', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '15px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'Can I export my designs?', level: 'h4', alignment: 'left', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '18px', fontWeight: '600' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Yes! Foundry supports full HTML/CSS export. You can take your designs anywhere — host them yourself or deploy with one click.', alignment: 'left', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '15px', fontWeight: '400' },
      },
    ],
  },

  // ═══════════════ ABOUT ═══════════════
  {
    id: 'about-intro',
    name: 'About Section',
    description: 'Company or personal introduction',
    category: 'about',
    accentColor: '#0EA5E9',
    secondaryColor: '#6366F1',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'About Us', level: 'h2', alignment: 'left', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '36px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'We\'re a team of designers and engineers passionate about making the web more beautiful and accessible. Our mission is to empower everyone to create professional websites without writing code.', alignment: 'left', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '17px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Founded in 2024, Foundry has helped over 10,000 creators launch their dream projects. We believe great design should be available to everyone.', alignment: 'left', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '17px', fontWeight: '400' },
      },
    ],
  },

  // ═══════════════ CONTACT ═══════════════
  {
    id: 'contact-simple',
    name: 'Contact Section',
    description: 'Get in touch with a CTA',
    category: 'contact',
    accentColor: '#F97316',
    secondaryColor: '#F59E0B',
    builder: () => [
      {
        id: generateId(),
        type: 'heading',
        props: { text: 'Get in Touch', level: 'h2', alignment: 'center', color: 'textPrimary' },
        styles: { fontFamily: 'heading', fontSize: '36px', fontWeight: '700' },
      },
      {
        id: generateId(),
        type: 'text',
        props: { text: 'Have questions or want to learn more? We\'d love to hear from you. Our team typically responds within 24 hours.', alignment: 'center', color: 'textSecondary' },
        styles: { fontFamily: 'body', fontSize: '17px', fontWeight: '400' },
      },
      {
        id: generateId(),
        type: 'button',
        props: { text: 'Contact Us', url: '#', variant: 'primary', alignment: 'center' },
        styles: { fontSize: '16px', fontWeight: '600' },
      },
    ],
  },
];

// ---- Helpers ----
export const getTemplatesByCategory = (category: string): TemplateDefinition[] => {
  return TEMPLATE_REGISTRY.filter(t => t.category === category);
};

export const getTemplateById = (id: string): TemplateDefinition | undefined => {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
};

export const searchTemplates = (query: string): TemplateDefinition[] => {
  const q = query.toLowerCase().trim();
  if (!q) return TEMPLATE_REGISTRY;
  return TEMPLATE_REGISTRY.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.includes(q)
  );
};
