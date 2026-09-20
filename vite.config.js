import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'oxc' : false,

      lib: {
        entry: './src/js/main.js',
        formats: ['es'],
        fileName: () => 'main.js'
      },

      rollupOptions: {
        output: {
          entryFileNames: 'main.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'main.css';
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
