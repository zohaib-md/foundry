<script setup lang="ts">
import { useInsertPanel } from '../../composables/useInsertPanel';

const { searchQuery, clearSearch, hasSearchResults, activeTab } = useInsertPanel();
</script>

<template>
  <div class="insert-search">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="activeTab === 'components' ? 'Search components…' : 'Search templates…'"
        class="search-input"
      />
      <button v-if="searchQuery" class="search-clear" @click="clearSearch">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="searchQuery && !hasSearchResults" class="search-empty">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M8 8l6 6M14 8l-6 6" />
      </svg>
      <p>No results found for <strong>"{{ searchQuery }}"</strong></p>
      <span>Try another keyword</span>
    </div>
  </div>
</template>

<style scoped>
.insert-search {
  padding: var(--space-3) var(--space-3) 0;
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--color-surface);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 34px;
  padding: 0 32px 0 32px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 12.5px;
  font-family: var(--font-ui);
  outline: none;
  transition: all var(--transition-fast);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-subtle);
  background: var(--color-surface);
}

.search-clear {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--color-overlay);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-10) var(--space-4);
  gap: var(--space-2);
  color: var(--color-text-tertiary);
}

.search-empty p {
  font-size: 13px;
  margin: 0;
  color: var(--color-text-secondary);
}

.search-empty span {
  font-size: 12px;
}
</style>
