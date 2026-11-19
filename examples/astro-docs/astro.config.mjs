import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import { defineConfig } from 'astro/config';
import { sourceConditions } from '../../source-conditions.ts';

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
      ...sourceConditions.ssr,
      noExternal: ['@var-ui/docs', '@var-ui/astro', '@var-ui/core', '@var-ui/icons'],
    },
    // The repo example loads Var UI from source (`@var-ui/source` in the packages' exports).
    resolve: sourceConditions.resolve,
  },
});
