<script setup lang="ts">
import { ref, computed } from 'vue';
import type { BuilderComponent } from '../../types/builder';
import { generateHtmlCode, generateVueCode } from '../../utils/codeGenerator';
import { ShopifyExportEngine } from '../../utils/shopify/ShopifyExportEngine';

const shopifyExport = new ShopifyExportEngine();

const props = defineProps<{
  components: BuilderComponent[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const activeTab = ref<'vue' | 'html' | 'json'>('vue');

const generatedCode = computed(() => {
  if (activeTab.value === 'vue') {
    return generateVueCode(props.components);
  } else if (activeTab.value === 'html') {
    return generateHtmlCode(props.components);
  } else {
    return JSON.stringify(props.components, null, 2);
  }
});

const copySuccess = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value);
    copySuccess.value = true;
    setTimeout(() => { copySuccess.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const isExportingShopify = ref(false);
const handleShopifyExport = async () => {
  try {
    isExportingShopify.value = true;
    await shopifyExport.exportTheme(props.components, 'Foundry-Shopify-Theme');
  } catch (err) {
    console.error('Failed to export theme: ', err);
    alert('Failed to export Shopify theme. See console for details.');
  } finally {
    isExportingShopify.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <h2>Export Code</h2>
        </div>
        <button class="close-btn" @click="emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="tabs">
          <button :class="{ active: activeTab === 'vue' }" @click="activeTab = 'vue'">Vue SFC</button>
          <button :class="{ active: activeTab === 'html' }" @click="activeTab = 'html'">Raw HTML</button>
          <button :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">JSON Tree</button>
        </div>

        <div class="code-container">
          <div class="code-actions">
            <button class="shopify-btn" @click="handleShopifyExport" :disabled="isExportingShopify">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {{ isExportingShopify ? 'Generating...' : 'Download Shopify Theme' }}
            </button>
            <button class="copy-btn" @click="handleCopy" :class="{ success: copySuccess }">
              <template v-if="!copySuccess">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </template>
              <template v-else>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
              </template>
            </button>
          </div>
          <pre><code>{{ generatedCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-surface);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.modal-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
}

.modal-title h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow: hidden;
}

.tabs {
  display: flex;
  gap: var(--space-2);
}

.tabs button {
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px solid transparent;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tabs button:hover {
  color: var(--color-text-primary);
}

.tabs button.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.code-container {
  flex: 1;
  position: relative;
  background: #1e1e1e;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.code-actions {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: flex;
  gap: var(--space-2);
  z-index: 10;
}

.copy-btn, .shopify-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover, .shopify-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.shopify-btn {
  background: rgba(149, 191, 71, 0.2); /* Shopify Green tint */
  border-color: rgba(149, 191, 71, 0.5);
  color: #a8d951;
}

.shopify-btn:hover:not(:disabled) {
  background: rgba(149, 191, 71, 0.3);
}

.shopify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-btn.success {
  background: var(--color-success);
  border-color: var(--color-success);
}

pre {
  margin: 0;
  padding: var(--space-6);
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #d4d4d4;
  height: 500px;
}
</style>
