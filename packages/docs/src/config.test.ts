import { describe, expect, it } from 'vite-plus/test';
import { parseVarDocsConfig, VarDocsUserConfigSchema } from './config';

describe('parseVarDocsConfig', () => {
  it('accepts a minimal valid config', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });

    expect(config.title).toBe('Var UI');
    expect(config.theme.defaultClassName).toBe('theme-var-ui-default');
    expect(config.typestyles.entry).toBe('typestyles-entry.ts');
    expect(config.disableMiddleware).toBe(false);
    expect(config.favicon).toBeUndefined();
  });

  it('accepts a favicon path', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      favicon: '/favicon.svg',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });

    expect(config.favicon).toBe('/favicon.svg');
  });

  it('defaults colorMode when omitted', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: {
        defaultClassName: 'theme-var-ui-default',
        colorMode: {},
      },
      typestyles: { entry: 'typestyles-entry.ts' },
    });

    expect(config.theme.colorMode?.default).toBe('system');
    expect(config.theme.colorMode?.storageKey).toBe('theme-mode');
  });

  it('defaults syntax to design-tokens', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });

    expect(config.theme.syntax).toBe('design-tokens');
    expect(config.theme.storageKey).toBe('docs-theme-id');
  });

  it('accepts theme presets', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: {
        defaultClassName: 'theme-var-ui-default',
        presets: [
          { id: 'default', label: 'Default', className: 'theme-var-ui-default' },
          { id: 'forest', label: 'Forest', className: 'theme-var-ui-forest', swatch: '#16a34a' },
        ],
      },
      typestyles: { entry: 'typestyles-entry.ts' },
    });
    expect(config.theme.presets).toHaveLength(2);
  });

  it('accepts free-form routes', () => {
    const config = parseVarDocsConfig({
      title: 'TypeStyles',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
      routes: {
        guides: { prefix: '/guides', collection: 'guides' },
      },
    });

    expect(config.routes).toEqual({
      guides: { prefix: '/guides', collection: 'guides' },
    });
  });

  it('rejects missing title', () => {
    const result = VarDocsUserConfigSchema.safeParse({
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty defaultClassName', () => {
    const result = VarDocsUserConfigSchema.safeParse({
      title: 'Var UI',
      theme: { defaultClassName: '' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });
    expect(result.success).toBe(false);
  });

  it('defaults markdownViews to true when omitted', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
    });
    expect(config.markdownViews).toBe(true);
  });

  it('parses markdownViews false', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
      markdownViews: false,
    });
    expect(config.markdownViews).toBe(false);
  });

  it('parses markdownViews object with extraPrefixes and tagline', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
      markdownViews: {
        extraPrefixes: ['/components'],
        tagline: 'Agent-readable Var UI docs',
      },
    });
    expect(config.markdownViews).toEqual({
      extraPrefixes: ['/components'],
      tagline: 'Agent-readable Var UI docs',
    });
  });
});
