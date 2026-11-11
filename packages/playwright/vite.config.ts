import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import typestyles from '@typestyles/vite';
import { defineConfig } from 'vite-plus';

// The fixture app (`vp dev` serves it for the Playwright tests in tests/) resolves the design
// system from source, mirroring examples/vite-app. The shipped `pack` entry (src/) never
// imports the design system itself, so the aliases below only exist for the fixture.
const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  plugins: [
    ...react(),
    typestyles({ extract: { modules: ['fixture/typestyles-entry.ts'] }, compile: true }),
  ],
  resolve: {
    alias: {
      '@var-ui/core/theme-constants': `${root}/packages/core/src/theme/constants.ts`,
      '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
      '@var-ui/core/components': `${root}/packages/core/src/components`,
      '@var-ui/core/shared': `${root}/packages/core/src/shared`,
      '@var-ui/core/tokens': `${root}/packages/core/src/tokens`,
      '@var-ui/core/icons': `${root}/packages/core/src/icons`,
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons/glyphs/': `${root}/packages/icons/src/glyph-data/`,
      '@var-ui/icons/glyphs': `${root}/packages/icons/src/glyphs.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
    },
  },
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: ['@playwright/test', 'playwright-core'],
    },
  },
});
