import { createRouter, createWebHashHistory } from 'vue-router'
import Game from '../views/game.vue'

const routes = [
  {
    path: '/',
    redirect: '/game'
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
