import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme } from '../src/theme/create-theme';
import { atReducedMotion } from '../src/theme/conditions';
import { defaultTheme, registerDefaultTheme } from '../src/theme/register-default';
import { typestyles } from '../src/runtime';
import { registerTestGlobals } from './lib/register-test-globals';

/** Body of the first `@media (prefers-reduced-motion: reduce)` block that targets `selector`. */
function reducedMotionRule(css: string, selector: string): string | undefined {
  const re = /@media \(prefers-reduced-motion: reduce\)\s*\{([^]*?\})\s*\}/g;
  for (const match of css.matchAll(re)) {
    if (match[1].includes(selector)) return match[1];
  }
  return undefined;
}

describe('reduced motion at the token level', () => {
  beforeEach(() => {
    reset();
    registerTestGlobals();
    registerDefaultTheme();
  });

  it('zeroes duration tokens on the default theme under prefers-reduced-motion', () => {
    const rule = reducedMotionRule(getRegisteredCss(), '.theme-var-ui-default');
    expect(rule).toBeDefined();
    for (const speed of ['fast', 'medium', 'slow']) {
      expect(rule).toMatch(new RegExp(`--var-ui-duration-${speed}:\\s*0ms`));
    }
  });

  it('does not touch easing or the transition tokens (they reference duration vars)', () => {
    const rule = reducedMotionRule(getRegisteredCss(), '.theme-var-ui-default') ?? '';
    expect(rule).not.toContain('--var-ui-easing');
    expect(rule).not.toContain('--var-ui-transition');
    const css = getRegisteredCss();
    expect(css).toMatch(/--var-ui-transition-controlSurface:[^;]*var\(--var-ui-duration-medium\)/);
  });

  it('applies to custom and forked themes without extra config', () => {
    createDesignTheme({ name: 'custom-rm', tokens: {} });
    defaultTheme.override({ name: 'forked-rm', tokens: {} });
    const css = getRegisteredCss();
    expect(reducedMotionRule(css, '.theme-var-ui-custom-rm')).toMatch(/duration-fast:\s*0ms/);
    expect(reducedMotionRule(css, '.theme-var-ui-forked-rm')).toMatch(/duration-slow:\s*0ms/);
  });

  it('lets a theme replace the mode by reusing its id', () => {
    createDesignTheme({
      name: 'own-rm',
      modes: [
        {
          id: 'reduced-motion',
          when: typestyles.tokens.when.media('(prefers-reduced-motion: reduce)'),
          overrides: { duration: { fast: '1ms', medium: '1ms', slow: '1ms' } },
        },
      ],
    });
    expect(reducedMotionRule(getRegisteredCss(), '.theme-var-ui-own-rm')).toMatch(
      /duration-fast:\s*1ms/,
    );
  });

  it('atReducedMotion still emits a media block for keyframe animations', () => {
    expect(atReducedMotion({ animation: 'none' })).toEqual({
      '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    });
  });
});
