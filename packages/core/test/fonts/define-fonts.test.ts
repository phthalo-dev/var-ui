import { describe, it, expect } from 'vite-plus/test';
import { defineFonts } from '../../src/fonts/define-fonts';

describe('defineFonts', () => {
  it('builds font stacks and collects faces', () => {
    const result = defineFonts({
      body: {
        face: {
          family: 'Space Grotesk',
          src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
          fontWeight: '300 700',
        },
        fallback: 'ui-sans-serif, system-ui, sans-serif',
      },
      mono: {
        face: {
          family: 'JetBrains Mono',
          src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
        },
        fallback: 'ui-monospace, monospace',
      },
    });

    expect(result.fonts).toHaveLength(2);
    expect(result.tokens.fontFamily.body).toBe(
      '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    );
    expect(result.tokens.fontFamily.mono).toBe('"JetBrains Mono", ui-monospace, monospace');
  });

  it('omits undefined slots', () => {
    const result = defineFonts({
      body: {
        face: { family: 'Inter', src: "url('/fonts/inter.woff2') format('woff2')" },
        fallback: 'sans-serif',
      },
    });

    expect(result.tokens.fontFamily).toEqual({ body: '"Inter", sans-serif' });
    expect(result.tokens.fontFamily.mono).toBeUndefined();
  });

  it('accepts several faces per slot and registers shared faces once', () => {
    const upright = { family: 'Allo', src: "url('/a.woff2')", fontStyle: 'normal' };
    const italic = { family: 'Allo', src: "url('/a-i.woff2')", fontStyle: 'italic' };
    const result = defineFonts({
      body: { face: [upright, italic], fallback: 'sans-serif' },
      display: { face: [upright, italic], fallback: 'sans-serif' },
    });

    expect(result.fonts).toEqual([upright, italic]);
    expect(result.tokens.fontFamily).toEqual({
      body: '"Allo", sans-serif',
      display: '"Allo", sans-serif',
    });
  });

  it('puts a metric fallback face between the webfont and the generic stack', () => {
    const face = { family: 'Allo', src: "url('/a.woff2')" };
    const metricFallback = { family: 'Allo Fallback', src: "local('Arial')", sizeAdjust: '105%' };
    const result = defineFonts({ body: { face, metricFallback, fallback: 'sans-serif' } });

    expect(result.fonts).toEqual([face, metricFallback]);
    expect(result.tokens.fontFamily.body).toBe('"Allo", "Allo Fallback", sans-serif');
  });
});
