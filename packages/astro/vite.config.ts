import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));
const glyphs = fileURLToPath(new URL('../icons/src/glyphs.ts', import.meta.url));
const glyphData = fileURLToPath(new URL('../icons/src/glyph-data/', import.meta.url));

export default defineConfig({
  resolve: {
    // String keys match by prefix: the glyph barrel and single glyphs need anchored patterns.
    alias: [
      { find: /^@var-ui\/icons\/glyphs$/, replacement: glyphs },
      { find: /^@var-ui\/icons\/glyphs\/(.+)$/, replacement: `${glyphData}$1` },
      { find: '@var-ui/core/components', replacement: `${coreSrc}/components` },
      { find: '@var-ui/core/shared', replacement: `${coreSrc}/shared` },
      { find: '@var-ui/core/tokens', replacement: `${coreSrc}/tokens` },
      { find: '@var-ui/core/icons', replacement: `${coreSrc}/icons` },
      { find: '@var-ui/core/theme-constants', replacement: `${coreSrc}/theme/constants.ts` },
    ],
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
