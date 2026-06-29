<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const header = ref<HTMLElement | null>(null);
const bentoGrid = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

const handleMouseMove = (e: MouseEvent) => {
  if (!bentoGrid.value) return;
  const cards = bentoGrid.value.querySelectorAll('.bento-card');
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
    (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
  }
};

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
    } else {
      // Reset when scrolling out of view so it replays when scrolling back
      isVisible.value = false;
    }
  }, {
    threshold: 0.2 // Trigger when 20% of the header is in view
  });

  if (header.value) {
    observer.observe(header.value);
  }

  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
  <section class="features-section landing-container" id="features">
    <div ref="header" class="features-header" :class="{ 'is-visible': isVisible }">
      <h2 class="section-title">
        <span class="animated-line line-left">Built for speed.</span><br/>
        <span class="animated-line line-right">Designed for perfection.</span>
      </h2>
      <p class="section-subtitle">Everything you need to launch world-class websites in minutes, not months.</p>
    </div>
    
    <div ref="bentoGrid" class="bento-grid">
      <!-- Large Box 1: Visual Canvas -->
      <div class="bento-card card-large">
        <div class="card-content">
          <h3>Pixel-Perfect Canvas</h3>
          <p>Drag, drop, and resize with infinite freedom. The canvas translates your visual design perfectly to clean code.</p>
        </div>
        <div class="card-visual">
          <div class="mock-canvas">
            <div class="mock-sidebar"></div>
            <div class="mock-workspace">
              <div class="mock-element element-1"></div>
              <div class="mock-element element-2"></div>
              <div class="mock-element element-3"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tall Box 2: Instant Deployment -->
      <div class="bento-card card-tall">
        <div class="card-content">
          <h3>One-Click Deploy</h3>
          <p>Push your site globally to edge networks instantly.</p>
        </div>
        <div class="card-visual visual-center">
          <div class="deploy-ring-container">
            <div class="deploy-ring"></div>
            <div class="deploy-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wide Box 3: Export Code -->
      <div class="bento-card card-wide">
        <div class="card-content horizontal-content">
          <div class="wide-text">
            <h3>Clean Code Export</h3>
            <p>Never get locked in. Export your entire project to clean Vue or React components whenever you want. The code is yours.</p>
          </div>
          <div class="mock-code">
            <pre><code><span class="keyword">export default function</span> <span class="func">App</span>() {
  <span class="keyword">return</span> (
    &lt;<span class="tag">div</span> <span class="attr">className</span>=<span class="string">"hero"</span>&gt;
      &lt;<span class="tag">h1</span>&gt;Hello World&lt;/<span class="tag">h1</span>&gt;
    &lt;/<span class="tag">div</span>&gt;
  )
}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 40px 24px 120px 24px; /* Reduced top padding to pull text upwards */
  position: relative;
  z-index: 10;
}

.features-header {
  text-align: center;
  margin-bottom: 64px; /* Slightly reduced bottom margin */
  overflow: hidden; 
  padding: 0 0 20px 0; /* Removed top padding to bring it closer */
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 500;
  line-height: 1.1;
  color: var(--landing-text-main);
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
}

.animated-line {
  display: inline-block;
  will-change: transform, opacity, background-position;
  opacity: 0;
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  
  background-image: linear-gradient(
    90deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.2) 40%, 
    rgba(255, 210, 140, 0.8) 46%, /* Warm amber leading edge */
    #FFF9EB 50%, /* Bright creamy core */
    rgba(255, 210, 140, 0.8) 54%, /* Warm amber trailing edge */
    rgba(255, 255, 255, 0.2) 60%, 
    rgba(255, 255, 255, 0.2) 100%
  );
  
  background-position: 200% center;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), 
              opacity 2s cubic-bezier(0.16, 1, 0.3, 1), 
              background-position 2.5s ease-in-out;
}

.line-left {
  transform: translateX(-150px);
}

.line-right {
  transform: translateX(150px);
}

.features-header.is-visible .animated-line {
  opacity: 1;
  transform: translateX(0);
  background-position: -200% center;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--landing-text-muted);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, 
              transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
}

.features-header.is-visible .section-subtitle {
  opacity: 1;
  transform: translateY(0);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 350px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.bento-card {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s var(--ease-apple), box-shadow 0.4s var(--ease-apple);
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

/* Spotlight Background */
.bento-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(
    800px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px),
    rgba(255, 255, 255, 0.06),
    transparent 40%
  );
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

/* Spotlight Border */
.bento-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: radial-gradient(
    600px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px),
    rgba(255, 255, 255, 0.4),
    transparent 40%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.bento-grid:hover .bento-card::before,
.bento-grid:hover .bento-card::after {
  opacity: 1;
}

.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(0,0,0,0.4);
}

.card-large {
  grid-column: span 2;
  grid-row: span 2;
}

.card-tall {
  grid-column: span 1;
  grid-row: span 2;
}

.card-wide {
  grid-column: span 3;
  grid-row: span 1;
}

.card-content {
  padding: 48px;
  position: relative;
  z-index: 2;
}

.card-content h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--landing-text-main);
  margin: 0 0 16px 0;
}

.card-content p {
  color: var(--landing-text-muted);
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
}

/* Card Visuals */
.card-visual {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.visual-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mock Canvas */
.mock-canvas {
  position: absolute;
  right: -40px;
  bottom: -40px;
  width: 90%;
  height: 85%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  display: flex;
  transition: transform 0.5s var(--ease-apple);
}

.card-large:hover .mock-canvas {
  transform: scale(1.02) translate(-10px, -10px);
}

.mock-sidebar {
  width: 80px;
  border-right: 1px solid rgba(255,255,255,0.05);
  background: rgba(255,255,255,0.02);
}

.mock-workspace {
  flex: 1;
  padding: 32px;
  position: relative;
}

.mock-element {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  position: absolute;
}

.element-1 { width: 60%; height: 40px; top: 32px; left: 32px; }
.element-2 { width: 40%; height: 160px; top: 88px; left: 32px; }
.element-3 { width: 35%; height: 160px; top: 88px; left: calc(40% + 48px); }

/* Deploy Ring */
.deploy-ring-container {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deploy-ring {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border-radius: 50%;
  border: 2px dashed rgba(255,255,255,0.1);
  border-top-color: var(--landing-primary);
  animation: spin 8s linear infinite;
}

.deploy-icon {
  color: var(--landing-primary);
  transition: transform 0.3s var(--ease-apple);
}

.card-tall:hover .deploy-icon {
  transform: translateY(-8px);
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* Wide Card */
.horizontal-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.wide-text {
  max-width: 400px;
}

.mock-code {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  width: 450px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  color: #a1a1aa;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  transition: transform 0.4s var(--ease-apple);
}

.card-wide:hover .mock-code {
  transform: scale(1.02);
}

.keyword { color: #F87171; }
.func { color: #60A5FA; }
.tag { color: var(--landing-primary); }
.attr { color: #C084FC; }
.string { color: #FCD34D; }

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
  
  .card-large, .card-tall, .card-wide {
    grid-column: span 1;
    grid-row: auto;
    min-height: 400px;
  }
  
  .horizontal-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
  
  .mock-code {
    width: 100%;
  }
}
</style>
