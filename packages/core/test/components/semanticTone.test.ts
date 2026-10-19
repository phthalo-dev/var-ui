import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { badge } from '../../src/components/badge';
import { button } from '../../src/components/button';
import { tonePaint } from '../../src/shared/semanticTone';

describe('semanticTone resolver', () => {
  it('registers outline appearance via controlAppearancePaint', () => {
    button({ tone: 'accent', appearance: 'outline' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button[data-tone="accent"]');
    expect(css).toContain('[data-appearance="outline"]');
    expect(css).toContain('transparent');
  });

  it('registers badge tone and appearance variants', () => {
    badge({ tone: 'accent', appearance: 'solid' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-badge[data-tone="accent"]');
    expect(css).toContain('[data-appearance="solid"]');
  });

  it('tonePaint returns filled hover mix for accent', () => {
    const paint = tonePaint(
      {
        border: { name: '--border' },
        background: { name: '--background' },
        foreground: { name: '--foreground' },
      },
      'accent',
      'filled',
    );
    expect(paint['--background']).toBeDefined();
    expect(paint['&:hover:not([disabled])']).toBeDefined();
  });
});
