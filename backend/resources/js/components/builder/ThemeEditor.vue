<script setup lang="ts">
import { useThemeStore } from '../../stores/useThemeStore';
import { FONT_FAMILIES } from '../../types/builder';

const themeStore = useThemeStore();
</script>

<template>
  <div class="theme-editor">
    <div class="theme-section">
      <h3>Active Theme</h3>
      <div class="theme-list">
        <button
          v-for="theme in themeStore.themes"
          :key="theme.id"
          class="theme-preset-btn"
          :class="{ active: themeStore.activeThemeId === theme.id }"
          @click="themeStore.setActiveTheme(theme.id)"
        >
          <div class="theme-preview-colors">
            <span :style="{ backgroundColor: theme.colors.background }"></span>
            <span :style="{ backgroundColor: theme.colors.primary }"></span>
            <span :style="{ backgroundColor: theme.colors.accent }"></span>
          </div>
          <span class="theme-name">{{ theme.name }}</span>
        </button>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="theme-section">
      <h3>Brand Colors</h3>
      <div class="color-grid">
        <div class="color-item">
          <label>Primary</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.primary" @input="e => themeStore.updateActiveThemeColors({ primary: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Secondary</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.secondary" @input="e => themeStore.updateActiveThemeColors({ secondary: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Accent</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.accent" @input="e => themeStore.updateActiveThemeColors({ accent: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Background</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.background" @input="e => themeStore.updateActiveThemeColors({ background: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Surface</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.surface" @input="e => themeStore.updateActiveThemeColors({ surface: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Text Primary</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.textPrimary" @input="e => themeStore.updateActiveThemeColors({ textPrimary: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Text Secondary</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.textSecondary" @input="e => themeStore.updateActiveThemeColors({ textSecondary: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="color-item">
          <label>Border</label>
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" :value="themeStore.activeTheme.colors.border" @input="e => themeStore.updateActiveThemeColors({ border: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="theme-section">
      <h3>Typography</h3>
      
      <div class="form-group">
        <label>Heading Font</label>
        <select 
          class="input-control" 
          :value="themeStore.activeTheme.typography.headingFont" 
          @change="e => themeStore.updateActiveThemeTypography({ headingFont: (e.target as HTMLSelectElement).value })"
        >
          <option v-for="font in FONT_FAMILIES" :key="font" :value="font">{{ font }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Body Font</label>
        <select 
          class="input-control" 
          :value="themeStore.activeTheme.typography.bodyFont" 
          @change="e => themeStore.updateActiveThemeTypography({ bodyFont: (e.target as HTMLSelectElement).value })"
        >
          <option v-for="font in FONT_FAMILIES" :key="font" :value="font">{{ font }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Base Size</label>
        <input 
          type="text" 
          class="input-control" 
          :value="themeStore.activeTheme.typography.baseFontSize" 
          @input="e => themeStore.updateActiveThemeTypography({ baseFontSize: (e.target as HTMLInputElement).value })" 
        />
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="theme-section">
      <h3>Layout</h3>
      
      <div class="form-group">
        <label>Base Radius</label>
        <input 
          type="text" 
          class="input-control" 
          :value="themeStore.activeTheme.layout.borderRadius" 
          @input="e => themeStore.updateActiveThemeLayout({ borderRadius: (e.target as HTMLInputElement).value })" 
        />
      </div>
      
      <div class="form-group">
        <label>Container Width</label>
        <input 
          type="text" 
          class="input-control" 
          :value="themeStore.activeTheme.layout.containerWidth" 
          @input="e => themeStore.updateActiveThemeLayout({ containerWidth: (e.target as HTMLInputElement).value })" 
        />
      </div>
      
      <div class="form-group">
        <label>Spacing Scale</label>
        <input 
          type="text" 
          class="input-control" 
          :value="themeStore.activeTheme.layout.spacing" 
          @input="e => themeStore.updateActiveThemeLayout({ spacing: (e.target as HTMLInputElement).value })" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-editor {
  display: flex;
  flex-direction: column;
}

.theme-section {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.theme-section h3 {
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

.theme-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.theme-preset-btn {
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

.theme-preset-btn:hover {
  background: var(--color-surface-alt);
}

.theme-preset-btn.active {
  border-color: var(--color-text-primary);
  box-shadow: 0 0 0 1px var(--color-text-primary);
}

.theme-preview-colors {
  display: flex;
  border-radius: 50%;
  overflow: hidden;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(0,0,0,0.1);
}

.theme-preview-colors span {
  flex: 1;
  height: 100%;
}

.theme-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.color-item label {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
}

.color-input {
  width: 100%;
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

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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
</style>
