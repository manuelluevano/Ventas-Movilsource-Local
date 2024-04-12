import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/FRONTEND-MOVILSOURCE-STOCK/",
  define: {
    global: "globalThis",
  },
  build:{
    target: "esnext" // or "es2019",

   }
})
