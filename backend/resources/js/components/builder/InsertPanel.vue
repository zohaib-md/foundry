<script setup lang="ts">
import { useInsertPanel } from '../../composables/useInsertPanel';
import InsertSearch from './InsertSearch.vue';
import ComponentLibrary from './ComponentLibrary.vue';
import TemplateLibrary from './TemplateLibrary.vue';
import type { ComponentType } from '../../types/builder';

const { activeTab, searchQuery, hasSearchResults } = useInsertPanel();

const emit = defineEmits<{
  (e: 'add', type: ComponentType): void;
}>();
</script>

<template>
  <div class="insert-panel">

    <!-- ═══ Tab Bar ═══ -->
    <div class="panel-tabs">
      <button
        class="panel-tab"
        :class="{ active: activeTab === 'components' }"
        @click="activeTab = 'components'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
        Components
      </button>
      <button
        class="panel-tab"
        :class="{ active: activeTab === 'templates' }"
        @click="activeTab = 'templates'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Templates
      </button>
    </div>

    <!-- ═══ Search ═══ -->
    <InsertSearch />

    <!-- ═══ Content ═══ -->
    <div class="panel-content" v-if="!searchQuery || hasSearchResults">
      <ComponentLibrary
        v-if="activeTab === 'components'"
        @add="(type) => emit('add', type)"
      />
      <TemplateLibrary
        v-if="activeTab === 'templates'"
      />
    </div>
  </div>
</template>

<style scoped>
.insert-panel {
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  z-index: var(--z-panel);
}

/* ---- Tab Bar ---- */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.panel-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: 10px var(--space-2);
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-ui);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.panel-tab:hover {
  color: var(--color-text-secondary);
  background: var(--color-overlay);
}

.panel-tab.active {
  color: var(--color-text-primary);
}

.panel-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--space-3);
  right: var(--space-3);
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 1px;
}

/* ---- Panel Content ---- */
.panel-content {
  flex: 1;
  overflow-y: auto;
}
</style>
