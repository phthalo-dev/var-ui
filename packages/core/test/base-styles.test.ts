import { describe, it, expect } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';

describe('base-styles', () => {
  it('registers color-scheme, reset, document defaults, and element typography', async () => {
    await import('../src/theme/base-styles');
    const css = getRegisteredCss();
    expect(css).toMatch(/color-scheme:\s*light\s+dark/);
    expect(css).toContain('[data-surface="dark"]');
    expect(css).toContain('[data-surface="light"]');
    expect(css).toContain('box-sizing: border-box');
    expect(css).toContain('scroll-behavior: smooth');
    expect(css).toContain('scroll-behavior: auto');
    expect(css).toMatch(/body\s*\{[^}]*margin:\s*0/);
    expect(css).toContain('var(--var-ui-fontFamily-mono)');
    expect(css).toContain('var(--var-ui-fontFamily-display)');
    expect(css).toContain('var(--var-ui-fontFamily-body)');
    expect(css).toContain('text-decoration: underline');
    expect(css).toMatch(/@layer\s+reset/);
    expect(css).toMatch(/@layer\s+base/);
  });
});
