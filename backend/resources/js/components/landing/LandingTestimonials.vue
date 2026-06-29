<script setup lang="ts">
const testimonials = [
  {
    quote: "Foundry changed the way we build. It's fast, beautiful, and seriously addictive.",
    author: "Ahmad",
    role: "Indie Maker",
    avatar: "https://i.pravatar.cc/100?img=11"
  },
  {
    quote: "Finally, a visual builder that feels like a professional design tool. We migrated our entire landing page in an hour.",
    author: "Sarah",
    role: "Frontend Lead",
    avatar: "https://i.pravatar.cc/100?img=5"
  },
  {
    quote: "The component system is genius. It's exactly what I've been waiting for.",
    author: "Michael",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/100?img=33"
  }
];
</script>

<template>
  <section class="testimonials-section landing-container">
    <div class="test-header">
      <h2 class="section-title">Loved by creators</h2>
      <p class="section-subtitle">Don't just take our word for it.</p>
    </div>
    
    <div class="testimonials-grid">
      <div 
        v-for="(t, index) in testimonials" 
        :key="index"
        class="testimonial-card"
      >
        <div class="quote-mark">“</div>
        <p class="quote-text">{{ t.quote }}</p>
        <div class="author-info">
          <img :src="t.avatar" :alt="t.author" />
          <div class="author-meta">
            <span class="author-name">{{ t.author }}</span>
            <span class="author-role">{{ t.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section {
  padding: 100px 24px;
}

.test-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--landing-text-main);
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--landing-text-muted);
  margin: 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

.testimonial-card {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  border: 1px solid var(--landing-border);
  display: flex;
  flex-direction: column;
  transition: all 0.3s var(--ease-apple);
  position: relative;
  overflow: hidden;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.quote-mark {
  font-family: serif;
  font-size: 4rem;
  color: var(--landing-glow-emerald);
  line-height: 0;
  margin-top: 24px;
  margin-bottom: 16px;
}

.quote-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--landing-text-main);
  flex: 1;
  margin: 0 0 32px 0;
  font-weight: 500;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--landing-text-main);
}

.author-role {
  font-size: 0.8rem;
  color: var(--landing-text-muted);
}
</style>
