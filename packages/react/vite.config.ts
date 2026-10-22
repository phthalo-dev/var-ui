import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@var-ui/core/theme-constants': `${coreSrc}/theme/constants.ts`,
      '@var-ui/core/components': `${coreSrc}/components`,
    },
  },
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: ['react', 'react-dom', 'react-aria-components', '@var-ui/core', 'typestyles'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
