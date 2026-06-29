<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentStyles } from '../../types/builder';

const props = defineProps<{
  props: { url?: string; poster?: string };
  styles?: ComponentStyles;
}>();

const wrapperStyles = computed(() => ({
  width: props.styles?.width || '100%',
  borderRadius: props.styles?.borderRadius || '8px',
  overflow: 'hidden',
}));
</script>

<template>
  <div :style="wrapperStyles" class="foundry-video">
    <div v-if="props.props.url" class="video-embed">
      <iframe
        :src="props.props.url"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div v-else class="video-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      <span>Add a video URL</span>
    </div>
  </div>
</template>

<style scoped>
.foundry-video {
  width: 100%;
}

.video-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  background: var(--color-surface-alt);
  border: 1px dashed var(--color-border);
  border-radius: inherit;
  color: var(--color-text-tertiary);
}

.video-placeholder span {
  font-size: 13px;
  font-weight: 500;
}
</style>
