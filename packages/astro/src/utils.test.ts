import { describe, expect, it } from 'vite-plus/test';
import { mergeProps, withStyle } from './utils';

describe('mergeProps', () => {
  it('merges a string recipe with className', () => {
    expect(mergeProps('btn', 'extra')).toEqual({ className: expect.stringContaining('btn') });
  });

  it('spreads attrs from a ComponentAttrsResult-like object', () => {
    const result = mergeProps(
      { className: 'root', attrs: { 'data-intent': 'primary' }, props: {} } as never,
      'x',
    );
    expect(result.className).toMatch(/root/);
    expect(result['data-intent']).toBe('primary');
  });
});

describe('withStyle', () => {
  it('returns the caller style when there is nothing to add', () => {
    expect(withStyle(undefined, 'color: red')).toBe('color: red');
    expect(withStyle({}, { color: 'red' })).toEqual({ color: 'red' });
  });

  it('puts own declarations first, so the caller wins, for strings and objects', () => {
    expect(withStyle({ '--x': '1px' }, 'color: red')).toBe('--x: 1px; color: red');
    expect(withStyle({ '--x': '1px' }, undefined)).toEqual({ '--x': '1px' });
    expect(withStyle({ '--x': '1px' }, { '--x': '2px', color: 'red' })).toEqual({
      '--x': '2px',
      color: 'red',
    });
  });
});
