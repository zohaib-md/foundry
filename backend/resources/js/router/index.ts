import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import PageEditor from '../views/PageEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/editor',
      name: 'editor',
      component: PageEditor
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/PagePreview.vue')
    },
    {
      path: '/p/:slug',
      name: 'shared-preview',
      component: () => import('../views/PagePreview.vue')
    }
  ]
})

export default router
