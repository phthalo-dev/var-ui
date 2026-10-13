import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme } from '../src/theme/create-theme';
import { when } from '../src/theme/conditions';
import { registerTestGlobals } from './lib/register-test-globals';
import { override } from '../src/runtime';
import { button, resolveButtonProps } from '../src/components/button';

const themeClass = (name: string) => `.theme-var-ui-${name}`;

describe('theme conditions and colorModes', () => {
  beforeEach(() => {
    reset();
    registerTestGlobals();
  });

  it('emits light-dark() for color mode values on override properties', () => {
    button(resolveButtonProps({ intent: 'primary', size: 'md' }));
    createDesignTheme({
      name: 'mode-values',
      components: {
        button: () => ({
          base: {
            color: { light: '#111111', dark: '#eeeeee' },
          },
        }),
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('mode-values')} .var-ui-button`);
    expect(css).toMatch(/color:\s*light-dark\(/);
  });

  it('emits conditional override rules for when.dark', () => {
    button(resolveButtonProps({ intent: 'primary', size: 'md' }));
    createDesignTheme({
      name: 'conditions',
      components: {
        button: () => ({
          base: {
            conditions: [when.dark({ letterSpacing: '0.06em' })],
          },
        }),
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('conditions')} [data-mode="dark"] .var-ui-button`);
    expect(css).toContain('letter-spacing: 0.06em');
    expect(css).toMatch(/prefers-color-scheme:\s*dark/);
  });

  it('emits global color-scheme rules for root and surfaces', () => {
    createDesignTheme({ name: 'scheme-fixture', tokens: {} });
    const css = getRegisteredCss();
    expect(css).toMatch(/color-scheme:\s*light\s+dark/);
    expect(css).toContain('[data-surface="dark"]');
    expect(css).toContain('[data-surface="light"]');
  });

  it('override accepts conditions and color mode values directly', () => {
    button(resolveButtonProps({ intent: 'secondary', size: 'sm' }));
    override(
      button,
      {
        base: {
          color: { light: '#111111', dark: '#eeeeee' },
          conditions: [when.reducedMotion({ transition: 'none' })],
        },
      },
      { layer: 'overrides' },
    );

    const css = getRegisteredCss();
    expect(css).toMatch(/color:\s*light-dark\(/);
    expect(css).toContain('transition: none');
  });
});
