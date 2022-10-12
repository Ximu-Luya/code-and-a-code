import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
import { globalErrorHandle } from "./utils/global_error_catch.js"
window.onerror = (msg,url,l,c,error) => {
  globalErrorHandle(msg, error)
}
app.config.errorHandler = (err) => {
  globalErrorHandle(err.message, err)
}
app.use(store).use(router).use(ElementPlus)
app.mount('#app')