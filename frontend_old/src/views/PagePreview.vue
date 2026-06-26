<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { BuilderComponent } from '../types/builder';
import PreviewComponent from '../components/builder/PreviewComponent.vue';

const components = ref<BuilderComponent[]>([]);
const title = ref<string>('Loading...');
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/pages');
    const pages = res.data.data;
    
    if (pages && pages.length > 0) {
      const latestPage = pages.sort((a: any, b: any) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
      
      const detailRes = await axios.get(`http://localhost:8000/api/pages/${latestPage.id}`);
      components.value = detailRes.data.data.components || [];
      title.value = detailRes.data.data.title;
    } else {
      title.value = 'No pages found';
      error.value = 'Go to the editor and save a page first!';
    }
  } catch (err) {
    console.error('Failed to fetch page:', err);
    title.value = 'Error';
    error.value = 'Failed to load page. Is the Laravel backend running on port 8000?';
  }
});
</script>

<template>
  <div class="preview-layout">
    <!-- Top Bar (Preview Chrome) -->
    <div class="preview-chrome">
      <div class="chrome-status">
        <span class="status-dot"></span>
        <span>Live Preview: {{ title }}</span>
      </div>
      <router-link to="/" class="chrome-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Editor
      </router-link>
    </div>

    <!-- Rendered Page Content -->
    <div class="preview-surface">
      <div v-if="error" class="preview-error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="preview-content">
        <PreviewComponent
          v-for="comp in components"
          :key="comp.id"
          :component="comp"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-layout {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.preview-chrome {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-family: var(--font-ui);
}

.chrome-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

.chrome-back {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.chrome-back:hover {
  color: var(--color-text-primary);
}

.preview-surface {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--space-8);
}

.preview-content {
  background: var(--color-surface);
  width: 100%;
  max-width: 1024px;
  min-height: 800px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-page);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.preview-error {
  text-align: center;
  color: var(--color-text-tertiary);
  margin-top: 10vh;
  font-size: 16px;
}
</style>
