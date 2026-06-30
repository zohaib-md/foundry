<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['start-building']);
const router = useRouter();

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const onTryFree = () => {
  emit('start-building');
};
</script>

<template>
  <nav 
    class="landing-nav"
    :class="{ 'nav-scrolled': isScrolled }"
  >
    <div class="landing-container nav-container">
      <div class="nav-left">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Foundry</span>
        </div>
      </div>
      
      <div class="nav-center hidden md:flex">
        <div class="nav-dropdown-wrapper">
          <a href="#product" class="nav-link">
            Product 
            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
          
          <div class="mega-menu">
            <div class="mega-menu-content">
              <a href="/editor" class="mega-item">
                <div class="mega-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>
                <div class="mega-text">
                  <span class="mega-title">Foundry Engine</span>
                  <span class="mega-desc">The core visual builder. Drag, drop, and deploy instantly.</span>
                </div>
              </a>
              
              <a href="/editor?tour=ai" class="mega-item">
                <div class="mega-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div class="mega-text">
                  <span class="mega-title">Foundry AI</span>
                  <span class="mega-desc">Generate entire sections and copy from a single prompt.</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <a href="#templates" class="nav-link">Templates</a>
      </div>
      
      <div class="nav-right">

        <button class="btn-shutter" @click="onTryFree">
          <div class="btn-shutter-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/>
            </svg>
          </div>
          <div class="btn-shutter-text-wrapper">
            <div class="btn-shutter-text">
              <span>Try Foundry — It's Free</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 24px 0;
  /* Premium, buttery smooth transition */
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
              border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(0, 0, 0, 0);
  border-bottom: 1px solid rgba(255, 255, 255, 0);
}

.landing-nav:hover {
  background-color: rgba(0, 0, 0, 0.95); /* Deep rich black */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Subtle glass edge */
}

.landing-nav.nav-scrolled {
  padding: 16px 0;
  background-color: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  color: var(--landing-text-main);
}

.nav-center {
  display: flex;
  gap: 32px;
}

.nav-center > a, .nav-center .nav-link {
  color: var(--landing-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s var(--ease-apple);
  position: relative;
  padding: 4px 0;
  display: flex;
  align-items: center;
}

.nav-center > a::after, .nav-center .nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--landing-primary);
  transition: all 0.3s var(--ease-apple);
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 8px var(--landing-primary);
}

.nav-center > a:hover::after, .nav-center .nav-link:hover::after {
  width: 100%;
}

.nav-center > a:hover, .nav-center .nav-link:hover {
  color: white;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

/* =========================================
   MEGA MENU
   ========================================= */
.nav-dropdown-wrapper {
  position: relative;
  padding-bottom: 20px;
  margin-bottom: -20px;
}

.dropdown-chevron {
  margin-left: 6px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.5;
}

.nav-dropdown-wrapper:hover .dropdown-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

.mega-menu {
  position: absolute;
  top: 100%; /* Gap closed by nav-dropdown-wrapper padding */
  left: -200px; /* Offset to center it better relative to the Product link */
  width: 500px;
  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px; /* Techy sharp edges */
  padding: 12px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(10px) scale(0.98);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
}

/* Glowing tech scanline at the top */
.mega-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--landing-primary);
  box-shadow: 0 0 12px var(--landing-primary), 0 0 24px var(--landing-primary);
  transform: translateX(-50%);
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 2px;
}

.nav-dropdown-wrapper:hover .mega-menu::before {
  width: 120px;
}

.nav-dropdown-wrapper:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.mega-menu-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mega-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px; /* Slightly sharper */
  text-decoration: none;
  
  /* Initial state for the tech reveal animation */
  transform: translateX(-15px);
  opacity: 0;
  filter: blur(4px);
  transition: background 0.2s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, filter 0.4s ease;
}

.nav-dropdown-wrapper:hover .mega-item {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
}

/* Staggered entrance delays */
.nav-dropdown-wrapper:hover .mega-item:nth-child(1) { transition-delay: 0.1s; }
.nav-dropdown-wrapper:hover .mega-item:nth-child(2) { transition-delay: 0.15s; }
.nav-dropdown-wrapper:hover .mega-item:nth-child(3) { transition-delay: 0.2s; }

.mega-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.mega-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: var(--landing-text-muted);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.mega-item:hover .mega-icon-box {
  background: var(--landing-primary);
  color: #000;
  transform: scale(1.05);
}

.mega-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}

.mega-title {
  color: #FFF;
  font-weight: 600;
  font-size: 0.95rem;
}

.mega-desc {
  color: var(--landing-text-muted);
  font-size: 0.85rem;
  line-height: 1.4;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* =========================================
   THE SHUTTER BUTTON
   ========================================= */
.btn-shutter {
  display: flex;
  align-items: center;
  background: var(--landing-primary);
  color: #000000;
  border-radius: 4px; /* Sharp, engineered look */
  height: 38px;
  overflow: hidden;
  border: none;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
  transition: box-shadow 0.4s ease, transform 0.2s ease;
}

.btn-shutter:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}

.btn-shutter:active {
  transform: scale(0.97);
}

.btn-shutter-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.btn-shutter-text-wrapper {
  display: grid;
  /* Magic CSS trick: Animating from 0 to auto width flawlessly */
  grid-template-columns: 0fr;
  transition: grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-shutter:hover .btn-shutter-text-wrapper {
  grid-template-columns: 1fr;
}

.btn-shutter-text {
  overflow: hidden;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  opacity: 0;
  /* Fast fade out when unhovering */
  transition: opacity 0.2s ease;
}

.btn-shutter:hover .btn-shutter-text {
  opacity: 1;
  /* Delayed fade in when hovering so it waits for expansion */
  transition: opacity 0.5s ease 0.1s;
}

/* Padding to give the text breathing room on the right side */
.btn-shutter-text span {
  padding-right: 16px;
}

.login-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--landing-text-main);
  text-decoration: none;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease-apple);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
  background: #f0f0f0;
}

.btn-primary:active {
  transform: translateY(0);
}

.hidden { display: none; }
@media (min-width: 768px) {
  .md\:flex { display: flex; }
}
@media (min-width: 640px) {
  .sm\:flex { display: flex; }
  .sm\:block { display: block; }
}
</style>
