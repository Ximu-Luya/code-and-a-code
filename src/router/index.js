import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
