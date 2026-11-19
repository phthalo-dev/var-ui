import { describe, expect, it } from 'vite-plus/test';
import { getRecipeDefaults } from './recipe-defaults';

describe('getRecipeDefaults (#193)', () => {
  it('reads the slug recipe defaults in the type quote style', () => {
    expect(getRecipeDefaults('button')).toMatchObject({
      size: '"md"',
      tone: '"neutral"',
      appearance: '"subtle"',
    });
  });

  it('follows recipe aliases (IconButton uses button, Text uses textBlock)', () => {
    expect(getRecipeDefaults('icon-button').size).toBe('"md"');
    expect(Object.keys(getRecipeDefaults('text')).length).toBeGreaterThan(0);
  });

  it('is empty for a slug without a recipe', () => {
    expect(getRecipeDefaults('no-such-component')).toEqual({});
  });
});
