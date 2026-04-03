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
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        client: resolve(__dirname, 'src/client/init.ts'), // Phase 4: 客户端入口
      },
      name: 'MarkdownWorldview',
      formats: ['es'], // 多入口点只能使用 ES 格式
      fileName: (format, entryName) => {
        // 所有文件都生成 ESM 格式
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      external: [
        'markdown-it',
        'js-yaml',
        'echarts',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          // 确保 CSS 文件始终命名为 style.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
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
