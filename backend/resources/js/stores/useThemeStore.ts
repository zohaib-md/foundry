import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Theme } from '../types/builder';

export const useThemeStore = defineStore('theme', () => {
  const themes = ref<Theme[]>([
    {
      id: 'minimal-light',
      name: 'Minimal Light',
      colors: {
        primary: '#171717',
        secondary: '#525252',
        accent: '#2563EB',
        background: '#FFFFFF',
        surface: '#FAFAFA',
        textPrimary: '#171717',
        textSecondary: '#525252',
        border: '#E5E5E5',
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        baseFontSize: '16px',
      },
      layout: {
        borderRadius: '8px',
        containerWidth: '1200px',
        spacing: '16px',
      }
    },
    {
      id: 'dark-modern',
      name: 'Dark Modern',
      colors: {
        primary: '#FFFFFF',
        secondary: '#A3A3A3',
        accent: '#3B82F6',
        background: '#0A0A0A',
        surface: '#171717',
        textPrimary: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: '#262626',
      },
      typography: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        baseFontSize: '16px',
      },
      layout: {
        borderRadius: '12px',
        containerWidth: '1200px',
        spacing: '24px',
      }
    },
    {
      id: 'startup-blue',
      name: 'Startup Blue',
      colors: {
        primary: '#1D4ED8',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
      },
      typography: {
        headingFont: 'DM Sans',
        bodyFont: 'DM Sans',
        baseFontSize: '16px',
      },
      layout: {
        borderRadius: '6px',
        containerWidth: '1140px',
        spacing: '20px',
      }
    },
    {
      id: 'elegant-serif',
      name: 'Elegant Serif',
      colors: {
        primary: '#000000',
        secondary: '#404040',
        accent: '#9D174D',
        background: '#FCFBF9',
        surface: '#FFFFFF',
        textPrimary: '#171717',
        textSecondary: '#525252',
        border: '#E5E5E5',
      },
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        baseFontSize: '16px',
      },
      layout: {
        borderRadius: '0px',
        containerWidth: '1000px',
        spacing: '24px',
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      colors: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        accent: '#8B5CF6',
        background: '#020617',
        surface: '#0F172A',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#1E293B',
      },
      typography: {
        headingFont: 'Geist',
        bodyFont: 'Geist',
        baseFontSize: '16px',
      },
      layout: {
        borderRadius: '16px',
        containerWidth: '1200px',
        spacing: '24px',
      }
    }
  ]);

  const activeThemeId = ref<string>('minimal-light');

  const activeTheme = computed(() => {
    return themes.value.find(t => t.id === activeThemeId.value) || themes.value[0];
  });

  const setActiveTheme = (id: string) => {
    if (themes.value.some(t => t.id === id)) {
      activeThemeId.value = id;
    }
  };

  const updateActiveThemeColors = (updates: Partial<Theme['colors']>) => {
    const theme = themes.value.find(t => t.id === activeThemeId.value);
    if (theme) {
      theme.colors = { ...theme.colors, ...updates };
    }
  };

  const updateActiveThemeTypography = (updates: Partial<Theme['typography']>) => {
    const theme = themes.value.find(t => t.id === activeThemeId.value);
    if (theme) {
      theme.typography = { ...theme.typography, ...updates };
    }
  };

  const updateActiveThemeLayout = (updates: Partial<Theme['layout']>) => {
    const theme = themes.value.find(t => t.id === activeThemeId.value);
    if (theme) {
      theme.layout = { ...theme.layout, ...updates };
    }
  };

  return {
    themes,
    activeThemeId,
    activeTheme,
    setActiveTheme,
    updateActiveThemeColors,
    updateActiveThemeTypography,
    updateActiveThemeLayout
  };
});
