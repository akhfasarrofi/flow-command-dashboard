import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    build: {
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('/react-router/')) return 'router';
            if (id.includes('@tanstack/react-table')) return 'tanstack';
            if (id.includes('lucide-react')) return 'lucide';

            return 'vendor';
          },
        },
        treeshake: { moduleSideEffects: false },
      },
    },
    define: {
      __DEV__: JSON.stringify(!isProd),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    esbuild: {
      pure: ['console.log', 'console.info', 'console.debug'],
    },
    plugins: [
      tailwindcss(),
      reactRouterDevTools({
        client: {
          enableInspector: false,
          showBreakpointIndicator: true,
        },
        server: {
          logs: {
            actions: true,
            loaders: false,
            serverTimings: true,
          },
        },
      }),
      reactRouter(),
      tsconfigPaths(),
      Inspect(),
    ],
  };
});
