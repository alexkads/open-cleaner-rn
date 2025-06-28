// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexkads.github.io',
  base: '/open-cleaner-rn',
  outDir: './dist',
  build: {
    assets: 'assets'
  },
  compressHTML: true,
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro/runtime']
          }
        }
      }
    }
  }
});
