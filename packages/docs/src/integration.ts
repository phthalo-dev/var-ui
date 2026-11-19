import mdx from '@astrojs/mdx';
import type { AstroIntegration } from 'astro';
import { AstroError } from 'astro/errors';
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import { parseVarDocsConfig, type VarDocsConfig, type VarDocsUserConfig } from './config';
import { buildDocsThemeStyles, docsThemeStylesDevPlugin } from './integrations/theme-css-extract';
import { vitePluginVarDocsTypestyles } from './integrations/typestyles';
import { vitePluginVarDocsPackageExports } from './integrations/vite-package-exports';
import { vitePluginVarDocsVirtualModules } from './integrations/vite-virtual-modules';
import { designTokenShikiTheme } from './utils/shiki-theme';
import { codeBlockMarkup } from '@var-ui/core';
import { codeBlockShikiTransformer } from './utils/shiki-code-block';
import { followCodeBlockMarkup } from './integrations/code-block-markup-dev';
import {
  assertSingleStaticGuidePrefix,
  guideInjectPatterns,
  prerenderGuideRoutes,
  resolveGuideRouteConfig,
} from './utils/routing';
import { getLazyThemePresets } from './utils/theme/presets';
import { resolveMarkdownViews } from './utils/markdown-href';
import { writeMarkdownViews } from './utils/write-markdown-views';

function resolveShikiTheme(syntax: VarDocsConfig['theme']['syntax']) {
  if (syntax == null || syntax === 'design-tokens') {
    return designTokenShikiTheme;
  }
  return syntax;
}

function emitMarkdownViews(
  root: string,
  config: VarDocsConfig,
  logger: { info: (message: string) => void },
): void {
  const views = resolveMarkdownViews(config.markdownViews);
  if (!views.enabled) {
    return;
  }
  const routes = Object.fromEntries(
    resolveGuideRouteConfig(config.routes).map((route) => [route.collection, route]),
  );
  writeMarkdownViews({
    root,
    title: config.title,
    routes,
    markdownViews: views,
  });
  logger.info('Wrote markdown views → public/llms.txt');
}

/**
 * Astro integration for the Var UI docs kit.
 *
 * Provides guide routing, typestyles wiring, theme-driven syntax highlighting,
 * and optional showcase preset lazy CSS. Design-system catalog features live in
 * `@var-ui/docs-components`.
 */
export default function varDocs(userOpts: VarDocsUserConfig): AstroIntegration {
  // The Shiki transformer runs in the config context, where `@var-ui/core` is its built `dist`.
  // In dev it switches to a copy loaded through Vite that follows source edits (#195).
  const markupImpl = { current: codeBlockMarkup };
  if (typeof userOpts !== 'object' || userOpts === null || Array.isArray(userOpts)) {
    throw new AstroError(
      'Invalid config passed to varDocs integration',
      'The Var Docs integration expects a configuration object with at least `title`, `theme`, and `typestyles` properties.',
    );
  }

  let config: VarDocsConfig;
  try {
    config = parseVarDocsConfig(userOpts);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new AstroError('Invalid config passed to varDocs integration', message);
  }

  return {
    name: '@var-ui/docs',
    hooks: {
      'astro:config:setup': ({
        config: astroConfig,
        updateConfig,
        addMiddleware,
        injectRoute,
        logger,
      }) => {
        if (!config.disableMiddleware) {
          addMiddleware({
            entrypoint: '@var-ui/docs/middleware',
            order: 'pre',
          });
        }

        if (!config.disableGuideRoutes) {
          if (!config.components?.Layout) {
            throw new AstroError(
              'varDocs guide routes require `components.Layout`',
              'Pass `components: { Layout: "./src/layouts/BaseLayout.astro" }` (path relative to the Astro project root).',
            );
          }

          const guideRoutes = resolveGuideRouteConfig(config.routes);
          const prerender = prerenderGuideRoutes(astroConfig.output);
          if (prerender) {
            assertSingleStaticGuidePrefix(guideRoutes);
          }
          for (const route of guideRoutes) {
            for (const pattern of guideInjectPatterns(route.prefix)) {
              injectRoute({
                pattern,
                entrypoint: '@var-ui/docs/routes/guide.astro',
                prerender,
              });
            }
          }
          logger.info(`Injected guide routes: ${guideRoutes.map((r) => r.prefix).join(', ')}`);
        }

        if (!astroConfig.integrations.find(({ name }) => name === '@astrojs/mdx')) {
          const selfIndex = astroConfig.integrations.findIndex((i) => i.name === '@var-ui/docs');
          astroConfig.integrations.splice(
            selfIndex + 1,
            0,
            mdx({ rehypePlugins: [rehypeSlug], optimize: true }),
          );
          logger.info('Added @astrojs/mdx with rehype-slug');
        }

        const shikiTheme = resolveShikiTheme(config.theme.syntax);
        const root = fileURLToPath(astroConfig.root);
        const docsPkgRoot = fileURLToPath(new URL('..', import.meta.url));
        emitMarkdownViews(root, config, logger);
        const lazyPresets = getLazyThemePresets(config.theme.presets);
        const vitePlugins = [
          vitePluginVarDocsPackageExports(docsPkgRoot),
          vitePluginVarDocsVirtualModules(config, { root: astroConfig.root }),
          vitePluginVarDocsTypestyles(config.typestyles.entry),
        ];

        if (lazyPresets.length > 0) {
          vitePlugins.push(
            docsThemeStylesDevPlugin({
              root,
              presets: config.theme.presets ?? [],
              typestylesEntry: config.typestyles.entry,
            }),
          );
          logger.info(`Theme lazy CSS (dev): ${lazyPresets.map((preset) => preset.id).join(', ')}`);
        }

        updateConfig({
          markdown: {
            shikiConfig: {
              theme: shikiTheme,
              transformers: [codeBlockShikiTransformer({ markup: () => markupImpl.current })],
            },
          },
          vite: {
            plugins: vitePlugins,
            ssr: {
              noExternal: ['@var-ui/docs', '@var-ui/astro', '@var-ui/core'],
            },
          },
        } as Parameters<typeof updateConfig>[0]);
      },
      'astro:server:setup': async ({ server, logger }) => {
        await followCodeBlockMarkup(server as never, markupImpl, logger);
      },
      'astro:build:start': async ({ logger }) => {
        // Prefer project cwd (Astro runs build from the site root).
        const root = process.cwd();
        emitMarkdownViews(root, config, logger);
        const lazyPresets = getLazyThemePresets(config.theme.presets);
        if (lazyPresets.length === 0) return;
        logger.info(`Extracting lazy theme CSS → public/themes/`);
        await buildDocsThemeStyles({
          root,
          presets: config.theme.presets ?? [],
          typestylesEntry: config.typestyles.entry,
        });
      },
    },
  };
}
