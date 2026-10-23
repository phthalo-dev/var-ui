import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));
const glyphs = fileURLToPath(new URL('../icons/src/glyphs.ts', import.meta.url));
const glyphData = fileURLToPath(new URL('../icons/src/glyph-data/', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@var-ui/core/components': `${coreSrc}/components`,
      '@var-ui/core/theme-constants': `${coreSrc}/theme/constants.ts`,
      '@var-ui/icons/glyphs/': glyphData,
      '@var-ui/icons/glyphs': glyphs,
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
