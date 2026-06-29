<script setup lang="ts">
</script>

<template>
  <footer class="landing-footer">
    <div class="landing-container footer-content">
      <div class="footer-brand">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Foundry</span>
        </div>
        <p class="brand-desc">
          The next-generation visual builder for creators who think beyond limits.
        </p>
        <div class="social-links">
          <a href="#">𝕏</a>
          <a href="#">GH</a>
          <a href="#">YT</a>
        </div>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Templates</a>
          <a href="#">Integrations</a>
          <a href="#">Changelog</a>
        </div>
        <div class="link-group">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Legal</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
    
    <div class="landing-container footer-bottom">
      <p>&copy; 2026 Foundry Inc. All rights reserved.</p>
      <div class="bottom-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.landing-footer {
  padding: 80px 0 40px;
  background: transparent;
  border-top: 1px solid var(--landing-border);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 64px;
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
}

.footer-brand {
  max-width: 300px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: var(--landing-text-main);
  margin-bottom: 16px;
}

.brand-desc {
  color: var(--landing-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--landing-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--landing-text-main);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
}

.social-links a:hover {
  background: var(--landing-primary);
  color: white;
}

.footer-links {
  display: flex;
  gap: 80px;
}

@media (max-width: 640px) {
  .footer-links {
    flex-wrap: wrap;
    gap: 40px;
  }
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-group h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--landing-text-main);
  margin: 0 0 8px 0;
}

.link-group a {
  font-size: 0.875rem;
  color: var(--landing-text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.link-group a:hover {
  color: var(--landing-primary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--landing-border);
  background: transparent;
  color: #A1A1AA;
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

.bottom-links {
  display: flex;
  gap: 24px;
}

.bottom-links a {
  color: inherit;
  text-decoration: none;
}

.bottom-links a:hover {
  color: var(--landing-text-main);
}
</style>
