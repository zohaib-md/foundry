<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import BuilderCanvas from './BuilderCanvas.vue';
import AiPromptBar from './AiPromptBar.vue';
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
  store.markSaved();
  emit('save');
  showSaveToast.value = true;
  setTimeout(() => { showSaveToast.value = false; }, 2400);
};

const isGeneratingPreview = ref(false);

const generatePreviewLink = async (e: Event) => {
  e.preventDefault();
  
  // Open the window immediately to avoid popup blockers
  const newWin = window.open('about:blank', '_blank');
  if (!newWin) {
    alert('Please allow popups to view the preview link.');
    return;
  }

  isGeneratingPreview.value = true;
  try {
    const res = await axios.post('/api/pages', {
      title: 'Draft Preview',
      status: 'draft',
      components: store.components
    });
    
    const slug = res.data.data.slug;
    // Redirect the new window to the generated link
    newWin.location.href = `/p/${slug}`;
  } catch (err) {
    console.error('Failed to generate preview:', err);
    newWin.close();
    alert('Failed to generate independent preview link.');
  } finally {
    isGeneratingPreview.value = false;
  }
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

const toggleTheme = (event: MouseEvent) => {
  const willBeDark = !isDarkMode.value;

  // Fallback for browsers that don't support View Transitions API
  if (!document.startViewTransition) {
    isDarkMode.value = willBeDark;
    document.documentElement.setAttribute('data-theme', willBeDark ? 'dark' : 'light');
    return;
  }

  // Get the click position, or default to bottom-left (0, window.innerHeight)
  const x = event?.clientX ?? 0;
  const y = event?.clientY ?? window.innerHeight;
  // Sweep from bottom-left (0, innerHeight) to top-right
  const sweepX = 0;
  const sweepY = window.innerHeight;
  
  const endRadius = Math.hypot(
    Math.max(sweepX, window.innerWidth - sweepX),
    Math.max(sweepY, window.innerHeight - sweepY)
  );

  const transition = document.startViewTransition(() => {
    isDarkMode.value = willBeDark;
    document.documentElement.setAttribute('data-theme', willBeDark ? 'dark' : 'light');
    // Set a class to help CSS know the direction of transition
    if (willBeDark) {
      document.documentElement.classList.add('transitioning-to-dark');
      document.documentElement.classList.remove('transitioning-to-light');
    } else {
      document.documentElement.classList.add('transitioning-to-light');
      document.documentElement.classList.remove('transitioning-to-dark');
    }
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${sweepX}px ${sweepY}px)`,
      `circle(${endRadius}px at ${sweepX}px ${sweepY}px)`
    ];

    document.documentElement.animate(
      {
        clipPath: willBeDark ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 800,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        pseudoElement: willBeDark ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    );
  });

  transition.finished.then(() => {
    document.documentElement.classList.remove('transitioning-to-dark', 'transitioning-to-light');
  });
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
        <router-link to="/" class="brand-link">
          <div class="foundry-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <span class="foundry-wordmark">Foundry</span>
        </router-link>
        
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
        <button class="premium-theme-toggle" :class="isDarkMode ? 'dark-mode' : 'light-mode'" @click="toggleTheme" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <span class="toggle-text left-text">DARK<br>MODE</span>
          <span class="toggle-text right-text">LIGHT<br>MODE</span>
          <div class="toggle-thumb">
            <svg v-if="!isDarkMode" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>
        </button>
        <button class="export-link" @click="showExportModal = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Export Code
        </button>
        <button class="preview-link" @click="generatePreviewLink" :disabled="isGeneratingPreview">
          <svg v-if="!isGeneratingPreview" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          <svg v-else class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="22" y1="12" x2="18" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          {{ isGeneratingPreview ? 'Generating...' : 'Preview' }}
        </button>
        <button class="save-btn" :disabled="!store.isDirty" @click="handleSave" :title="store.isDirty ? 'Save changes' : 'No changes to save'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
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
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        <AiPromptBar />
        <BuilderCanvas :device-mode="deviceMode" />
      </div>
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

<style>
/* View Transition API Overrides */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* When going to Dark mode, the NEW state sweeps OVER the old state */
html.transitioning-to-dark::view-transition-old(root) {
  z-index: 1;
}
html.transitioning-to-dark::view-transition-new(root) {
  z-index: 2;
}

/* When going to Light mode, the OLD state shrinks AWAY to reveal the new state underneath */
html.transitioning-to-light::view-transition-old(root) {
  z-index: 2;
}
html.transitioning-to-light::view-transition-new(root) {
  z-index: 1;
}
</style>

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

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.brand-link:hover {
  opacity: 0.8;
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

.premium-theme-toggle {
  position: relative;
  display: flex;
  align-items: center;
  width: 90px;
  height: 36px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  outline: none;
  font-family: var(--font-ui);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  padding: 0;
}

/* Light Mode Neumorphism */
.premium-theme-toggle.light-mode {
  background: #E8ECEF;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7);
}

/* Dark Mode Neumorphism */
.premium-theme-toggle.dark-mode {
  background: #232732;
  box-shadow: inset 3px 3px 6px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(255,255,255,0.05);
}

.toggle-text {
  position: absolute;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
  z-index: 1;
  user-select: none;
  text-align: left;
}

.left-text {
  left: 12px;
}
.right-text {
  right: 12px;
}

.premium-theme-toggle.light-mode .toggle-text { color: #9CA3AF; }
.premium-theme-toggle.dark-mode .toggle-text { color: #6B7280; }

.premium-theme-toggle.light-mode .left-text { opacity: 0; transform: translateX(-10px); }
.premium-theme-toggle.light-mode .right-text { opacity: 1; transform: translateX(0); }

.premium-theme-toggle.dark-mode .left-text { opacity: 1; transform: translateX(0); }
.premium-theme-toggle.dark-mode .right-text { opacity: 0; transform: translateX(10px); }

/* Thumb */
.toggle-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s, box-shadow 0.4s;
  z-index: 2;
}

.premium-theme-toggle.light-mode .toggle-thumb {
  background: #F3F4F6;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.15), -1px -1px 3px rgba(255,255,255,0.8);
  color: #9CA3AF;
  transform: translateX(0);
}

.premium-theme-toggle.dark-mode .toggle-thumb {
  background: #374151;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.1);
  color: #9CA3AF;
  transform: translateX(54px);
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

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: #000;
  border: 2px solid #fff;
  border-radius: 9999px; /* Pill shape */
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 4px 0px 0px #fff; /* Solid white shadow */
  margin-right: 4px; /* Give room for shadow */
}

.save-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #fff;
}

.save-btn:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px #fff;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

html[data-theme="light"] .save-btn {
  color: #000;
  background: #fff;
  border-color: #000;
  box-shadow: 4px 4px 0px 0px #000;
}

html[data-theme="light"] .save-btn:hover:not(:disabled) {
  box-shadow: 2px 2px 0px 0px #000;
}

html[data-theme="light"] .save-btn:active:not(:disabled) {
  box-shadow: 0px 0px 0px 0px #000;
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
