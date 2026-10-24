import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    // Full recipe graph + TypeStyles extract (styles-css.test.ts) can exceed 5s when the suite is busy.
    testTimeout: 15_000,
  },
  pack: {
    entry: [
      'src/index.ts',
      'src/styles.ts',
      'src/components/indicators/tabs.ts',
      'src/components/indicators/segmented-control.ts',
      'src/components/indicators/toc.ts',
      'src/components/toc/spy.ts',
      'src/theme/constants.ts',
      'src/theme/register-default.ts',
    ],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: ['typestyles'],
    },
  },
});
