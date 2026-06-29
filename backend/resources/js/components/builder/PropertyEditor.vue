<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { useBuilderStore } from '../../stores/useBuilderStore';
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS } from '../../types/builder';
import ThemeEditor from './ThemeEditor.vue';

const store = useBuilderStore();

const activeTab = ref<'element' | 'theme'>('element');

const selectedComponent = computed(() => store.selectedComponent);

const isGenerating = ref(false);
const aiPrompt = ref('');
const showAiMenu = ref(false);

const updateProp = (key: string, value: any) => {
  if (store.selectedComponentId) {
    store.updateComponentProps(store.selectedComponentId, { [key]: value });
  }
};

const updateStyle = (key: string, value: string) => {
  if (store.selectedComponentId) {
    store.updateComponentStyles(store.selectedComponentId, { [key]: value });
  }
};

const updateBinding = (propName: string, target: string) => {
  if (store.selectedComponentId) {
    store.updateComponentBindings(store.selectedComponentId, { [propName]: target || null });
  }
};

const getBinding = (propName: string) => {
  return selectedComponent.value?.bindings?.[propName] || '';
};

// Available Shopify Dynamic Sources
const shopifySources = [
  { label: 'None (Static Value)', value: '' },
  { label: 'Product Title', value: 'product.title' },
  { label: 'Product Price', value: 'product.price | money' },
  { label: 'Product Description', value: 'product.description' },
  { label: 'Product URL', value: 'product.url' },
  { label: 'Collection Title', value: 'collection.title' },
  { label: 'Collection URL', value: 'collection.url' },
  { label: 'Shop Name', value: 'shop.name' },
];

