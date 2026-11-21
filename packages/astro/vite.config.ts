import { defineConfig } from 'vite-plus';
import { sourceConditions } from '../../source-conditions';

export default defineConfig({
  // Workspace packages (`@var-ui/core`, `@var-ui/icons`) load from source.
  ...sourceConditions,
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: 'jsdom',
  },
});
