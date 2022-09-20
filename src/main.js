import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button } from 'element-ui'

const app = createApp(App)
app.use(store).use(router).use(Button)
app.mount('#app')