import { createRouter, createWebHistory } from 'vue-router'
import PageEditor from '../views/PageEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'editor',
      component: PageEditor
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/PagePreview.vue')
    }
  ]
})

export default router
