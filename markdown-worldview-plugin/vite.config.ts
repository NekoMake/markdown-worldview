import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MarkdownWorldview',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') return 'markdown-worldview.umd.cjs';
        return 'markdown-worldview.js';
      },
    },
    rollupOptions: {
      external: ['markdown-it', 'js-yaml'],
      output: {
        globals: {
          'markdown-it': 'markdownit',
          'js-yaml': 'jsyaml',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'asset';
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: false,
  },
});
