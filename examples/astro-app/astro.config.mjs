import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';

const root = fileURLToPath(new URL('../..', import.meta.url));

// String alias keys match by prefix, so the glyph barrel (`@var-ui/icons/glyphs`) and single
// glyphs (`@var-ui/icons/glyphs/<name>`) need anchored patterns.
const devAliases = [
  { find: /^@var-ui\/icons\/glyphs$/, replacement: `${root}/packages/icons/src/glyphs.ts` },
  {
    find: /^@var-ui\/icons\/glyphs\/(.+)$/,
    replacement: `${root}/packages/icons/src/glyph-data/$1`,
  },
  ...Object.entries({
    '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
    '@var-ui/core/components': `${root}/packages/core/src/components`,
    '@var-ui/core/shared': `${root}/packages/core/src/shared`,
    '@var-ui/core/tokens': `${root}/packages/core/src/tokens`,
    '@var-ui/core/icons': `${root}/packages/core/src/icons`,
    '@var-ui/core': `${root}/packages/core/src/index.ts`,
    '@var-ui/astro': `${root}/packages/astro/index.ts`,
  }).map(([find, replacement]) => ({ find, replacement })),
];

export default defineConfig(({ command }) => ({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: command === 'serve' ? { alias: devAliases } : undefined,
  },
}));
