import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import typestyles from '@typestyles/vite';
import { defineConfig, type UserConfig } from 'vite-plus';
// Repo examples load core from source (see the aliases below); an app imports `@var-ui/core/vite`.
import { varUiColorMode } from '../../packages/core/src/vite';
import { defaultThemeClassName } from '../../packages/core/src/theme/constants';
import { COLOR_MODE } from './src/colorModeConfig';

const root = fileURLToPath(new URL('../..', import.meta.url));

// String alias keys match by prefix, so the glyph barrel (`@var-ui/icons/glyphs`) and single
// glyphs (`@var-ui/icons/glyphs/<name>`) need anchored patterns.
const glyphAliases = (iconsSrc: string) => [
  { find: /^@var-ui\/icons\/glyphs$/, replacement: `${iconsSrc}/glyphs.ts` },
  { find: /^@var-ui\/icons\/glyphs\/(.+)$/, replacement: `${iconsSrc}/glyph-data/$1` },
];
const aliasList = (aliases: Record<string, string>) =>
  Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }));

export default defineConfig({
  plugins: [
    ...react(),
    typestyles({ extract: { modules: ['typestyles-entry.ts'] }, compile: true }),
    // Paints the stored colour mode before React loads (no flash on reload).
    varUiColorMode({ ...COLOR_MODE, themeClassName: defaultThemeClassName }),
  ],
  resolve: {
    alias: [
      ...glyphAliases(`${root}/packages/icons/src`),
      ...aliasList({
        '@var-ui/core/theme-constants': `${root}/packages/core/src/theme/constants.ts`,
        '@var-ui/core/color-mode-script': `${root}/packages/core/src/theme/colorModeScript.ts`,
        '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
        '@var-ui/core/components': `${root}/packages/core/src/components`,
        '@var-ui/core/shared': `${root}/packages/core/src/shared`,
        '@var-ui/core/tokens': `${root}/packages/core/src/tokens`,
        '@var-ui/core/icons': `${root}/packages/core/src/icons`,
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/react': `${root}/packages/react/src/index.ts`,
        '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      }),
    ],
  },
} as UserConfig);
