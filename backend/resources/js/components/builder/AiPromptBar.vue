<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useBuilderStore } from '../../stores/useBuilderStore';

const store = useBuilderStore();

const prompt = ref('');
const isGenerating = ref(false);
const errorMsg = ref('');
const isFocused = ref(false);
const showSuggestions = ref(false);
const showTourPopup = ref(false);
const tourText = ref('');
const fullTourText = 'WRITE ANY PROMPT HERE TO GENERATE UI';

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tour') === 'ai') {
    showTourPopup.value = true;
    
    // Typewriter effect
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i < fullTourText.length) {
        tourText.value += fullTourText.charAt(i);
        i++;
      } else {
        clearInterval(typeWriter);
      }
    }, 40);
    
    setTimeout(() => {
      showTourPopup.value = false;
    }, 10000);
    
    // Clean up the URL without reloading the page
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
});

const generateUi = async () => {
  if (!prompt.value.trim()) return;
  
  isGenerating.value = true;
  store.isAiGenerating = true;
  errorMsg.value = '';
  showSuggestions.value = false;
  
  try {
    const response = await axios.post('/api/ai/generate-ui', {
      prompt: prompt.value
    });
    
    if (response.data && response.data.data) {
      store.appendAiComponents(response.data.data);
      prompt.value = '';
    }
  } catch (err: any) {
    console.error('Failed to generate UI:', err);
    errorMsg.value = err.response?.data?.error || 'Failed to connect to AI server.';
  } finally {
    isGenerating.value = false;
    store.isAiGenerating = false;
  }
};

const suggestions = [
  'Build a sleek pricing section with 3 tiers: Basic, Pro, and Enterprise',
  'Design a minimalist FAQ section with 4 questions about a SaaS product',
  'Create a bold hero section with a headline, subtitle, and two CTA buttons',
];

const usePrompt = (text: string) => {
  prompt.value = text;
  showSuggestions.value = false;
  generateUi();
};

const onFocus = () => {
  isFocused.value = true;
  showTourPopup.value = false;
};

const onBlur = () => {
  isFocused.value = false;
  // Small delay so click on suggestion registers before hiding
  setTimeout(() => { showSuggestions.value = false; }, 200);
};
</script>

<template>
  <div class="ai-prompt-wrapper">
    <div class="ai-glow-effect"></div>
    
    <!-- Tour Popup -->
    <Transition name="fade-bounce">
      <div v-if="showTourPopup" class="tour-popup">
        <div class="tour-popup-content">
          <p>{{ tourText }}<span class="cursor" v-if="tourText.length < fullTourText.length">|</span></p>
          <button class="tour-close" @click="showTourPopup = false">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="tour-arrow"></div>
      </div>
    </Transition>

    <div class="ai-prompt-container">
      <div class="ai-input-row">
        <input 
          v-model="prompt" 
          @keydown.enter="generateUi"
          @focus="onFocus"
          @blur="onBlur"
          type="text" 
          placeholder="Generate a layout..." 
          :disabled="isGenerating"
        />
        <button 
          class="send-btn" 
          @click="generateUi" 
          :disabled="isGenerating || !prompt.trim()"
          title="Generate"
        >
          <svg v-if="!isGenerating" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" />
          </svg>
          <svg v-else class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle class="path" cx="12" cy="12" r="10" stroke-width="4"></circle>
          </svg>
        </button>
      </div>

      <!-- Inline suggestion trigger -->
      <div 
        v-if="!isGenerating && !prompt.trim()" 
        class="suggestion-trigger"
        @mouseenter="showSuggestions = true"
      >
        <span class="try-label">Try:</span>
        <span class="suggestion-preview">"{{ suggestions[0] }}"</span>
      </div>

      <!-- Expanded suggestions dropdown -->
      <Transition name="dropdown">
        <div 
          v-if="showSuggestions && !isGenerating && !prompt.trim()" 
          class="suggestions-dropdown"
          @mouseleave="showSuggestions = false"
        >
          <button 
            v-for="(s, i) in suggestions" 
            :key="i" 
            class="suggestion-item"
            :style="{ transitionDelay: (i * 0.05) + 's' }"
            @click="usePrompt(s)"
          >
            <span class="suggestion-quote">"{{ s }}"</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </Transition>
    </div>
    <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
  </div>
</template>

<style scoped>
.ai-prompt-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 2rem auto;
  z-index: 10;
}

