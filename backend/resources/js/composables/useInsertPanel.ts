import { ref, computed } from 'vue';
import type { ComponentType } from '../types/builder';
import { COMPONENT_REGISTRY, CATEGORIES, searchComponents } from '../data/componentRegistry';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES, searchTemplates } from '../data/templateRegistry';
import type { ComponentDefinition } from '../data/componentRegistry';
import type { TemplateDefinition } from '../data/templateRegistry';

const STORAGE_KEY_RECENTS = 'foundry:recentlyUsed';
const STORAGE_KEY_FAVORITES = 'foundry:favorites';
const MAX_RECENTS = 4;

// ---- Persistence Helpers ----
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore quota errors */ }
};

// ---- Shared Singleton State (outside function for cross-component sharing) ----
const searchQuery = ref('');
const activeTab = ref<'components' | 'templates'>('components');
const recentlyUsed = ref<string[]>(loadFromStorage(STORAGE_KEY_RECENTS, []));
const favorites = ref<string[]>(loadFromStorage(STORAGE_KEY_FAVORITES, []));
const collapsedCategories = ref<Set<string>>(new Set());
const activeTemplateCategory = ref<string | null>(null);

export function useInsertPanel() {

  // ---- Computed: Filtered Components ----
  const filteredComponents = computed(() => {
    const results = searchComponents(searchQuery.value);
    const grouped: Record<string, ComponentDefinition[]> = {};

    for (const cat of CATEGORIES) {
      const items = results.filter(c => c.category === cat.id);
      if (items.length > 0) {
        grouped[cat.id] = items;
      }
    }
    return grouped;
  });

  // ---- Computed: Filtered Templates ----
  const filteredTemplates = computed(() => {
    let results = searchTemplates(searchQuery.value);
    if (activeTemplateCategory.value) {
      results = results.filter(t => t.category === activeTemplateCategory.value);
    }
    return results;
  });

  // ---- Computed: Recently Used Components ----
  const recentComponents = computed(() => {
    return recentlyUsed.value
      .map(type => COMPONENT_REGISTRY.find(c => c.type === type))
      .filter((c): c is ComponentDefinition => !!c && c.available);
  });

  // ---- Computed: Favorite Components ----
  const favoriteComponents = computed(() => {
    return favorites.value
      .map(type => COMPONENT_REGISTRY.find(c => c.type === type))
      .filter((c): c is ComponentDefinition => !!c);
  });

  // ---- Computed: Has search results ----
  const hasSearchResults = computed(() => {
    if (activeTab.value === 'components') {
      return Object.keys(filteredComponents.value).length > 0;
    }
    return filteredTemplates.value.length > 0;
  });

  // ---- Actions ----
  const addToRecent = (type: string) => {
    const filtered = recentlyUsed.value.filter(t => t !== type);
    filtered.unshift(type);
    recentlyUsed.value = filtered.slice(0, MAX_RECENTS);
    saveToStorage(STORAGE_KEY_RECENTS, recentlyUsed.value);
  };

  const toggleFavorite = (type: string) => {
    const idx = favorites.value.indexOf(type);
    if (idx >= 0) {
      favorites.value.splice(idx, 1);
    } else {
      favorites.value.push(type);
    }
    saveToStorage(STORAGE_KEY_FAVORITES, favorites.value);
  };

  const isFavorite = (type: string): boolean => {
    return favorites.value.includes(type);
  };

  const toggleCategory = (category: string) => {
    if (collapsedCategories.value.has(category)) {
      collapsedCategories.value.delete(category);
    } else {
      collapsedCategories.value.add(category);
    }
  };

  const isCategoryCollapsed = (category: string): boolean => {
    return collapsedCategories.value.has(category);
  };

  const setTemplateCategory = (category: string | null) => {
    activeTemplateCategory.value = activeTemplateCategory.value === category ? null : category;
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  return {
    // State
    searchQuery,
    activeTab,
    activeTemplateCategory,

    // Computed
    filteredComponents,
    filteredTemplates,
    recentComponents,
    favoriteComponents,
    hasSearchResults,

    // Category data
    categories: CATEGORIES,
    templateCategories: TEMPLATE_CATEGORIES,

    // Actions
    addToRecent,
    toggleFavorite,
    isFavorite,
    toggleCategory,
    isCategoryCollapsed,
    setTemplateCategory,
    clearSearch,
  };
}
