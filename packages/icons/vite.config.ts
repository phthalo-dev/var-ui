import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const src = fileURLToPath(new URL('./src', import.meta.url));
const glyphData = readdirSync(join(src, 'glyph-data'))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => `src/glyph-data/${file}`);
const icons = readdirSync(join(src, 'icons'))
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => `src/icons/${file}`);

export default defineConfig({
  pack: {
    entry: ['src/index.ts', 'src/glyphs.ts', ...glyphData, ...icons],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: { neverBundle: ['react', '@var-ui/core'] },
  },
});
