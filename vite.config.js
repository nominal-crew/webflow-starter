import 'dotenv/config';

import { defineConfig } from 'vite';

import { stagingAutoDeployPlugin } from './scripts/vite-staging-auto-deploy.js';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const autoDeployStaging = process.env.VITE_STAGING_AUTO_DEPLOY === '1' && mode === 'staging';

  return {
    plugins: autoDeployStaging ? [stagingAutoDeployPlugin()] : [],

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'oxc' : false,

      lib: {
        entry: './src/js/main.js',
        formats: ['es'],
        fileName: () => 'bundle.js'
      },

      rollupOptions: {
        output: {
          entryFileNames: 'bundle.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'bundle.css';
            }

            return 'assets/[name][extname]';
          }
        }
      }
    },

    server: {
      host: true,
      port: 3000,
      cors: true,
      strictPort: true
    }
  };
});
