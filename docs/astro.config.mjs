import path from 'node:path';
import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import componentDocsPlugin from '@var-ui/docs-components';
import { defineConfig } from 'astro/config';
import { sourceConditions } from '../source-conditions.ts';
import { writeComponentProps } from './src/lib/extract-component-props.ts';
import { writeStylingHooks } from './src/lib/extract-styling-hooks.ts';
import { homepagePreloadPlugin } from './src/lib/homepage-preload-plugin.ts';
import { rolldownJsxOptionsCompat } from './src/lib/rolldown-jsx-options.ts';
import { docsThemePresets } from './src/themes/presets.ts';

const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  redirects: {
    // The sidebar says "Design tokens"; keep the readable URL working.
    '/theming/design-tokens': '/theming/tokens',
  },
  adapter: netlify(),
  integrations: [
    varDocs({
      title: 'Var UI',
      favicon: '/favicon.svg',
      theme: {
        defaultClassName: defaultThemeClassName,
        // Theme-driven syntax: Shiki uses color.code.* from createDesignTheme().
        syntax: 'design-tokens',
        // Showcase picker + lazy CSS — single list in src/themes/presets.ts
        presets: [...docsThemePresets],
      },
      typestyles: {
        entry: 'typestyles-entry.ts',
      },
      // Free-form guide routes — theming is a site section, not a kit privilege.
      routes: {
        docs: { prefix: '/docs', collection: 'docs' },
        theming: { prefix: '/theming', collection: 'theming' },
      },
      components: {
        Layout: './src/layouts/BaseLayout.astro',
        mdxComponents: './src/lib/guide-mdx-components.ts',
      },
      markdownViews: {
        extraPrefixes: ['/components'],
        tagline: 'Var UI component catalog and guides, as markdown for agents.',
      },
      // Site owns guide pages + middleware (Netlify SSR + workspace `.astro` resolution).
      disableGuideRoutes: true,
      disableMiddleware: true,
    }),
    componentDocsPlugin({
      extractProps: {
        // Props and plain-CSS styling hooks (`src/generated/styling`) regenerate together.
        write: async (outputDir) => {
          writeComponentProps(outputDir);
          await writeStylingHooks(path.resolve(outputDir, '../styling'));
        },
        outputDir: 'src/generated/props',
        watch: ['../packages/react/src'],
      },
      disableComponentRoutes: true,
      disableMiddleware: true,
    }),
    react(),
  ],
  vite: {
    ssr: {
      ...sourceConditions.ssr,
      // Workspace packages ship raw `.astro` / `.ts` source — must be processed by Vite SSR.
      noExternal: [
        '@var-ui/docs',
        '@var-ui/docs-components',
        '@var-ui/astro',
        '@var-ui/core',
        '@var-ui/react',
        '@var-ui/icons',
      ],
    },
    plugins: [rolldownJsxOptionsCompat(), homepagePreloadPlugin()],
    // Workspace packages load from source, via their exports' `@var-ui/source` condition.
    resolve: {
      ...sourceConditions.resolve,
      alias: [{ find: '@', replacement: `${docsRoot}/src` }],
    },
  },
});
