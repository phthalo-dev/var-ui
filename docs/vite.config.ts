import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    ...react(),
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'astro:transitions/client') {
          return '\0astro-transitions-client-stub';
        }
        if (id === 'virtual:homepage-preloads') {
          return '\0virtual-homepage-preloads-stub';
        }
      },
      load(id) {
        if (id === '\0virtual-homepage-preloads-stub') {
          return 'export default [];';
        }
        if (id === '\0astro-transitions-client-stub') {
          return 'export const navigate = () => Promise.resolve();';
        }
        // Keep `?raw` imports intact for Astro Props/slots extraction in tests.
        if (id.includes('.astro') && !id.includes('?raw') && !id.includes('&raw')) {
          return 'export default function AstroStub() { return null; }';
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@var-ui/core/theme-constants': `${root}/packages/core/src/theme/constants.ts`,
      '@var-ui/core/styles': `${root}/packages/core/src/styles.ts`,
      '@var-ui/core/internal': `${root}/packages/core/src/internal.ts`,
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      '@var-ui/astro': `${root}/packages/astro/index.ts`,
      '@var-ui/docs/schema': `${root}/packages/docs/schema.ts`,
      '@var-ui/docs/utils': `${root}/packages/docs/src/utils/index.ts`,
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
      '@var-ui/docs': `${root}/packages/docs/index.ts`,
      '@var-ui/docs-components/framework': `${root}/packages/docs-components/src/framework.ts`,
      '@var-ui/docs-components/scripts/frameworkSwitcher': `${root}/packages/docs-components/src/scripts/frameworkSwitcher.ts`,
      '@var-ui/docs-components/scripts/componentPageTabs': `${root}/packages/docs-components/src/scripts/componentPageTabs.ts`,
      '@var-ui/docs-components': `${root}/packages/docs-components/index.ts`,
      '@': path.join(docsRoot, 'src'),
    },
  },
});
