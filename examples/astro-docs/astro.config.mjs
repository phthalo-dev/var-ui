import { fileURLToPath } from 'node:url';
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import { defineConfig } from 'astro/config';

const root = fileURLToPath(new URL('../..', import.meta.url));

// String alias keys match by prefix, so the glyph barrel (`@var-ui/icons/glyphs`) and single
// glyphs (`@var-ui/icons/glyphs/<name>`) need anchored patterns.
const glyphAliases = (iconsSrc) => [
  { find: /^@var-ui\/icons\/glyphs$/, replacement: `${iconsSrc}/glyphs.ts` },
  { find: /^@var-ui\/icons\/glyphs\/(.+)$/, replacement: `${iconsSrc}/glyph-data/$1` },
];
const aliasList = (aliases) =>
  Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }));

export default defineConfig({
  output: 'static',
  integrations: [
    varDocs({
      title: 'Example Docs',
      theme: {
        defaultClassName: defaultThemeClassName,
        syntax: 'design-tokens',
        colorMode: { default: 'system', storageKey: 'theme-mode' },
      },
      typestyles: {
        entry: 'typestyles-entry.ts',
      },
      routes: {
        docs: { prefix: '/docs', collection: 'docs' },
      },
      components: {
        Layout: './src/layouts/BaseLayout.astro',
      },
      topNav: [{ text: 'Docs', link: '/docs', match: '/docs' }],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['@var-ui/docs', '@var-ui/astro', '@var-ui/core'],
    },
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
          '@var-ui/astro': `${root}/packages/astro/index.ts`,
          '@var-ui/docs/schema': `${root}/packages/docs/schema.ts`,
          '@var-ui/docs/utils': `${root}/packages/docs/src/utils/index.ts`,
          '@var-ui/docs/theme-client': `${root}/packages/docs/src/utils/theme/client.ts`,
          '@var-ui/docs/shiki': `${root}/packages/docs/src/utils/shiki-theme.ts`,
          '@var-ui/docs/middleware': `${root}/packages/docs/src/middleware.ts`,
          '@var-ui/docs/DocsGuidePage': `${root}/packages/docs/src/components/DocsGuidePage.astro`,
          '@var-ui/docs/DocsPage': `${root}/packages/docs/src/components/DocsPage.astro`,
          '@var-ui/docs/routes/guide.astro': `${root}/packages/docs/src/routes/guide.astro`,
          '@var-ui/docs': `${root}/packages/docs/index.ts`,
        }),
      ],
    },
  },
});
