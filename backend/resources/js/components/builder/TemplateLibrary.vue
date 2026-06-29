<script setup lang="ts">
import { useInsertPanel } from '../../composables/useInsertPanel';
import { useBuilderStore } from '../../stores/useBuilderStore';
import type { TemplateDefinition } from '../../data/templateRegistry';

const { filteredTemplates, templateCategories, activeTemplateCategory, setTemplateCategory } = useInsertPanel();
const store = useBuilderStore();

const handleInsert = (template: TemplateDefinition) => {
  store.addTemplateFromRegistry(template);
};
</script>

<template>
  <div class="template-library">

    <!-- ═══ Category Filter Pills ═══ -->
    <div class="filter-pills">
      <button
        class="pill"
        :class="{ active: !activeTemplateCategory }"
        @click="setTemplateCategory(null)"
      >All</button>
      <button
        v-for="cat in templateCategories"
        :key="cat.id"
        class="pill"
        :class="{ active: activeTemplateCategory === cat.id }"
        @click="setTemplateCategory(cat.id)"
      >{{ cat.label }}</button>
    </div>

    <!-- ═══ Template Cards ═══ -->
    <div class="templates-grid">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="tmpl-card"
        @click="handleInsert(template)"
      >
        <!-- Gradient Thumbnail -->
        <div
          class="tmpl-thumb"
          :style="{
            background: `linear-gradient(135deg, ${template.accentColor} 0%, ${template.secondaryColor} 100%)`,
          }"
        >
          <!-- Decorative wireframe lines -->
          <div class="thumb-wireframe">
            <div class="wire-line wire-title"></div>
            <div class="wire-line wire-text"></div>
            <div class="wire-line wire-text short"></div>
            <div class="wire-line wire-btn"></div>
          </div>

          <!-- Hover overlay with Insert button -->
          <div class="tmpl-hover-overlay">
            <button class="insert-btn" @click.stop="handleInsert(template)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Insert
            </button>
          </div>
        </div>

        <!-- Card Info -->
        <div class="tmpl-info">
          <span class="tmpl-name">{{ template.name }}</span>
          <span class="tmpl-desc">{{ template.description }}</span>
        </div>
      </div>
    </div>

    <!-- Empty state for filtered templates -->
    <div v-if="filteredTemplates.length === 0" class="tmpl-empty">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
      <p>No templates in this category</p>
    </div>
  </div>
</template>

<style scoped>
.template-library {
  padding: var(--space-2) 0;
}

/* ---- Filter Pills ---- */
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: var(--space-2) var(--space-3);
}

.pill {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-ui);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.pill:hover {
  border-color: var(--color-border-focus);
  color: var(--color-text-primary);
}

.pill.active {
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-text-primary);
}

/* ---- Templates Grid ---- */
.templates-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
}

/* ---- Template Card ---- */
.tmpl-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.tmpl-card:hover {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-md);
  transform: scale(1.015);
}

/* ---- Thumbnail ---- */
.tmpl-thumb {
  position: relative;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Wireframe decoration */
.thumb-wireframe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0.25;
}

.wire-line {
  border-radius: 2px;
  background: white;
}

.wire-title {
  width: 80px;
  height: 8px;
}

.wire-text {
  width: 120px;
  height: 4px;
}

.wire-text.short {
  width: 80px;
}

.wire-btn {
  width: 50px;
  height: 10px;
  border-radius: 3px;
  margin-top: 2px;
}

/* ---- Hover Overlay ---- */
.tmpl-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tmpl-card:hover .tmpl-hover-overlay {
  opacity: 1;
}

.insert-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 14px;
  background: white;
  color: #171717;
  border: none;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: all var(--transition-fast);
  transform: translateY(6px);
}

.tmpl-card:hover .insert-btn {
  transform: translateY(0);
}

.insert-btn:hover {
  background: #f5f5f5;
}

/* ---- Card Info ---- */
.tmpl-info {
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tmpl-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.tmpl-desc {
  font-size: 11px;
  color: var(--color-text-tertiary);
  line-height: 1.3;
}

/* ---- Empty State ---- */
.tmpl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-10) var(--space-4);
  gap: var(--space-2);
  color: var(--color-text-tertiary);
}

.tmpl-empty p {
  font-size: 13px;
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
