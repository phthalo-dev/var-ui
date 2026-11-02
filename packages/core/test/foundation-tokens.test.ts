import { describe, expect, it } from 'vite-plus/test';
import { tokenValues } from '../src/tokens';
import { transitionOf } from '../src/internal/motion';

describe('motion tokens', () => {
  it('every transition token is built from duration vars, never a literal time', () => {
    for (const [name, value] of Object.entries(tokenValues.transition)) {
      expect(String(value), name).toMatch(/var\(--var-ui-duration-(fast|medium|slow)\)/);
      expect(String(value), name).not.toMatch(/\d(ms|s)\b/);
    }
  });

  it('offers the transitions the sweep needs', () => {
    expect(Object.keys(tokenValues.transition)).toEqual(
      expect.arrayContaining(['border', 'borderShadow', 'background', 'chrome', 'transform']),
    );
  });

  it('transitionOf composes duration and easing refs', () => {
    expect(transitionOf(['transform', 'width'], 'slow', 'emphasized')).toBe(
      'transform var(--var-ui-duration-slow) var(--var-ui-easing-emphasized), width var(--var-ui-duration-slow) var(--var-ui-easing-emphasized)',
    );
    expect(transitionOf('opacity')).toBe(
      'opacity var(--var-ui-duration-medium) var(--var-ui-easing-standard)',
    );
  });

  it('has only the three duration steps', () => {
    expect(Object.keys(tokenValues.duration)).toEqual(['fast', 'medium', 'slow']);
  });
});

describe('stacking and shadow scales', () => {
  it('zIndex has ordered in-flow tiers and no top-layer overlay tiers', () => {
    const z = tokenValues.zIndex;
    expect([z.base, z.raised, z.lifted, z.sticky, z.overlay, z.max]).toEqual([
      0, 1, 2, 10, 400, 9999,
    ]);
    expect(Object.keys(z)).toEqual(['base', 'raised', 'lifted', 'sticky', 'overlay', 'max']);
  });

  it('there is a single shadow scale', () => {
    expect(Object.keys(tokenValues.shadow)).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });
});
