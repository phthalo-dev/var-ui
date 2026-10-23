import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'astro:transitions/client') {
          return '\0astro-transitions-client-stub';
        }
      },
      load(id) {
        if (id === '\0astro-transitions-client-stub') {
          return 'export const navigate = () => Promise.resolve();';
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@var-ui/core/components': `${coreSrc}/components`,
    },
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: 'jsdom',
  },
});
