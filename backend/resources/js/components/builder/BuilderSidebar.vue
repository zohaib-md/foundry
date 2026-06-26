<script setup lang="ts">
import { useBuilderStore } from '../../stores/useBuilderStore';
import type { ComponentType } from '../../types/builder';

const store = useBuilderStore();

const emit = defineEmits<{
  (e: 'add', type: ComponentType): void;
}>();

const blocks: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'container', label: 'Layout Box', icon: 'M4 4h16v16H4zM4 12h16' },
  { type: 'heading', label: 'Heading', icon: 'M4 6h16M4 12h16M4 18h7' },
  { type: 'text', label: 'Text', icon: 'M4 6h16M4 12h16M4 18h16' },
  { type: 'button', label: 'Button', icon: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm4 6h8' },
  { type: 'image', label: 'Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const templates = [
  { name: 'hero', label: 'Hero Section' },
  { name: 'features', label: 'Features Grid' },
  { name: 'cta', label: 'Call to Action' },
] as const;

</script>

<template>
  <div class="sidebar">
    <div class="sidebar-section">
      <div class="section-header">
        <h2>Components</h2>
        <p>Click to add to canvas</p>
      </div>
      
      <div class="components-grid">
        <div
          v-for="block in blocks"
          :key="block.type"
          @click="emit('add', block.type)"
          class="component-card"
        >
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path :d="block.icon" />
            </svg>
          </div>
          <span class="card-label">{{ block.label }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <div class="section-header">
        <h2>Templates</h2>
        <p>Pre-built sections</p>
      </div>
      
      <div class="templates-list">
        <div
          v-for="template in templates"
          :key="template.name"
          @click="store.addTemplate(template.name)"
          class="template-card"
        >
          <div class="template-preview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <span class="template-label">{{ template.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  z-index: var(--z-panel);
}

.sidebar-section {
  padding: var(--space-4);
}

.section-header {
  margin-bottom: var(--space-3);
}

.section-header h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-header p {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.sidebar-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0 var(--space-4);
}

/* ---- Components Grid ---- */
.components-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.component-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.component-card:hover {
  border-color: var(--color-border-focus);
  background: var(--color-surface-alt);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.card-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-card:hover .card-icon {
  color: var(--color-accent);
}

.card-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.component-card:hover .card-label {
  color: var(--color-text-primary);
}

/* ---- Templates List ---- */
.templates-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.template-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.template-card:hover {
  border-color: var(--color-border-focus);
  background: var(--color-surface-alt);
  box-shadow: var(--shadow-sm);
}

.template-preview {
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
}

.template-card:hover .template-preview {
  color: var(--color-accent);
}

.template-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.template-card:hover .template-label {
  color: var(--color-text-primary);
}
</style>
