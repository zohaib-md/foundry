<script setup lang="ts">
import { useInsertPanel } from '../../composables/useInsertPanel';
import type { ComponentType } from '../../types/builder';

const emit = defineEmits<{
  (e: 'add', type: ComponentType): void;
}>();

const {
  searchQuery,
  filteredComponents,
  recentComponents,
  favoriteComponents,
  categories,
  addToRecent,
  toggleFavorite,
  isFavorite,
  toggleCategory,
  isCategoryCollapsed,
} = useInsertPanel();

const handleAdd = (type: string, available: boolean) => {
  if (!available) return;
  addToRecent(type);
  emit('add', type as ComponentType);
};
</script>

<template>
  <div class="component-library">

    <!-- ═══ Favorites ═══ -->
    <div v-if="favoriteComponents.length > 0 && !searchQuery" class="lib-section favorites-section">
      <div class="section-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Favorites
      </div>
      <div class="favorites-row">
        <button
          v-for="comp in favoriteComponents"
          :key="comp.type"
          class="favorite-chip"
          :class="{ unavailable: !comp.available }"
          @click="handleAdd(comp.type, comp.available)"
          :title="comp.label"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="comp.icon" />
          </svg>
          <span>{{ comp.label }}</span>
        </button>
      </div>
    </div>

    <!-- ═══ Recently Used ═══ -->
    <div v-if="recentComponents.length > 0 && !searchQuery" class="lib-section recents-section">
      <div class="section-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        Recently Used
      </div>
      <div class="recents-row">
        <button
          v-for="comp in recentComponents"
          :key="comp.type"
          class="recent-chip"
          @click="handleAdd(comp.type, comp.available)"
          :title="comp.label"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="comp.icon" />
          </svg>
          <span>{{ comp.label }}</span>
        </button>
      </div>
    </div>

    <!-- ═══ Divider (after recents/favorites) ═══ -->
    <div v-if="(favoriteComponents.length > 0 || recentComponents.length > 0) && !searchQuery" class="lib-divider"></div>

    <!-- ═══ Categorized Components ═══ -->
    <div
      v-for="cat in categories"
      :key="cat.id"
      class="lib-section category-section"
    >
      <template v-if="filteredComponents[cat.id]">
        <button
          class="category-header"
          @click="toggleCategory(cat.id)"
        >
          <div class="category-title">
            <span>{{ cat.label }}</span>
            <span class="category-count">{{ filteredComponents[cat.id].length }}</span>
          </div>
          <svg
            class="category-chevron"
            :class="{ collapsed: isCategoryCollapsed(cat.id) }"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <Transition name="collapse">
          <div v-if="!isCategoryCollapsed(cat.id)" class="category-grid">
            <div
              v-for="comp in filteredComponents[cat.id]"
              :key="comp.type"
              class="comp-card"
              :class="{ unavailable: !comp.available }"
              @click="handleAdd(comp.type, comp.available)"
            >
              <!-- Favorite toggle -->
              <button
                v-if="comp.available"
                class="fav-toggle"
                :class="{ active: isFavorite(comp.type) }"
                @click.stop="toggleFavorite(comp.type)"
                :title="isFavorite(comp.type) ? 'Remove from favorites' : 'Add to favorites'"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" :fill="isFavorite(comp.type) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>

              <!-- Coming Soon Badge -->
              <span v-if="!comp.available" class="soon-badge">Soon</span>

              <div class="comp-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="comp.icon" />
                </svg>
              </div>
              <span class="comp-name">{{ comp.label }}</span>
              <span class="comp-desc">{{ comp.description }}</span>
            </div>
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.component-library {
  padding: var(--space-2) 0;
}

/* ---- Section Labels ---- */
.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 var(--space-3);
  margin-bottom: var(--space-2);
}

/* ---- Favorites Row ---- */
.lib-section {
  padding: var(--space-2) 0;
}

.favorites-row,
.recents-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 var(--space-3);
}

.favorite-chip,
.recent-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.favorite-chip:hover,
.recent-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.favorite-chip.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---- Divider ---- */
.lib-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: var(--space-1) var(--space-3);
}

/* ---- Category Header ---- */
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-1) var(--space-3);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-ui);
  transition: all var(--transition-fast);
}

.category-header:hover {
  background: var(--color-overlay);
}

.category-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.category-title span:first-child {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.category-count {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  background: var(--color-surface-alt);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.category-chevron {
  color: var(--color-text-tertiary);
  transition: transform var(--transition-normal);
}

.category-chevron.collapsed {
  transform: rotate(-90deg);
}

/* ---- Component Cards Grid ---- */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: var(--space-2) var(--space-3) var(--space-1);
}

.comp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-3) var(--space-2) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.comp-card:hover {
  border-color: var(--color-accent-border);
  background: var(--color-surface-alt);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.comp-card.unavailable {
  opacity: 0.45;
  cursor: not-allowed;
}

.comp-card.unavailable:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-border);
  background: var(--color-surface);
}

/* ---- Favorite Toggle ---- */
.fav-toggle {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-fast);
}

.comp-card:hover .fav-toggle {
  opacity: 1;
}

.fav-toggle.active {
  opacity: 1;
  color: var(--color-accent);
}

.fav-toggle:hover {
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

/* ---- Coming Soon Badge ---- */
.soon-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 8px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: 1px 5px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ---- Card Content ---- */
.comp-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.comp-card:hover .comp-icon {
  color: var(--color-accent);
}

.comp-name {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.comp-desc {
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-align: center;
  line-height: 1.3;
}

.comp-card:hover .comp-name {
  color: var(--color-accent-hover);
}

/* ---- Collapse Transition ---- */
.collapse-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
