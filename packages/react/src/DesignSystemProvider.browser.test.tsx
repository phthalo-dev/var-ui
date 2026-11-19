import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../core/src/theme/base-styles';
import '../../core/src/theme/register-default';
import { DesignSystemProvider } from './DesignSystemProvider';

describe('DesignSystemProvider (real browser)', () => {
  test('a scoped theme surface gives its content readable text', () => {
    // Without `applyToDocument` the tokens live only on the provider's element, so `body` cannot
    // resolve them; the surface must restate the text defaults itself.
    render(
      <DesignSystemProvider>
        <p data-testid="text">Hello</p>
      </DesignSystemProvider>,
    );
    const cs = getComputedStyle(document.querySelector('[data-testid="text"]')!);
    expect(parseFloat(cs.fontSize)).toBeGreaterThan(10);
    expect(parseFloat(cs.lineHeight)).toBeGreaterThan(parseFloat(cs.fontSize));
    expect(cs.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(cs.fontFamily).not.toBe('none');
  });
});
