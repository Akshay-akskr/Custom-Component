import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env file based on mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.BASE_PATH || '/',
    plugins: [react()],
  }
})
