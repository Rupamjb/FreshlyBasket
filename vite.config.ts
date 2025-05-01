import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Custom plugin to ensure proper MIME types
const mimeTypeFix: Plugin = {
  name: 'mime-type-fix',
  writeBundle: {
    async handler(options) {
      // Create .vercel/output/config.json if deploying to Vercel
      const vercelOutputDir = resolve('.vercel/output')
      if (!fs.existsSync(vercelOutputDir)) {
        fs.mkdirSync(vercelOutputDir, { recursive: true })
        fs.writeFileSync(
          resolve(vercelOutputDir, 'config.json'),
          JSON.stringify({
            version: 3,
            routes: [
              {
                src: '/assets/.*\\.js$',
                headers: {
                  'content-type': 'application/javascript; charset=utf-8',
                  'cache-control': 'public, max-age=31536000, immutable'
                }
              }
            ]
          }, null, 2)
        )
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mimeTypeFix],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    cors: true
  }
})
