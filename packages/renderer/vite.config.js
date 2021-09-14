/* eslint-env node */

// @ts-ignore
import { chrome } from '../../electron-vendors.config.json';
import { defineConfig } from 'vite';
import { join } from 'path';
import { builtinModules } from 'module';
import vue from '@vitejs/plugin-vue';

const prefix = 'monaco-editor/esm/vs';
const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = defineConfig({
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
      onwarn: function (message) {
        // Doesn't actually work
        // https://rollupjs.org/guide/en/#error-this-is-undefined
        if (
          /The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten./.test(
            message,
          )
        ) {
          return;
        }
        console.error(message);
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
});

export default config;