const handleAiGenerate = async (presetPrompt?: string) => {
  if (!store.selectedComponentId || !selectedComponent.value) return;
  
  const promptToUse = presetPrompt || aiPrompt.value;
  if (!promptToUse) return;

  isGenerating.value = true;
  try {
    const res = await axios.post('/api/ai/generate', {
      prompt: promptToUse,
      currentText: selectedComponent.value.props.text || '',
      componentType: selectedComponent.value.type,
    });
    
    if (res.data && res.data.data) {
      updateProp('text', res.data.data);
      showAiMenu.value = false;
      aiPrompt.value = '';
    }
  } catch (err) {
    console.error('AI Generation failed', err);
    alert('AI Generation failed. Check console and make sure GEMINI_API_KEY is set in .env');
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="property-panel">
    
    <div class="panel-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'element' }" 
        @click="activeTab = 'element'"
      >
        Element
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'theme' }" 
        @click="activeTab = 'theme'"
      >
        Theme
      </button>
    </div>

    <div class="panel-header" v-if="activeTab === 'element'">
      <h2>Properties</h2>
      <span v-if="selectedComponent" class="type-badge">{{ selectedComponent.type }}</span>
    </div>

    <div class="panel-content">
      
      <template v-if="activeTab === 'theme'">
        <ThemeEditor />
      </template>

      <template v-else>
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
            <div class="label-row">
              <label>Text <span class="binding-badge" v-if="getBinding('text')">Bound to {{ getBinding('text') }}</span></label>
              <button 
                class="ai-trigger-btn" 
                :class="{ 'active': showAiMenu }"
                @click="showAiMenu = !showAiMenu"
                title="Generate with AI"
                v-if="!getBinding('text')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                AI Assist
              </button>
            </div>

            <!-- AI Menu Popover -->
            <div v-if="showAiMenu && !getBinding('text')" class="ai-menu">
              <div class="ai-input-group">
                <input 
                  type="text" 
                  v-model="aiPrompt" 
                  placeholder="e.g. Catchy headline for shoes..." 
                  class="input-control ai-input"
                  @keyup.enter="handleAiGenerate()"
                  :disabled="isGenerating"
                />
                <button 
                  class="ai-submit-btn" 
                  @click="handleAiGenerate()"
                  :disabled="isGenerating || !aiPrompt"
                >
                  <svg v-if="!isGenerating" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  <span v-else class="spinner"></span>
                </button>
              </div>
              <div class="ai-quick-actions">
                <button :disabled="isGenerating" @click="handleAiGenerate('Improve this writing')">Improve</button>
                <button :disabled="isGenerating" @click="handleAiGenerate('Make this shorter')">Shorter</button>
                <button :disabled="isGenerating" @click="handleAiGenerate('Make this sound more professional')">Professional</button>
              </div>
            </div>

            <div class="binding-group">
              <select 
                class="input-control binding-select"
                :value="getBinding('text')"
                @change="e => updateBinding('text', (e.target as HTMLSelectElement).value)"
              >
                <option v-for="source in shopifySources" :key="source.value" :value="source.value">
                  {{ source.label }}
                </option>
              </select>
            </div>

            <textarea
              v-if="!getBinding('text')"
              class="input-control"
              rows="3"
              :value="selectedComponent.props.text"
              @input="e => updateProp('text', (e.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>

          <div class="form-group" v-if="'url' in selectedComponent.props">
            <div class="label-row">
              <label>
                {{ selectedComponent.type === 'image' || selectedComponent.type === 'video' ? 'Source URL' : 'Link URL' }}
                <span class="binding-badge" v-if="getBinding('url')">Bound</span>
              </label>
            </div>
            
            <div class="binding-group">
              <select 
                class="input-control binding-select"
                :value="getBinding('url')"
                @change="e => updateBinding('url', (e.target as HTMLSelectElement).value)"
              >
                <option v-for="source in shopifySources" :key="source.value" :value="source.value">
                  {{ source.label }}
                </option>
              </select>
            </div>
            
            <input
              v-if="!getBinding('url')"
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
          <div class="form-group" v-if="selectedComponent.type === 'icon'">
            <label>Icon</label>
            <select
              class="input-control"
              :value="selectedComponent.props.icon"
              @change="e => updateProp('icon', (e.target as HTMLSelectElement).value)"
            >
              <option value="star">Star</option>
              <option value="heart">Heart</option>
              <option value="check">Check</option>
              <option value="arrow">Arrow</option>
              <option value="zap">Zap</option>
              <option value="shield">Shield</option>
              <option value="globe">Globe</option>
              <option value="mail">Mail</option>
              <option value="custom">Custom (SVG Path)</option>
            </select>
          </div>
          <div class="form-group" v-if="selectedComponent.type === 'icon' && selectedComponent.props.icon === 'custom'">
            <label>Custom SVG Path (d)</label>
            <textarea
              class="input-control"
              rows="3"
              placeholder="e.g. M12 2L2 22h20L12 2z"
              :value="selectedComponent.props.customPath"
              @input="e => updateProp('customPath', (e.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>
          <div class="form-group" v-if="selectedComponent.type === 'icon'">
            <label>Size</label>
            <input
              type="text"
              class="input-control"
              placeholder="e.g. 32px"
              :value="selectedComponent.props.size"
              @input="e => updateProp('size', (e.target as HTMLInputElement).value)"
            />
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'divider'">
            <label>Style</label>
            <select
              class="input-control"
              :value="selectedComponent.props.style"
              @change="e => updateProp('style', (e.target as HTMLSelectElement).value)"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <div class="form-group" v-if="selectedComponent.type === 'divider'">
            <label>Thickness</label>
            <input
              type="text"
              class="input-control"
              placeholder="e.g. 1px"
              :value="selectedComponent.props.thickness"
              @input="e => updateProp('thickness', (e.target as HTMLInputElement).value)"
            />
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'spacer'">
            <label>Height</label>
            <input
              type="text"
              class="input-control"
              placeholder="e.g. 40px"
              :value="selectedComponent.props.height"
              @input="e => updateProp('height', (e.target as HTMLInputElement).value)"
            />
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'input' || selectedComponent.type === 'newsletter'">
            <label>Placeholder</label>
            <input
              type="text"
              class="input-control"
              :value="selectedComponent.props.placeholder"
              @input="e => updateProp('placeholder', (e.target as HTMLInputElement).value)"
            />
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'input'">
            <label>Input Type</label>
            <select
              class="input-control"
              :value="selectedComponent.props.type"
              @change="e => updateProp('type', (e.target as HTMLSelectElement).value)"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div class="form-group" v-if="selectedComponent.type === 'newsletter'">
            <label>Button Text</label>
            <input
              type="text"
              class="input-control"
              :value="selectedComponent.props.buttonText"
              @input="e => updateProp('buttonText', (e.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="section-divider"></div>

        <!-- SECTION: LAYOUT -->
        <div class="property-section" v-if="['container', 'section', 'columns', 'grid', 'form'].includes(selectedComponent.type)">
          <h3>Layout</h3>

          <div class="form-group">
            <label>Direction</label>
            <select
              class="input-control"
              :value="selectedComponent.styles?.flexDirection || 'column'"
              @change="e => updateStyle('flexDirection', (e.target as HTMLSelectElement).value)"
            >
              <option value="row">Row (Horizontal)</option>
              <option value="column">Column (Vertical)</option>
            </select>
          </div>

          <div class="grid-2-col">
            <div class="form-group">
              <label>Align</label>
              <select
                class="input-control"
                :value="selectedComponent.styles?.alignItems || 'stretch'"
                @change="e => updateStyle('alignItems', (e.target as HTMLSelectElement).value)"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div class="form-group">
              <label>Justify</label>
              <select
                class="input-control"
                :value="selectedComponent.styles?.justifyContent || 'flex-start'"
                @change="e => updateStyle('justifyContent', (e.target as HTMLSelectElement).value)"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
              </select>
            </div>
          </div>

          <div class="grid-2-col">
            <div class="form-group">
              <label>Gap</label>
              <input
                type="text"
                class="input-control"
                placeholder="e.g. 16px"
                :value="selectedComponent.styles?.gap || '16px'"
                @input="e => updateStyle('gap', (e.target as HTMLInputElement).value)"
              />
            </div>
            <div class="form-group">
              <label>Padding</label>
              <input
                type="text"
                class="input-control"
                placeholder="e.g. 24px"
                :value="selectedComponent.styles?.padding || '24px'"
                @input="e => updateStyle('padding', (e.target as HTMLInputElement).value)"
              />
            </div>
          </div>

          <div class="grid-2-col">
            <div class="form-group">
              <label>Width</label>
              <input
                type="text"
                class="input-control"
                placeholder="e.g. 100%, 500px"
                :value="selectedComponent.styles?.width || '100%'"
                @input="e => updateStyle('width', (e.target as HTMLInputElement).value)"
              />
            </div>
            <div class="form-group">
              <label>Min Height</label>
              <input
                type="text"
                class="input-control"
                placeholder="e.g. 50px, 100vh"
                :value="selectedComponent.styles?.minHeight || '50px'"
                @input="e => updateStyle('minHeight', (e.target as HTMLInputElement).value)"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Background Color</label>
            <div class="color-picker-wrapper">
              <input
                type="color"
                class="color-input"
                :value="selectedComponent.styles?.backgroundColor || '#ffffff'"
                @input="e => updateStyle('backgroundColor', (e.target as HTMLInputElement).value)"
              />
              <span class="color-value">{{ selectedComponent.styles?.backgroundColor || 'transparent' }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Border Radius</label>
            <input
              type="text"
              class="input-control"
              placeholder="e.g. 8px"
              :value="selectedComponent.styles?.borderRadius || '0px'"
              @input="e => updateStyle('borderRadius', (e.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="section-divider" v-if="selectedComponent.type === 'container'"></div>

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

        <div class="property-section">
          <h3>SPACING & CSS</h3>
          <div class="prop-grid">
            <div class="form-group" style="display: flex; gap: 8px;">
              <div style="flex: 1;">
                <label>Padding Top</label>
                <input type="text" class="input-control" placeholder="0px" :value="selectedComponent.styles?.paddingTop || ''" @input="e => updateStyle('paddingTop', (e.target as HTMLInputElement).value)" />
              </div>
              <div style="flex: 1;">
                <label>Padding Bottom</label>
                <input type="text" class="input-control" placeholder="0px" :value="selectedComponent.styles?.paddingBottom || ''" @input="e => updateStyle('paddingBottom', (e.target as HTMLInputElement).value)" />
              </div>
            </div>
            <div class="form-group">
              <label>Custom CSS (Inline)</label>
              <textarea class="input-control" style="min-height: 60px; font-family: monospace; font-size: 12px;" placeholder="border: 1px solid red;&#10;opacity: 0.8;" :value="selectedComponent.styles?.customCss || ''" @input="e => updateStyle('customCss', (e.target as HTMLTextAreaElement).value)"></textarea>
            </div>
          </div>
        </div>

      </div>
      </template>
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

.panel-tabs {
  display: flex;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  padding: 12px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  color: var(--color-text-secondary);
  background: var(--color-surface-alt);
}

.tab-btn.active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-text-primary);
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

/* Input control styles moved to global style.css */

/* ---- Segmented Control ---- */
.segmented-control {
  display: flex;
  background: var(--color-overlay);
  border-radius: var(--radius-md);
  padding: 3px;
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
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.segment-btn:hover {
  color: var(--color-text-primary);
}

.segment-btn.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
}

/* ---- Color Picker ---- */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-input-bg);
  border: 1px solid var(--color-border-input);
  border-radius: var(--radius-md);
  padding: 4px 10px;
  box-shadow: var(--shadow-input);
  transition: border-color var(--transition-fast);
}

