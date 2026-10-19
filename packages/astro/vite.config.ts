import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@var-ui/core/components': `${coreSrc}/components`,
    },
  },
  test: {
    environment: 'jsdom',
  },
});
