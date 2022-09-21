import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'
import Game from '../views/game.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/game',
    component: Game
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
