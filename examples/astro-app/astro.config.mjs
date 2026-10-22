import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';

const root = fileURLToPath(new URL('../..', import.meta.url));

const devAliases = {
  '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
  '@var-ui/core/components': `${root}/packages/core/src/components`,
  '@var-ui/core': `${root}/packages/core/src/index.ts`,
  '@var-ui/icons/glyphs/': `${root}/packages/icons/src/glyph-data/`,
  '@var-ui/icons/glyphs': `${root}/packages/icons/src/glyphs.ts`,
  '@var-ui/astro': `${root}/packages/astro/index.ts`,
};

export default defineConfig(({ command }) => ({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: command === 'serve' ? { alias: devAliases } : undefined,
  },
}));
