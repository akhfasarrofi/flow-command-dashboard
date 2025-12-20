import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import Inspect from 'vite-plugin-inspect';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cssPreloader } from './vite-css-preloader';

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

            // Libraries (client or server; SSR externals won't match here)
            if (id.includes('/react-router/')) return 'router';
            if (id.includes('@tanstack/react-query')) return 'tanstack';
            // if (id.includes('/antd/')) return 'antd';
            // if (id.includes('@ant-design/icons')) return 'antd';
            // if (id.includes('@ant-design/pro-components')) return 'antdpro';
            // if (id.includes('posthog-js')) return 'posthog';
            if (id.includes('lucide-react')) return 'lucide';

            // Misc bucket (axios, js-cookie, jwt-decode, etc.)
            if (
              /node_modules\/(axios|js-cookie|jwt-decode|dompurify|clsx|sonner|tailwind-merge|zustand|cmdk|crypto-js|isbot|react-infinite-scroll-component)\//.test(
                id,
              )
            )
              return 'misc';

            // default vendor fallback
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
      cssPreloader(),
      imagetools(),
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
      {
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/mock-sw-iframe') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(
                '<!doctype html><html><head><title>Mock SW</title></head><body></body></html>',
              );
              return;
            }
            next();
          });
        },
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/mock-sw-iframe') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(
                '<!doctype html><html><head><title>Mock SW</title></head><body></body></html>',
              );
              return;
            }
            next();
          });
        },
        name: 'serve-mock-sw-iframe',
      },
    ],
    ssr: {
      noExternal: ['posthog-js', 'posthog-js/react'],
    },
  };
});
