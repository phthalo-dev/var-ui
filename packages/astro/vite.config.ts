import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));
const glyphs = fileURLToPath(new URL('../icons/src/glyphs.ts', import.meta.url));
const glyphData = fileURLToPath(new URL('../icons/src/glyph-data/', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@var-ui/core/components': `${coreSrc}/components`,
      '@var-ui/icons/glyphs/': glyphData,
      '@var-ui/icons/glyphs': glyphs,
    },
  },
  test: {
    environment: 'jsdom',
  },
});
