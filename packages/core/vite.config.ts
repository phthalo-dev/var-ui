import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    // Full recipe graph + TypeStyles extract (styles-css.test.ts) can exceed 5s when the suite is busy.
    testTimeout: 15_000,
  },
  pack: {
    entry: [
      'src/index.ts',
      'src/internal.ts',
      'src/styles.ts',
      'src/theme/constants.ts',
      'src/theme/register-default.ts',
    ],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: { neverBundle: ['typestyles'] },
  },
});
