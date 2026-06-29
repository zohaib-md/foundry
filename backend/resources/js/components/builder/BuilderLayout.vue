<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BuilderCanvas from './BuilderCanvas.vue';
import InsertPanel from './InsertPanel.vue';
import PropertyEditor from './PropertyEditor.vue';
import ExportModal from './ExportModal.vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import { useThemeStore } from '../../stores/useThemeStore';
import type { DeviceMode } from '../../types/builder';

const store = useBuilderStore();
const themeStore = useThemeStore();
const deviceMode = ref<DeviceMode>('desktop');
const showSaveToast = ref(false);
const showExportModal = ref(false);
const isDarkMode = ref(false);

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const handleSave = () => {
  emit('save');
  showSaveToast.value = true;
  setTimeout(() => { showSaveToast.value = false; }, 2400);
};

const themeVars = computed(() => {
  const theme = themeStore.activeTheme;
  return {
    '--theme-color-primary': theme.colors.primary,
    '--theme-color-secondary': theme.colors.secondary,
    '--theme-color-accent': theme.colors.accent,
    '--theme-color-background': theme.colors.background,
    '--theme-color-surface': theme.colors.surface,
    '--theme-color-textPrimary': theme.colors.textPrimary,
    '--theme-color-textSecondary': theme.colors.textSecondary,
    '--theme-color-border': theme.colors.border,
    
    '--theme-font-heading': `"${theme.typography.headingFont}", var(--font-ui)`,
    '--theme-font-body': `"${theme.typography.bodyFont}", var(--font-ui)`,
    '--theme-font-size-base': theme.typography.baseFontSize,
    
    '--theme-radius': theme.layout.borderRadius,
    '--theme-container': theme.layout.containerWidth,
    '--theme-spacing': theme.layout.spacing,
  };
});

const handleKeydown = (e: KeyboardEvent) => {
  // Check for Cmd/Ctrl + Z
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) {
      store.redo();
    } else {
      store.undo();
    }
    e.preventDefault();
  }
  // Check for Cmd/Ctrl + Y
  else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
    store.redo();
    e.preventDefault();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.documentElement.setAttribute('data-theme', 'light');
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="foundry-layout" :style="themeVars">

    <!-- Top Bar -->
    <header class="foundry-header">
      <div class="header-left">
        <div class="foundry-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <span class="foundry-wordmark">Foundry</span>
        
        <div class="history-controls">
          <button 
            class="history-btn" 
            :disabled="store.past.length === 0"
            @click="store.undo()"
            title="Undo (Cmd+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </button>
          <button 
            class="history-btn" 
            :disabled="store.future.length === 0"
            @click="store.redo()"
            title="Redo (Cmd+Shift+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Device Preview Toggles -->
      <div class="device-toggles">
        <button
          :class="['device-btn', { active: deviceMode === 'desktop' }]"
          @click="deviceMode = 'desktop'"
          title="Desktop"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Desktop</span>
        </button>
        <button
          :class="['device-btn', { active: deviceMode === 'tablet' }]"
          @click="deviceMode = 'tablet'"
          title="Tablet"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
          <span>Tablet</span>
        </button>
        <button
          :class="['device-btn', { active: deviceMode === 'mobile' }]"
          @click="deviceMode = 'mobile'"
          title="Mobile"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
          <span>Mobile</span>
        </button>
      </div>

      <div class="header-right">
        <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg v-if="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button class="export-link" @click="showExportModal = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Export Code
        </button>
        <router-link to="/preview" class="preview-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          Preview
        </router-link>
        <button class="save-btn" @click="handleSave">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17,21 17,13 7,13 7,21" /><polyline points="7,3 7,8 15,8" />
          </svg>
          Save
        </button>
      </div>
    </header>

    <!-- Save Toast -->
    <Transition name="toast">
      <div v-if="showSaveToast" class="save-toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Page saved
      </div>
    </Transition>

    <!-- Main Workspace -->
    <div class="foundry-workspace">
      <InsertPanel @add="(type) => {
        const isContainerSelected = store.selectedComponent && ['container', 'section', 'columns', 'grid', 'form'].includes(store.selectedComponent.type);
        const parentId = isContainerSelected ? store.selectedComponentId : undefined;
        store.addComponent(type, undefined, parentId ?? undefined);
      }" />
      <BuilderCanvas :device-mode="deviceMode" />
      <PropertyEditor />
    </div>

    <!-- Export Modal -->
    <ExportModal 
      v-if="showExportModal" 
      :components="store.components" 
      @close="showExportModal = false" 
    />

  </div>
</template>

<style scoped>
.foundry-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg);
}

/* ---- Header ---- */
.foundry-header {
  height: 52px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  flex-shrink: 0;
  z-index: var(--z-header);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.foundry-logo {
  width: 30px;
  height: 30px;
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.foundry-wordmark {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}

/* ---- History Controls ---- */
.history-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: var(--space-4);
  padding-left: var(--space-4);
  border-left: 1px solid var(--color-border);
}

.history-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.history-btn:hover:not(:disabled) {
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
}

.history-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---- Device Toggles ---- */
.device-toggles {
  display: flex;
  align-items: center;
  background: var(--color-overlay);
  border-radius: var(--radius-md);
  padding: 3px;
}

.device-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 5px 10px;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-ui);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.device-btn:hover {
  color: var(--color-text-secondary);
}

.device-btn.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
}

/* ---- Header Right ---- */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  color: var(--color-text-primary);
  background: var(--color-overlay);
}

.preview-link, .export-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.preview-link:hover, .export-link:hover {
  color: var(--color-text-primary);
  background: var(--color-overlay);
}

.save-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-ui);
  color: var(--color-text-inverse);
  background: var(--color-accent);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-xs);
}

.save-btn:hover {
  background: var(--color-accent-hover);
}

/* ---- Toast ---- */
.save-toast {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 20px;
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
}

.toast-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(12px); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(4px); }

/* ---- Workspace ---- */
.foundry-workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
