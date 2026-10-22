import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { commandPalette } from '../src/components/commandPalette';

describe('atDarkMode in command palette', () => {
  it('emits dark-mode box-shadow override for dialog slot', () => {
    commandPalette();
    const css = getRegisteredCss();
    expect(css).toContain('[data-color-mode="dark"] .var-ui-command-palette__dialog');
    expect(css).toContain('.var-ui-command-palette__dialog[data-color-mode="dark"]');
    expect(css).toMatch(
      /prefers-color-scheme:\s*dark[\s\S]*:not\(\[data-color-mode="light"\]\):not\(\[data-color-mode="light"\] \*\)/,
    );
    expect(css).toContain('box-shadow: none');
  });
});
