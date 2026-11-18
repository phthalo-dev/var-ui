import { describe, expect, it } from 'vite-plus/test';
import { darkSyntaxValues, lightSyntaxValues, syntaxCodeTokens } from '../src/tokens';

describe('syntaxCodeTokens', () => {
  it('pairs every syntax key with its light and dark face', () => {
    const code = syntaxCodeTokens();
    expect(Object.keys(code)).toEqual(Object.keys(lightSyntaxValues));
    for (const key of Object.keys(lightSyntaxValues) as (keyof typeof lightSyntaxValues)[]) {
      expect(code[key]).toEqual({ light: lightSyntaxValues[key], dark: darkSyntaxValues[key] });
    }
  });

  it('takes custom faces', () => {
    const dark = { ...darkSyntaxValues, keyword: 'oklch(0.9 0.1 140)' };
    expect(syntaxCodeTokens(lightSyntaxValues, dark).keyword).toEqual({
      light: lightSyntaxValues.keyword,
      dark: 'oklch(0.9 0.1 140)',
    });
  });
});
