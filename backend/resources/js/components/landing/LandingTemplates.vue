<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const templates = [
  { name: 'Startup', type: 'Landing', image: '/images/templates/startup2.webp', badge: 'NEW' },
  { name: 'SaaS', type: 'Platform', image: '/images/templates/saas.jpg', badge: '' },
  { name: 'Agency', type: 'Portfolio', image: '/images/templates/agency1.jpg', badge: '' },
  { name: 'Photography', type: 'Gallery', image: '/images/templates/photography.png', badge: '' },
  { name: 'Restaurant', type: 'Local', image: '/images/templates/restaurant1.webp', badge: 'HOT' }
];

const wrapperRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);

const handleScroll = () => {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calculate progress inside the wrapper
  // progress = 0 when top of wrapper is at top of screen
  // progress = 1 when bottom of wrapper is at bottom of screen
  const scrollableDistance = rect.height - windowHeight;
  
  if (scrollableDistance > 0) {
    let p = -rect.top / scrollableDistance;
    scrollProgress.value = Math.max(0, Math.min(1, p));
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Calculate styles for each template card
const getCardStyle = (index: number) => {
  const n = templates.length;
  const progress = scrollProgress.value;
  
  // The scroll positions where this card is the absolute center focus
  // e.g. for 5 cards: centers are 0, 0.25, 0.5, 0.75, 1.0
  const center = index / (n - 1);
  
  // Let the slide-in take up half of the interval between centers
  const interval = 1 / (n - 1);
  const slideStart = center - (interval * 0.7); 
  
  let translateY = 0;
  let scale = 1;
  let opacity = 1;
  
  if (progress < slideStart) {
    // Hidden below
    translateY = 120; // vh
    scale = 1;
    opacity = 0;
  } else if (progress >= slideStart && progress < center) {
    // Sliding in
    const slideProgress = (progress - slideStart) / (center - slideStart);
    // Easing out the slide
    const easeProgress = 1 - Math.pow(1 - slideProgress, 3);
    translateY = 120 * (1 - easeProgress);
    scale = 1;
    opacity = 1;
  } else if (progress >= center) {
    // Receding to the background as next cards come over it
    const recedeProgress = (progress - center) / (1 - center); // 0 to 1
    translateY = 0;
    // Shrink down to 0.85 scale at maximum
    scale = 1 - (recedeProgress * 0.15);
    // Fade out slightly
    opacity = 1 - (recedeProgress * 0.6);
  }
  
  return {
    transform: `translateY(${translateY}vh) scale(${scale})`,
    opacity,
    zIndex: index
  };
};
</script>

<template>
  <section class="templates-section" id="templates">
    <div class="landing-container templates-header">
      <div>
        <h2 class="section-title">Start with a stunning template</h2>
        <p class="section-subtitle">Or build from scratch. The choice is yours.</p>
      </div>
      <a href="#" @click.prevent class="view-all">View all templates &rarr;</a>
    </div>
    
    <!-- Wrapper gives us enough scrolling height -->
    <div class="templates-stack-wrapper" ref="wrapperRef" :style="{ height: `${templates.length * 80}vh` }">
      <!-- Sticky container holds the viewport -->
      <div class="templates-sticky-container">
        <div 
          v-for="(template, index) in templates" 
          :key="index"
          class="template-card"
          :style="getCardStyle(index)"
        >
          <div class="template-image">
            <img :src="template.image" :alt="template.name" />
            <div v-if="template.badge" class="template-badge" :class="template.badge.toLowerCase()">
              {{ template.badge }}
            </div>
          </div>
          <div class="template-info">
            <h4>{{ template.name }}</h4>
            <span>{{ template.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.templates-section {
  padding-top: 80px;
  background: transparent;
  position: relative;
}

.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  position: relative;
  z-index: 100;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--landing-text-main);
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--landing-text-muted);
  margin: 0;
}

.view-all {
  color: var(--landing-text-main);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--landing-primary);
}

.templates-stack-wrapper {
  position: relative;
  width: 100%;
}

.templates-sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
}

.template-card {
  position: absolute;
  width: 90%;
  max-width: 1000px;
  height: 70vh;
  max-height: 600px;
  background: var(--landing-card);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
  transform-origin: top center;
  padding: 12px;
}

.template-image {
  flex: 1;
  width: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.template-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition: opacity 0.5s;
}

.template-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 8px;
  letter-spacing: 0.05em;
  z-index: 10;
}

.template-badge.new {
  background: var(--landing-secondary);
  color: white;
}

.template-badge.hot {
  background: #EF4444;
  color: white;
}

.template-info {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.template-info h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--landing-text-main);
}

.template-info span {
  font-size: 1rem;
  color: var(--landing-text-muted);
  font-weight: 500;
}
</style>