.ai-glow-effect {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(90deg, rgba(255, 77, 77, 0.6), rgba(77, 77, 255, 0.6), rgba(255, 77, 77, 0.6));
  background-size: 200% 200%;
  border-radius: 24px;
  filter: blur(24px);
  opacity: 0.8;
  animation: glow 6s ease infinite;
  z-index: -1;
  pointer-events: none;
}

/* ---- Tour Popup ---- */
.tour-popup {
  position: absolute;
  top: 100%;
  left: 20px;
  margin-top: 16px;
  z-index: 50;
  filter: drop-shadow(4px 4px 0px rgba(0,0,0,1));
}

.tour-popup-content {
  background: #000000;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tour-popup-content p {
  margin: 0;
  display: flex;
  align-items: center;
}

.cursor {
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  font-weight: bold;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.tour-close {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.tour-close:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

.tour-arrow {
  position: absolute;
  top: -8px;
  left: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #000000;
}

/* Add a pseudo-element to simulate the border on the arrow */
.tour-arrow::before {
  content: '';
  position: absolute;
  top: 1px;
  left: -9px;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid rgba(255,255,255,0.2);
  z-index: -1;
}

.fade-bounce-enter-active {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fade-bounce-leave-active {
  transition: all 0.3s ease;
}

.fade-bounce-enter-from,
.fade-bounce-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes bounceIn {
  0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ai-prompt-container {
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid #FDF2E2;
  border-radius: 12px;
  padding: 6px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.ai-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 400;
  font-family: inherit;
  padding: 10px 0;
  letter-spacing: 0.2px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #FDF2E2;
  border: none;
  border-radius: 8px;
  color: #121214;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(0.95);
  background: #EAE0D1;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---- Inline suggestion trigger ---- */
.suggestion-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0 0.15rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 0.65rem;
  cursor: pointer;
}

.try-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}

.suggestion-preview {
  font-size: 0.825rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.suggestion-trigger:hover .suggestion-preview {
  color: rgba(255, 255, 255, 0.8);
}

/* ---- Suggestions dropdown ---- */
.suggestions-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.4rem;
  overflow: hidden;
}

/* Dropdown transition */
.dropdown-enter-active {
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dropdown-leave-active {
  animation: slideUp 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-8px);
  }
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.5rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s ease;
  text-align: left;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.suggestion-item:hover svg {
  opacity: 1;
  transform: translateX(2px);
}

.suggestion-item svg {
  opacity: 0;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.suggestion-quote {
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.spinner {
  width: 16px;
  height: 16px;
  animation: rotate 2s linear infinite;
}

.spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

</style>

<style>
/* ---- Light Mode Overrides (Unscoped) ---- */
html[data-theme="light"] .ai-prompt-wrapper .ai-glow-effect {
  opacity: 0.25;
  background: linear-gradient(90deg, rgba(255, 77, 77, 0.4), rgba(77, 77, 255, 0.4), rgba(255, 77, 77, 0.4));
}

html[data-theme="light"] .ai-prompt-wrapper .ai-prompt-container {
  background: rgba(255, 255, 255, 0.85) !important;
  border: 2px solid #000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

html[data-theme="light"] .ai-prompt-wrapper input {
  color: #111827 !important;
}

html[data-theme="light"] .ai-prompt-wrapper input::placeholder {
  color: rgba(0, 0, 0, 0.4) !important;
}

html[data-theme="light"] .ai-prompt-wrapper .send-btn {
  background: #000;
  color: #FDF2E2 !important;
}

html[data-theme="light"] .ai-prompt-wrapper .send-btn:hover:not(:disabled) {
  transform: scale(0.95);
  background: #333;
}

html[data-theme="light"] .ai-prompt-wrapper .suggestion-trigger {
  border-top-color: rgba(0, 0, 0, 0.06);
}

html[data-theme="light"] .ai-prompt-wrapper .try-label {
  color: rgba(0, 0, 0, 0.35);
}

html[data-theme="light"] .ai-prompt-wrapper .suggestion-preview {
  color: rgba(0, 0, 0, 0.4);
}

html[data-theme="light"] .ai-prompt-wrapper .suggestion-trigger:hover .suggestion-preview {
  color: rgba(0, 0, 0, 0.7);
}

html[data-theme="light"] .ai-prompt-wrapper .suggestions-dropdown {
  border-top-color: rgba(0, 0, 0, 0.06);
}

html[data-theme="light"] .ai-prompt-wrapper .suggestion-item {
  color: rgba(0, 0, 0, 0.5);
}

html[data-theme="light"] .ai-prompt-wrapper .suggestion-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #111827;
}
</style>
