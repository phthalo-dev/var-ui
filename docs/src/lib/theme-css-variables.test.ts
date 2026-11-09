import { describe, expect, it } from 'vite-plus/test';
import {
  formatCssVarName,
  flattenTokenReferenceRows,
  getComponentCssVariables,
  getDesignTokenVariables,
} from './theme-css-variables';

describe('theme-css-variables', () => {
  it('formats css var names for display', () => {
    expect(formatCssVarName('var(--var-ui-space-md)')).toBe('--var-ui-space-md');
  });

  it('lists built-in design token variables', () => {
    const groups = getDesignTokenVariables();
    const space = groups.find((group) => group.namespace === 'space');
    expect(space?.entries.some((entry) => entry.tokenPath === 'space.md')).toBe(true);
    expect(space?.entries.find((entry) => entry.tokenPath === 'space.md')).toMatchObject({
      cssVar: '--var-ui-space-md',
    });

    const color = groups.find((group) => group.namespace === 'color');
    expect(color?.entries.some((entry) => entry.tokenPath === 'color.tone.accent.foreground')).toBe(
      true,
    );
    expect(color?.entries.some((entry) => entry.tokenPath === 'color.palette.neutral-7')).toBe(
      true,
    );
  });

  it('lists component-scoped css variables', () => {
    const groups = getComponentCssVariables();
    const button = groups.find((group) => group.namespace === 'button');
    expect(button?.entries.map((entry) => entry.cssVar)).toEqual(
      expect.arrayContaining([
        '--var-ui-button-background',
        '--var-ui-button-foreground',
        '--var-ui-button-border',
      ]),
    );
  });

  it('flattens design and component rows for interactive tables', () => {
    const rows = flattenTokenReferenceRows();
    expect(rows.some((row) => row.kind === 'design' && row.tokenPath === 'space.md')).toBe(true);
    expect(
      rows.some((row) => row.kind === 'component' && row.cssVar === '--var-ui-button-background'),
    ).toBe(true);
  });
});
