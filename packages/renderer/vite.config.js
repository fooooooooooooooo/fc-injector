/* eslint-env node */

// @ts-ignore
import { chrome } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';
import vue from '@vitejs/plugin-vue';

const prefix = 'monaco-editor/esm/vs';
const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [vue()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [...builtinModules],
      output: {
        manualChunks: {
          cssWorker: [`${prefix}/language/css/css.worker`],
          editorWorker: [`${prefix}/editor/editor.worker`],
        },
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;