.color-picker-wrapper:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle), var(--shadow-input);
}

.color-input {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 4px;
}

.color-value {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-primary);
  text-transform: uppercase;
}

/* ---- AI Menu ---- */
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-trigger-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #8B5CF6; /* Purple for AI */
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.ai-trigger-btn:hover, .ai-trigger-btn.active {
  background: rgba(139, 92, 246, 0.1);
}

.ai-menu {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  margin-bottom: var(--space-2);
  animation: slideDown var(--transition-fast) forwards;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-input-group {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.ai-input {
  flex: 1;
  font-size: 12px;
  padding: 4px 8px;
}

.ai-submit-btn {
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.ai-submit-btn:hover:not(:disabled) {
  background: #7C3AED;
}

.ai-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-quick-actions {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.ai-quick-actions button {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ai-quick-actions button:hover:not(:disabled) {
  border-color: #8B5CF6;
  color: #8B5CF6;
}

.ai-quick-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.binding-badge {
  background: var(--color-accent);
  color: #000;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  margin-left: 8px;
  display: inline-block;
}

.binding-group {
  margin-bottom: var(--space-2);
}

.binding-select {
  background: rgba(149, 191, 71, 0.1);
  border: 1px solid rgba(149, 191, 71, 0.3);
  color: #a8d951;
}

.binding-select:focus {
  border-color: #95bf47;
}
</style>
