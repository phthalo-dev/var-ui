import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { badge } from '../../src/components/badge';
import { button } from '../../src/components/button';

describe('button', () => {
  it('registers tone and appearance variants including danger', () => {
    button({ tone: 'accent', appearance: 'filled' });
    button({ tone: 'danger', appearance: 'filled' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button[data-tone="accent"]');
    expect(css).toContain('.var-ui-button[data-tone="danger"]');
    expect(css).toContain('[data-appearance="filled"]');
    expect(css).toContain('var(--var-ui-color-tone-danger-background)');
  });

  it('registers outline appearance', () => {
    button({ tone: 'accent', appearance: 'outline' });
    const css = getRegisteredCss();
    expect(css).toContain('[data-appearance="outline"]');
  });

  it('applies elevation shadow when elevated is true', () => {
    button({ elevated: true });
    const css = getRegisteredCss();
    expect(css).toContain('[data-elevated]');
    expect(css).toContain('var(--var-ui-shadow-md)');
  });
});

describe('badge appearance', () => {
  it('registers tone and appearance variants', () => {
    badge({ tone: 'accent', appearance: 'solid' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-badge[data-tone="accent"]');
    expect(css).toContain('[data-appearance="solid"]');
  });
});
