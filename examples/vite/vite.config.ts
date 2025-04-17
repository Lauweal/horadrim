import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteImportPlugin } from '@horadrim/vite-plugin-import';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteImportPlugin({
    libraryName: '@horadrim/components',
    libraryDirectory: 'es',
    style: true
  })],
  resolve: {
    alias: {
      '@horadrim/theme': path.resolve(__dirname, '../../packages/theme'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
