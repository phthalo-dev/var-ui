import { describe, expect, it } from 'vite-plus/test';
import { mergeInlineStyle } from './mergeInlineStyle';

describe('mergeInlineStyle', () => {
  it('returns the caller style when there is nothing to add', () => {
    expect(mergeInlineStyle(undefined, 'color: red')).toBe('color: red');
    expect(mergeInlineStyle({}, { color: 'red' })).toEqual({ color: 'red' });
  });

  it('puts component declarations first, so the caller wins, for strings and objects', () => {
    expect(mergeInlineStyle({ '--x': '1px' }, 'color: red')).toBe('--x:1px;color: red');
    expect(mergeInlineStyle({ '--x': '1px' }, undefined)).toEqual({ '--x': '1px' });
    expect(mergeInlineStyle({ '--x': '1px' }, { '--x': '2px', color: 'red' })).toEqual({
      '--x': '2px',
      color: 'red',
    });
  });
});
