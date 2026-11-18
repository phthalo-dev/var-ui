import { describe, expect, it } from 'vite-plus/test';
import { designTokens, listDesignTokens } from '../src';

describe('listDesignTokens', () => {
  const tokens = listDesignTokens();

  it('lists every namespace with css variables matching the refs', () => {
    const namespaces = new Set(tokens.map((token) => token.path.split('.')[0]));
    for (const ns of [
      'space',
      'size',
      'radius',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'color',
      'zIndex',
    ]) {
      expect(namespaces.has(ns)).toBe(true);
    }
    const md = tokens.find((token) => token.path === 'space.md');
    expect(md).toMatchObject({ cssVar: '--var-ui-space-md', ref: designTokens.space.md.var });
    expect(typeof md?.value).toBe('string');
  });

  it('gives colours a light/dark value', () => {
    const primary = tokens.find((token) => token.path === 'color.text.primary');
    expect(primary?.ref).toBe(designTokens.color.text.primary.var);
    expect(primary?.value).toMatchObject({ light: expect.anything(), dark: expect.anything() });
  });

  it('has unique paths and css variables', () => {
    expect(new Set(tokens.map((t) => t.path)).size).toBe(tokens.length);
    expect(new Set(tokens.map((t) => t.cssVar)).size).toBe(tokens.length);
  });
});
