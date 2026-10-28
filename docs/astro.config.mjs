import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import componentDocsPlugin from '@var-ui/docs-components';
import { defineConfig } from 'astro/config';
import { writeComponentProps } from './src/lib/extract-component-props.ts';
import { homepagePreloadPlugin } from './src/lib/homepage-preload-plugin.ts';
import { rolldownJsxOptionsCompat } from './src/lib/rolldown-jsx-options.ts';
import { docsThemePresets } from './src/themes/presets.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    varDocs({
      title: 'Var UI',
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
        write: writeComponentProps,
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
    resolve: {
      alias: {
        '@var-ui/core/theme-constants': `${root}/packages/core/src/theme/constants.ts`,
        '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
        '@var-ui/core/components': `${root}/packages/core/src/components`,
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/react': `${root}/packages/react/src/index.ts`,
        '@var-ui/icons/glyphs/': `${root}/packages/icons/src/glyph-data/`,
        '@var-ui/icons/glyphs': `${root}/packages/icons/src/glyphs.ts`,
        '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
        '@var-ui/astro': `${root}/packages/astro/index.ts`,
        '@var-ui/docs/schema': `${root}/packages/docs/schema.ts`,
        '@var-ui/docs/utils': `${root}/packages/docs/src/utils/index.ts`,
        '@var-ui/docs/highlight': `${root}/packages/docs/src/utils/highlightCodeBlock.ts`,
        '@var-ui/docs/styles': `${root}/packages/docs/src/styles/index.ts`,
        '@var-ui/docs/shiki': `${root}/packages/docs/src/utils/shiki-theme.ts`,
        '@var-ui/docs/middleware': `${root}/packages/docs/src/middleware.ts`,
        '@var-ui/docs/DocsGuidePage': `${root}/packages/docs/src/components/DocsGuidePage.astro`,
        '@var-ui/docs/DocsGuideArticle': `${root}/packages/docs/src/components/DocsGuideArticle.astro`,
        '@var-ui/docs/DocsPage': `${root}/packages/docs/src/components/DocsPage.astro`,
        '@var-ui/docs/DocsMarketingPage': `${root}/packages/docs/src/components/DocsMarketingPage.astro`,
        '@var-ui/docs/DocsSearch': `${root}/packages/docs/src/components/DocsSearch.astro`,
        '@var-ui/docs/DocsSidebar': `${root}/packages/docs/src/components/DocsSidebar.astro`,
        '@var-ui/docs/DocsToc': `${root}/packages/docs/src/components/DocsToc.astro`,
        '@var-ui/docs/DocsThemePicker': `${root}/packages/docs/src/components/DocsThemePicker.astro`,
        '@var-ui/docs/CodeBlock': `${root}/packages/docs/src/components/CodeBlock.astro`,
        '@var-ui/docs/CodeDemoCodeBlock': `${root}/packages/docs/src/components/CodeDemoCodeBlock.astro`,
        '@var-ui/docs/DocsThemeScript': `${root}/packages/docs/src/components/DocsThemeScript.astro`,
        '@var-ui/docs/theme-css': `${root}/packages/docs/src/integrations/theme-css-extract.ts`,
        '@var-ui/docs': `${root}/packages/docs/index.ts`,
        '@var-ui/docs-components/framework': `${root}/packages/docs-components/src/framework.ts`,
        '@var-ui/docs-components/FrameworkSwitcher': `${root}/packages/docs-components/src/components/FrameworkSwitcher.astro`,
        '@var-ui/docs-components/ComponentDocTabs': `${root}/packages/docs-components/src/components/ComponentDocTabs.astro`,
        '@var-ui/docs-components/HiddenPropsTable': `${root}/packages/docs-components/src/components/HiddenPropsTable.astro`,
        '@var-ui/docs-components/scripts/componentPageTabs': `${root}/packages/docs-components/src/scripts/componentPageTabs.ts`,
        '@var-ui/docs-components/scripts/frameworkSwitcher': `${root}/packages/docs-components/src/scripts/frameworkSwitcher.ts`,
        '@var-ui/docs-components': `${root}/packages/docs-components/index.ts`,
        '@': `${docsRoot}/src`,
      },
    },
  },
});
