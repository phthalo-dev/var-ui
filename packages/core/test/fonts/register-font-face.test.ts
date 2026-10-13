import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { registerTestGlobals } from '../lib/register-test-globals';
import { registerFontFace, resetRegisteredFontFaces } from '../../src/fonts/register-font-face';

describe('registerFontFace', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    registerTestGlobals();
  });

  it('registers @font-face in extracted CSS', () => {
    registerFontFace({
      family: 'Space Grotesk',
      src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      fontWeight: '300 700',
      fontDisplay: 'swap',
    });

    const css = getRegisteredCss();
    expect(css).toContain('@font-face');
    expect(css).toContain('font-family: "Space Grotesk"');
    expect(css).toContain("url('/fonts/space-grotesk-latin.woff2')");
  });

  it('dedupes identical definitions', () => {
    const face = {
      family: 'JetBrains Mono',
      src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
    };

    registerFontFace(face);
    registerFontFace(face);

    const css = getRegisteredCss();
    const matches = css.match(/font-family: "JetBrains Mono"/g) ?? [];
    expect(matches).toHaveLength(1);
  });
});
