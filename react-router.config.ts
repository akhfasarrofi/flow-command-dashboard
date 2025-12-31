import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
  future: {
    v8_middleware: true,
  },
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  presets: [vercelPreset()],
  ssr: true,
} satisfies Config;
