import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ vue(), UnoCSS() ],
  resolve: {
    alias: {
      '@': '/src/'
    }
  }
})
