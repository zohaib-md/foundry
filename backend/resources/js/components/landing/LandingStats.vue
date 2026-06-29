<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const stats = [
  { label: 'Components', value: 100, suffix: '+' },
  { label: 'Premium Templates', value: 50, suffix: '+' },
  { label: 'Possibilities', value: '∞', suffix: '' },
  { label: 'Free Forever', value: 100, suffix: '%' }
];

const statsRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  
  if (statsRef.value) {
    observer.observe(statsRef.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <section class="stats-section" ref="statsRef">
    <div class="landing-container stats-content">
      
      <div class="stats-header">
        <div class="logo-mark">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <div>
          <h2 class="founder-message">Built for creators who think beyond limits.</h2>
          <p class="founder-sub">Think it. Build it. <span style="text-decoration: underline">Publish</span> it. All in Foundry.</p>
        </div>
      </div>
      
      <div class="stats-grid" :class="{ 'is-visible': isVisible }">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item" :style="{ transitionDelay: `${index * 100}ms` }">
          <div class="stat-value">
            {{ stat.value }}<span>{{ stat.suffix }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        
        <div class="stat-cta">
          <button class="btn-primary-dark">
            Try Foundry — It's Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/>
            </svg>
          </button>
          <div class="stat-checks">
            <span>✓ No credit card required</span>
            <span>✓ No limits</span>
            <span>✓ Just build</span>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  border-radius: 40px;
  margin: 0 24px;
  border: 1px solid var(--landing-border);
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

.stats-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
}

@media (max-width: 1024px) {
  .stats-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

.stats-header {
  display: flex;
  gap: 24px;
  max-width: 500px;
}

.logo-mark {
  flex-shrink: 0;
}

.founder-message {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.founder-sub {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.stats-grid {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s var(--ease-apple);
}

.stats-grid.is-visible .stat-item {
  opacity: 1;
  transform: translateY(0);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.stat-value span {
  font-size: 1.5rem;
  margin-top: 2px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-cta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 24px;
}

@media (max-width: 768px) {
  .stat-cta {
    margin-left: 0;
    width: 100%;
  }
}

.btn-primary-dark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  color: black;
  border: none;
  padding: 16px 32px;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s var(--ease-apple);
}

.btn-primary-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
  background: #f0f0f0;
}

.stat-checks {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
