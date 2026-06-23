<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { BuilderComponent } from '../types/builder';
import HeadingElement from '../components/elements/HeadingElement.vue';
import TextElement from '../components/elements/TextElement.vue';
import ButtonElement from '../components/elements/ButtonElement.vue';
import ImageElement from '../components/elements/ImageElement.vue';

const components = ref<BuilderComponent[]>([]);
const title = ref<string>('Loading...');
const error = ref<string | null>(null);

const componentMap = {
  heading: HeadingElement,
  text: TextElement,
  button: ButtonElement,
  image: ImageElement,
};

onMounted(async () => {
  try {
    // Fetch all pages and grab the most recently updated one for the POC
    const res = await axios.get('http://localhost:8000/api/pages');
    const pages = res.data.data;
    
    if (pages && pages.length > 0) {
      // Get the latest page
      const latestPage = pages.sort((a: any, b: any) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
      
      // Fetch full details of the latest page
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
  <div class="min-h-screen bg-white">
    <!-- Top Bar -->
    <div class="bg-gray-900 text-white p-3 flex justify-between items-center text-sm">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Live Preview: {{ title }}</span>
      </div>
      <router-link to="/" class="text-gray-300 hover:text-white underline">
        Back to Editor
      </router-link>
    </div>

    <!-- Rendered Page Content -->
    <div class="max-w-4xl mx-auto p-8 min-h-[80vh]">
      <div v-if="error" class="text-center text-gray-500 mt-20">
        <p class="text-xl mb-4">{{ error }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <!-- Recursively/Iteratively render components -->
        <component
          v-for="comp in components"
          :key="comp.id"
          :is="componentMap[comp.type]"
          :props="comp.props"
        />
      </div>
    </div>
  </div>
</template>
