import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'virtual:uno.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'animate.css'

// 路由配置
const routes = [
  { path: '/', component: () => import('./pages/index.vue') },
  { path: '/game', component: () => import('./pages/game.vue') }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// 使用路由
app.use(router).use(createPinia()).mount('#app')
