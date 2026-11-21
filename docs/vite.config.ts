import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { sourceConditions } from '../source-conditions';

const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    ...react(),
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'astro:transitions/client') {
          return '\0astro-transitions-client-stub';
        }
        if (id === 'virtual:homepage-preloads') {
          return '\0virtual-homepage-preloads-stub';
        }
      },
      load(id) {
        if (id === '\0virtual-homepage-preloads-stub') {
          return 'export default [];';
        }
        if (id === '\0astro-transitions-client-stub') {
          return 'export const navigate = () => Promise.resolve();';
        }
        // Keep `?raw` imports intact for Astro Props/slots extraction in tests.
        if (id.includes('.astro') && !id.includes('?raw') && !id.includes('&raw')) {
          return 'export default function AstroStub() { return null; }';
        }
      },
    },
  ],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  // Workspace packages load from source, via their exports' `@var-ui/source` condition.
  ...sourceConditions,
  resolve: {
    ...sourceConditions.resolve,
    alias: [{ find: '@', replacement: path.join(docsRoot, 'src') }],
  },
});
