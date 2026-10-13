import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { commandPalette } from '../src/components/commandPalette';

describe('atDarkMode in command palette', () => {
  it('emits dark-mode box-shadow override for dialog slot', () => {
    commandPalette();
    const css = getRegisteredCss();
    expect(css).toContain('[data-mode="dark"] .var-ui-command-palette__dialog');
    expect(css).toMatch(
      /prefers-color-scheme:\s*dark[\s\S]*:root:not\(\[data-mode="light"\]\) \.var-ui-command-palette__dialog/,
    );
    expect(css).toContain('box-shadow: none');
  });
});
