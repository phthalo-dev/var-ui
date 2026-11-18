import { describe, expect, it } from 'vite-plus/test';
import { colorValueLabel } from './colorLabel';

describe('colorValueLabel', () => {
  it('names Var UI token references by their token', () => {
    expect(colorValueLabel('var(--var-ui-color-palette-phthalo-7)')).toBe('phthalo-7');
    expect(colorValueLabel('var(--var-ui-color-background-surface)')).toBe('background-surface');
  });
  it('keeps other custom properties and plain colors', () => {
    expect(colorValueLabel('var(--brand, red)')).toBe('--brand');
    expect(colorValueLabel('#14110d')).toBe('#14110d');
    expect(colorValueLabel('oklch(0.5 0.1 170)')).toBe('oklch(0.5 0.1 170)');
  });
  it('labels both sides of a light / dark pair', () => {
    expect(colorValueLabel('var(--var-ui-color-palette-stone-7) / #fff')).toBe('stone-7 / #fff');
  });
});
