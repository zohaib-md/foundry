<script setup lang="ts">
import BuilderLayout from '../components/builder/BuilderLayout.vue';
import axios from 'axios';
import { useBuilderStore } from '../stores/useBuilderStore';

const store = useBuilderStore();

const savePage = async () => {
  try {
    // In a real app we'd get the ID from the route. For POC we just create a new one.
    const res = await axios.post('http://localhost:8000/api/pages', {
      title: 'My Awesome Page',
      components: store.components
    });
    alert('Page saved successfully!');
    console.log('Saved:', res.data);
  } catch (err) {
    console.error('Error saving page:', err);
    alert('Failed to save page. Make sure backend is running.');
  }
};
</script>

<template>
  <BuilderLayout @save="savePage" />
</template>
