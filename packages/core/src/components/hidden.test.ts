import { describe, expect, it } from 'vite-plus/test';
import { breakpoint } from '../runtime';
import { hiddenClassName, hiddenStyle } from './hidden';

describe('hiddenStyle', () => {
  it('hides at every size when hide is true', () => {
    expect(hiddenStyle(true)).toEqual({ display: 'none' });
  });

  it('shows with display contents when hide is omitted, false, or empty', () => {
    expect(hiddenStyle()).toEqual({ display: 'contents' });
    expect(hiddenStyle(false)).toEqual({ display: 'contents' });
    expect(hiddenStyle({})).toEqual({ display: 'contents' });
  });

  it('hides from md up when hide is { md: true }', () => {
    expect(hiddenStyle({ md: true })).toEqual({
      display: 'contents',
      [breakpoint('md', 'min')]: { display: 'none' },
    });
  });

  it('shows from md up when hide is { base: true, md: false }', () => {
    expect(hiddenStyle({ base: true, md: false })).toEqual({
      display: 'none',
      [breakpoint('md', 'min')]: { display: 'contents' },
    });
  });
});

describe('hiddenClassName', () => {
  it('returns a class string for always-hidden and mapped hide', () => {
    expect(hiddenClassName({ hide: true })).toContain('hidden-always');
    expect(hiddenClassName({ hide: { md: true } })).toContain('hidden-md-true');
    expect(hiddenClassName({ hide: { base: true, md: false } })).toContain('hidden-base-true');
    expect(hiddenClassName({ hide: { base: true, md: false } })).toContain('hidden-md-false');
  });
});
