import { defineConfig } from 'vite'
import { viteRequire } from 'vite-require'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteRequire()],
})
