<script setup lang="ts">
import { ref } from 'vue';
import BuilderSidebar from './BuilderSidebar.vue';
import BuilderCanvas from './BuilderCanvas.vue';
import PropertyEditor from './PropertyEditor.vue';
import { useBuilderStore } from '../../stores/useBuilderStore';
import type { DeviceMode } from '../../types/builder';

const store = useBuilderStore();
const deviceMode = ref<DeviceMode>('desktop');
const showSaveToast = ref(false);

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const handleSave = () => {
  emit('save');
  showSaveToast.value = true;
  setTimeout(() => { showSaveToast.value = false; }, 2400);
};
</script>

<template>
  <div class="foundry-layout">

    <!-- Top Bar -->
    <header class="foundry-header">
      <div class="header-left">
        <div class="foundry-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <span class="foundry-wordmark">Foundry</span>
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
      <BuilderSidebar @add="(type) => store.addComponent(type)" />
      <BuilderCanvas :device-mode="deviceMode" />
      <PropertyEditor />
    </div>

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
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
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

/* ---- Device Toggles ---- */
.device-toggles {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2px;
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
  box-shadow: var(--shadow-xs);
}

/* ---- Header Right ---- */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.preview-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.preview-link:hover {
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
  background: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.save-btn:hover {
  background: #333;
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
