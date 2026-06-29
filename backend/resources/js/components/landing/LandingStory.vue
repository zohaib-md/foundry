<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const storyText = "the story of Foundry begins with a simple idea. we believe creators who envision beautiful digital experiences deserve better tools. better speed, better components, better freedom. this is the visual builder we're building. make it to the canvas, and experience the future of web design.";

// Split into words, but keep punctuation attached to words
const words = ref(storyText.split(' ').map(word => ({ text: word, opacity: 0.15 })));

const storyRef = ref<HTMLElement | null>(null);

const handleScroll = () => {
  if (!storyRef.value) return;
  
  const rect = storyRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calculate how far through the element we have scrolled
  // Start when top hits 75% of window height
  const startY = windowHeight * 0.75;
  
  // End when bottom hits 40% of window height
  const elementHeight = rect.height;
  const endY = (windowHeight * 0.4) - elementHeight;
  
  const top = rect.top;
  
  // Progress from 0 to 1
  let progress = 0;
  if (top < startY) {
    progress = (startY - top) / (startY - endY);
  }
  
  // Clamp between 0 and 1
  progress = Math.max(0, Math.min(1, progress));
  
  // Update words opacity sequentially
  const totalWords = words.value.length;
  const activeWordCount = Math.floor(progress * totalWords);
  
  words.value.forEach((word, index) => {
    // Determine the baseline opacity based on scroll progress
    if (index < activeWordCount) {
      word.opacity = 1;
    } else {
      word.opacity = 0.15;
    }
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Run once to initialize
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <section class="story-section" ref="storyRef">
    <div class="landing-container">
      <div class="story-content">
        <h3 class="story-kicker">NOT EVERY VISUAL BUILDER IS THE SAME.</h3>
        <h2 class="story-text">
          <span 
            v-for="(word, index) in words" 
            :key="index"
            class="story-word"
            :style="{ opacity: word.opacity }"
          >
            {{ word.text }}&nbsp;
          </span>
        </h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  padding: 150px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.story-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.story-kicker {
  font-family: var(--font-landing);
  font-size: 1.5rem;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: uppercase;
}

.story-text {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--landing-text-main);
  max-width: 1200px;
  margin: 0 auto;
  font-weight: 500;
  text-align: left;
}

.story-word {
  display: inline-block;
  transition: opacity 0.4s var(--ease-apple), text-shadow 0.3s ease;
  will-change: opacity, text-shadow;
  cursor: default;
}

.story-word:hover {
  opacity: 1 !important;
  text-shadow: 0 0 24px rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .story-text {
    font-size: clamp(2rem, 8vw, 3rem);
  }
}
</style>
