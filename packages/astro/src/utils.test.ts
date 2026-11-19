import { describe, expect, it } from 'vite-plus/test';
import { mergeProps } from './utils';

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
