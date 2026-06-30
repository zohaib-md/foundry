<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits(['start-building']);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoEnded = ref(false);

const handleVideoEnded = () => {
  isVideoEnded.value = true;
  
  // BRUTE FORCE FALLBACK: Bypass Vue and directly manipulate the DOM
  const headline = document.querySelector('.hero-headline') as HTMLElement;
  if (headline) {
    headline.style.setProperty('color', '#000000', 'important');
    headline.style.setProperty('transition', 'color 2.5s ease', 'important');
  }
  
  const textPrimary = document.querySelector('.hero-headline .text-primary') as HTMLElement;
  if (textPrimary) {
    textPrimary.style.setProperty('background', 'none', 'important');
    textPrimary.style.setProperty('background-image', 'none', 'important');
    textPrimary.style.setProperty('color', '#000000', 'important');
    textPrimary.style.setProperty('-webkit-text-fill-color', 'initial', 'important');
    textPrimary.style.setProperty('transition', 'all 2.5s ease', 'important');
  }
  
  const heroBody = document.querySelector('.hero-body') as HTMLElement;
  if (heroBody) {
    heroBody.style.setProperty('color', '#000000', 'important');
    heroBody.style.setProperty('transition', 'color 2.5s ease', 'important');
  }
  
  const badge = document.querySelector('.hero-badge') as HTMLElement;
  if (badge) {
    badge.style.setProperty('color', '#000000', 'important');
    badge.style.setProperty('border-left-color', '#000000', 'important');
    badge.style.setProperty('transition', 'all 2s ease', 'important');
  }
};

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.play().then(() => {
      // Guarantee it fires based on the actual duration of the loaded video
      const duration = videoRef.value?.duration;
      if (duration && isFinite(duration) && duration > 0) {
        setTimeout(handleVideoEnded, duration * 1000);
      } else {
        // Absolute worst-case scenario failsafe: Just fire it after 4 seconds
        setTimeout(handleVideoEnded, 4000);
      }
    }).catch(e => {
      console.log('Video autoplay prevented:', e);
      // Even if video is blocked, trigger the effect anyway
      setTimeout(handleVideoEnded, 4000);
    });
    
    // Original fallback
    videoRef.value.addEventListener('timeupdate', () => {
      if (videoRef.value && videoRef.value.duration) {
        if (videoRef.value.currentTime >= videoRef.value.duration - 0.1) {
          handleVideoEnded();
        }
      }
    });
    
    videoRef.value.addEventListener('ended', handleVideoEnded);
    
    // Ultimate Failsafe: Aggressively poll the native .ended property
    const pollInterval = setInterval(() => {
      if (videoRef.value && videoRef.value.ended) {
        handleVideoEnded();
        clearInterval(pollInterval);
      }
    }, 250);
  } else {
    // If video tag completely fails to mount, just fire it
    setTimeout(handleVideoEnded, 4000);
  }
});
</script>

<template>
  <!-- Removed landing-container so the section stretches full width -->
  <section class="hero-section">
    <!-- Ambient Video Background -->
    <video 
      ref="videoRef"
      class="hero-video-bg" 
      autoplay 
      muted 
      playsinline 
      preload="auto"
      @ended="handleVideoEnded"
      src="/hero-bg.mp4">
    </video>
    <div class="hero-video-overlay"></div>

    <div class="hero-content">
      <div class="hero-badge" :class="{ 'video-ended': isVideoEnded }">
        WELCOME TO FOUNDRY
      </div>
      
      <h1 class="hero-headline" :class="{ 'video-ended': isVideoEnded }">
        Design. Build. Publish.<br/>
        <span class="text-primary">Visually.</span> Effortlessly. Instantly.
      </h1>
      
      <p class="hero-body" :class="{ 'video-ended': isVideoEnded }">
        A next-gen visual builder for designers, developers, and dreamers. Create stunning websites without writing a single line of code.
      </p>
      
      <div class="hero-actions">
        <button class="btn-primary-large" @click="emit('start-building')">
          Try Foundry — It's Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/>
          </svg>
        </button>
      </div>
      
      <div class="hero-social-proof">
        <div class="avatars">
          <img src="https://i.pravatar.cc/100?img=11" alt="User 1" />
          <img src="https://i.pravatar.cc/100?img=12" alt="User 2" />
          <img src="https://i.pravatar.cc/100?img=13" alt="User 3" />
        </div>
        <div class="rating-text">
          <div class="stars">★★★★★ <span>4.9/5</span></div>
          <div class="loved-by">Loved by 1,000+ creators worldwide</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  z-index: 1; /* Create stacking context so video stays within this section */
  padding-top: 200px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh;
}

/* Make sure the video spans the entire screen width, even if container is constrained */
.hero-video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100%;
  object-fit: cover;
  z-index: 1; /* Positive z-index relative to .hero-section */
  opacity: 1; /* Full brightness */
  pointer-events: none;
  max-width: none !important; /* Force override of global CSS resets */
}

.hero-video-overlay {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  /* Fade out only the top and bottom edges to blend with the page, let the sides bleed to the monitor edges */
  background: linear-gradient(
    to bottom, 
    var(--landing-bg) 0%, 
    transparent 15%, 
    transparent 85%, 
    var(--landing-bg) 100%
  );
  z-index: 2;
  pointer-events: none;
  max-width: none !important;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 2px solid rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em; /* Massive tracking for cinematic feel */
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  transition: color 2s ease, border-color 2s ease;
}

.hero-badge.video-ended {
  color: #000000 !important;
  border-left-color: #000000 !important;
}

.hero-headline {
  font-family: var(--font-serif);
  font-size: 5.5rem;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  color: var(--landing-primary);
  transition: color 2.5s ease; /* Long, smooth cinematic transition */
}

.hero-headline.video-ended {
  color: #000000 !important;
}

.hero-headline.video-ended .text-primary {
  background: none !important;
  background-image: none !important;
  color: #000000 !important;
  -webkit-text-fill-color: initial !important;
  transition: all 2.5s ease;
}

.hero-headline .text-primary {
  font-style: italic;
  font-weight: 500;
  transition: all 2.5s ease;
}

.text-primary {
  color: var(--landing-primary);
}

.hero-body {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--landing-text-muted);
  margin-bottom: 40px;
  max-width: 600px;
  transition: color 2.5s ease;
}

.hero-body.video-ended {
  color: #000000 !important;
  font-weight: 500; /* Slightly bolder for readability on the bright frame */
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
}

.btn-primary-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  color: black;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease-apple);
}

.btn-primary-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.hero-social-proof {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatars {
  display: flex;
}

.avatars img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--landing-bg);
  margin-left: -12px;
}

.avatars img:first-child {
  margin-left: 0;
}

.rating-text .stars {
  color: #FBBF24;
  font-size: 1.1rem;
  letter-spacing: 2px;
  margin-bottom: 2px;
}

.rating-text .stars span {
  color: var(--landing-text-main);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-left: 4px;
}

.rating-text .loved-by {
  font-size: 0.875rem;
  color: var(--landing-text-muted);
  font-weight: 500;
}
</style>
