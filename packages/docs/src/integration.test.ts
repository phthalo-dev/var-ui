// @vitest-environment node
import { describe, expect, it, vi } from 'vite-plus/test';
import type { VarDocsUserConfig } from './config';
import varDocs from './integration';

type Plugin = { name?: string };

/** Run the integration's `astro:config:setup` hook and return the Vite plugins it registers. */
function setupVitePlugins(typestyles: VarDocsUserConfig['typestyles']): Plugin[] {
  const integration = varDocs({
    title: 'Test',
    theme: { defaultClassName: 'theme-var-ui-default' },
    typestyles,
    disableGuideRoutes: true,
    disableMiddleware: true,
    markdownViews: false,
  });
  const updateConfig = vi.fn();
  const hook = integration.hooks['astro:config:setup'] as (args: unknown) => void;
  hook({
    config: {
      root: new URL('file:///tmp/var-docs-test/'),
      integrations: [{ name: '@var-ui/docs' }, { name: '@astrojs/mdx' }],
      output: 'static',
    },
    updateConfig,
    addMiddleware: vi.fn(),
    injectRoute: vi.fn(),
    logger: { info: vi.fn(), warn: vi.fn() },
  });
  const plugins = updateConfig.mock.calls[0]?.[0]?.vite?.plugins as (Plugin | Plugin[])[];
  return plugins.flat();
}

const typestylesPlugins = (plugins: Plugin[]) =>
  plugins.filter((plugin) => plugin.name?.startsWith('typestyles'));

describe('varDocs typestyles extractor', () => {
  it('registers its own @typestyles/vite extractor by default', () => {
    expect(typestylesPlugins(setupVitePlugins({ entry: 'typestyles-entry.ts' }))).not.toEqual([]);
  });

  it('registers no extractor with extract: false', () => {
    const plugins = setupVitePlugins({ entry: 'typestyles-entry.ts', extract: false });
    expect(typestylesPlugins(plugins)).toEqual([]);
    expect(plugins.map((plugin) => plugin.name)).toContain('vite-plugin-var-docs-virtual-modules');
  });
});
