import { describe, it, expect } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';

describe('base-styles', () => {
  it('registers color-scheme, reset, document defaults, and font roles', async () => {
    await import('../src/theme/base-styles');
    const css = getRegisteredCss();
    expect(css).toMatch(/color-scheme:\s*light\s+dark/);
    expect(css).toContain('[data-color-mode="dark"]');
    expect(css).toContain('[data-color-mode="light"]');
    expect(css).toContain('box-sizing: border-box');
    expect(css).toContain('scroll-behavior: smooth');
    expect(css).toContain('scroll-behavior: auto');
    expect(css).toMatch(/body\s*\{[^}]*margin:\s*0/);
    expect(css).toContain('var(--var-ui-fontFamily-mono)');
    expect(css).toContain('var(--var-ui-fontFamily-display)');
    expect(css).toContain('var(--var-ui-fontFamily-body)');
    expect(css).toContain('var(--var-ui-color-link-default)');
    expect(css).toMatch(/@layer\s+reset/);
    expect(css).toMatch(/@layer\s+base/);
  });

  it('sets no content formatting on bare elements (that is `prose`, var-ui#170)', async () => {
    await import('../src/theme/base-styles');
    const baseLayer = getRegisteredCss()
      .split(/(?=@layer )/)
      .filter((block) => block.startsWith('@layer base'))
      .join('\n');
    expect(baseLayer).toMatch(/\bbody\s*\{/);
    for (const selector of [
      'table',
      'th, td',
      'th',
      'blockquote',
      'hr',
      'ul, ol',
      'li',
      'p',
      'caption',
    ]) {
      expect(baseLayer).not.toMatch(
        new RegExp(`(^|[\\s}])${selector.replace(/[,]/g, '\\s*,\\s*')}\\s*\\{`, 'm'),
      );
    }
  });

  it('makes nested theme surfaces inherit the ancestor color-scheme', async () => {
    await import('../src/theme/base-styles');
    const css = getRegisteredCss();
    expect(css).toContain('html [class*="theme-var-ui-"]:not([data-color-mode])');
    expect(css).toContain(':root[class*="theme-var-ui-"]');
  });
});
