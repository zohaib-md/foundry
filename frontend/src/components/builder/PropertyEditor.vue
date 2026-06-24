<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../types/builder';

const store = useBuilderStore();

const selectedComponent = computed(() => store.selectedComponent);

const updateProp = (key: string, value: any) => {
  if (store.selectedComponentId) {
    store.updateComponentProps(store.selectedComponentId, { [key]: value });
  }
};

const updateStyle = (key: string, value: any) => {
  if (store.selectedComponentId) {
    store.updateComponentStyles(store.selectedComponentId, { [key]: value });
  }
};
</script>

<template>
  <div class="property-panel">
    
    <div class="panel-header">
      <h2>Properties</h2>
      <span v-if="selectedComponent" class="type-badge">{{ selectedComponent.type }}</span>
    </div>

    <div class="panel-content">
      
      <!-- Empty State -->
      <div v-if="!selectedComponent" class="empty-state">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <p>Select a component to edit its properties.</p>
      </div>

      <div v-else class="properties-list">
        
        <!-- SECTION: CONTENT -->
        <div class="property-section">
          <h3>Content</h3>

          <div class="form-group" v-if="'text' in selectedComponent.props">
            <label>Text</label>
            <textarea
              class="input-control"
              rows="3"
              :value="selectedComponent.props.text"
              @input="e => updateProp('text', (e.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>

          <div class="form-group" v-if="'url' in selectedComponent.props">
            <label>Link URL</label>
            <input
              type="text"
              class="input-control"
              :value="selectedComponent.props.url"
              @input="e => updateProp('url', (e.target as HTMLInputElement).value)"
            />
          </div>

          <!-- Specific Props -->
          <div class="form-group" v-if="selectedComponent.type === 'heading'">
            <label>Heading Level</label>
            <select
              class="input-control"
              :value="selectedComponent.props.level"
              @change="e => updateProp('level', (e.target as HTMLSelectElement).value)"
            >
              <option value="h1">Heading 1 (H1)</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="h4">Heading 4 (H4)</option>
            </select>
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'button'">
            <label>Button Style</label>
            <select
              class="input-control"
              :value="selectedComponent.props.variant"
              @change="e => updateProp('variant', (e.target as HTMLSelectElement).value)"
            >
              <option value="primary">Primary (Solid)</option>
              <option value="secondary">Secondary (Light)</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'image'">
            <label>Image Width</label>
            <input
              type="text"
              class="input-control"
              placeholder="e.g. 100%, 300px"
              :value="selectedComponent.props.width"
              @input="e => updateProp('width', (e.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="section-divider"></div>

        <!-- SECTION: TYPOGRAPHY -->
        <div class="property-section" v-if="['heading', 'text', 'button'].includes(selectedComponent.type)">
          <h3>Typography</h3>

          <div class="form-group">
            <label>Font Family</label>
            <select
              class="input-control"
              :value="selectedComponent.styles?.fontFamily || 'Geist'"
              @change="e => updateStyle('fontFamily', (e.target as HTMLSelectElement).value)"
            >
              <option v-for="font in FONT_FAMILIES" :key="font" :value="font">{{ font }}</option>
            </select>
          </div>

          <div class="grid-2-col">
            <div class="form-group">
              <label>Weight</label>
              <select
                class="input-control"
                :value="selectedComponent.styles?.fontWeight || '400'"
                @change="e => updateStyle('fontWeight', (e.target as HTMLSelectElement).value)"
              >
                <option v-for="weight in FONT_WEIGHTS" :key="weight.value" :value="weight.value">{{ weight.label }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Size</label>
              <select
                class="input-control"
                :value="selectedComponent.styles?.fontSize || ''"
                @change="e => updateStyle('fontSize', (e.target as HTMLSelectElement).value)"
              >
                <option value="">Default</option>
                <option v-for="size in FONT_SIZES" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
          </div>

          <div class="form-group" v-if="'alignment' in selectedComponent.props">
            <label>Alignment</label>
            <div class="segmented-control">
              <button
                v-for="align in ['left', 'center', 'right']"
                :key="align"
                class="segment-btn"
                :class="{ active: selectedComponent.styles?.textAlign === align || (!selectedComponent.styles?.textAlign && selectedComponent.props.alignment === align) }"
                @click="updateStyle('textAlign', align)"
              >
                <svg v-if="align === 'left'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                <svg v-if="align === 'center'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
                <svg v-if="align === 'right'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Color</label>
            <div class="color-picker-wrapper">
              <input
                type="color"
                class="color-input"
                :value="selectedComponent.styles?.color || selectedComponent.props.color || '#171717'"
                @input="e => updateStyle('color', (e.target as HTMLInputElement).value)"
              />
              <span class="color-value">{{ selectedComponent.styles?.color || selectedComponent.props.color || '#171717' }}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.property-panel {
  width: var(--panel-width);
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: var(--z-panel);
}

.panel-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.type-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* ---- Empty State ---- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  color: var(--color-text-tertiary);
  text-align: center;
  height: 100%;
}

.empty-state svg {
  margin-bottom: var(--space-3);
  opacity: 0.5;
}

.empty-state p {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

/* ---- Properties List ---- */
.properties-list {
  display: flex;
  flex-direction: column;
}

.property-section {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.property-section h3 {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.section-divider {
  height: 1px;
  background: var(--color-border-light);
}

/* ---- Form Controls ---- */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-control {
  width: 100%;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px 8px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-control:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

textarea.input-control {
  resize: vertical;
  min-height: 60px;
}

/* ---- Segmented Control ---- */
.segmented-control {
  display: flex;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2px;
}

.segment-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.segment-btn:hover {
  color: var(--color-text-secondary);
}

.segment-btn.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-xs);
}

/* ---- Color Picker ---- */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.color-input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: none;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.color-value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}
</style>
