import { describe, expect, it } from 'vite-plus/test';
import type { TokenRecord } from '../types';
import { catalogTokens, filterTokens, formatTokens } from './tokens';

const tokens: TokenRecord[] = [
  { path: 'space.md', cssVar: '--var-ui-space-md', value: '1rem' },
  { path: 'fontSize.md', cssVar: '--var-ui-fontSize-md', value: '0.875rem' },
  {
    path: 'color.text.primary',
    cssVar: '--var-ui-color-text-primary',
    value: { light: '#14110D', dark: '#F0EDE8' },
  },
  {
    path: 'color.border.default',
    cssVar: '--var-ui-color-border-default',
    value: { light: 'x', dark: 'x' },
  },
];

describe('filterTokens', () => {
  it('returns every token for an empty query', () => {
    expect(filterTokens(tokens)).toHaveLength(4);
  });

  it('matches paths and CSS variables, ignoring case and separators', () => {
    const paths = (query: string) => filterTokens(tokens, query).map((token) => token.path);
    expect(paths('space')).toEqual(['space.md']);
    expect(paths('text.primary')).toEqual(['color.text.primary']);
    // What people type from habit finds the real (camelCase) variable.
    expect(paths('font-size')).toEqual(['fontSize.md']);
    expect(paths('--var-ui-font-size-md')).toEqual(['fontSize.md']);
    expect(paths('FONTSIZE')).toEqual(['fontSize.md']);
  });
});

describe('formatTokens', () => {
  it('aligns path, variable and value columns', () => {
    const out = formatTokens(filterTokens(tokens, 'md'), false).split('\n');
    expect(out[0]).toBe('space.md     --var-ui-space-md     1rem');
    expect(out[1]).toBe('fontSize.md  --var-ui-fontSize-md  0.875rem');
  });

  it('shows light / dark only when they differ', () => {
    expect(formatTokens(filterTokens(tokens, 'text.primary'), false)).toContain(
      '#14110D / #F0EDE8 (light / dark)',
    );
    expect(formatTokens(filterTokens(tokens, 'border'), false).trim()).toMatch(/ x$/);
  });

  it('prints JSON', () => {
    expect(JSON.parse(formatTokens(tokens.slice(0, 1), true))).toEqual([tokens[0]]);
  });
});

describe('catalogTokens', () => {
  it('explains an old catalog without tokens', () => {
    expect(() => catalogTokens({ version: '0', components: [], guides: [] })).toThrow(
      /predates `var-ui tokens`/,
    );
  });
});
