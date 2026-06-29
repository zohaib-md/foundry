<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingStory from '../components/landing/LandingStory.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingTemplates from '../components/landing/LandingTemplates.vue';
import LandingStats from '../components/landing/LandingStats.vue';
import LandingTestimonials from '../components/landing/LandingTestimonials.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';

const router = useRouter();
const isEnteringEditor = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const handleStartBuilding = () => {
  // Trigger the cinematic transition
  isEnteringEditor.value = true;
  
  // Wait for the transition to finish before navigating
  setTimeout(() => {
    router.push('/editor');
  }, 600); // 600ms matches the CSS transition duration
};

const scrollProgress = ref(0);
let rafId = 0;

const pollScroll = () => {
  if (!wrapperRef.value) {
    rafId = requestAnimationFrame(pollScroll);
    return;
  }
  
  // No matter which parent container is scrolling, the bounding rect of the wrapper 
  // relative to the viewport perfectly tells us how far we have scrolled.
  const rect = wrapperRef.value.getBoundingClientRect();
  const scrollTop = Math.max(0, -rect.top);
  const scrollHeight = rect.height;
  
  const maxScroll = scrollHeight - window.innerHeight;
  const maxTranslate = (window.innerHeight - 200) - 100;
  
  if (maxScroll > 0) {
    const p = Math.max(0, Math.min(1, scrollTop / maxScroll));
    scrollProgress.value = p * maxTranslate;
  }
  
  rafId = requestAnimationFrame(pollScroll);
};

onMounted(() => {
  document.body.classList.add('landing-page');
  rafId = requestAnimationFrame(pollScroll);
});

onUnmounted(() => {
  document.body.classList.remove('landing-page');
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <!-- Glowing scroll wire moved OUTSIDE the transformed wrapper to stay fixed to viewport -->
  <div class="scroll-wire">
    <div class="scroll-wire-track"></div>
    <div class="scroll-wire-glow" :style="{ transform: `translateY(${scrollProgress}px)` }"></div>
  </div>

  <div class="landing-wrapper" ref="wrapperRef" :class="{ 'zooming-out': isEnteringEditor }">
    <LandingNavbar @start-building="handleStartBuilding" />
    <LandingHero @start-building="handleStartBuilding" />
    <LandingStory />
    <LandingFeatures />
    <LandingTemplates />
    <LandingStats />
    <LandingTestimonials />
    <LandingFooter />
  </div>
</template>

<style scoped>
.landing-wrapper {
  transition: all 0.6s var(--ease-apple);
  transform-origin: center center;
  opacity: 1;
  transform: scale(1);
}

.landing-wrapper.zooming-out {
  opacity: 0;
  transform: scale(1.05); /* The cinematic zoom effect */
  pointer-events: none;
}

.scroll-wire {
  position: fixed;
  left: 40px;
  top: 100px;
  bottom: 100px;
  width: 2px;
  z-index: 50;
  display: none;
}

@media (min-width: 1400px) {
  .scroll-wire { display: block; }
}

.scroll-wire-track {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.scroll-wire-glow {
  position: absolute;
  top: 0; left: -1px; width: 4px; height: 100px;
  background: #FFF9EB; /* Very light, bright warm core */
  border-radius: 4px;
  /* Layered glowing effect for realistic light dispersion */
  box-shadow: 
    0 0 10px rgba(255, 230, 180, 0.9), 
    0 0 30px rgba(255, 170, 80, 0.4);
  will-change: transform;
}
</style>
