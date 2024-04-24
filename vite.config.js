import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // the default entry point
        app: './index.html',

        // Separate entry for service worker
        'service-worker': './service-worker.js',
      },
      output: {
        // without hash file names
        entryFileNames: assetInfo => {
          return assetInfo.name === 'service-worker'
             ? '[name].js'         // put service worker in root
             : 'assets/[name].js' // temp without hash
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    react(),
  ],
})
