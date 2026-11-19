// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';
import { getColorModeInitScript } from '../src/theme/colorModeScript';
import { varUiColorMode } from '../src/vite';

const run = (script: string) => new Function(script)();
const root = () => document.documentElement;

describe('getColorModeInitScript', () => {
  beforeEach(() => {
    localStorage.clear();
    root().removeAttribute('data-color-mode');
    root().className = '';
  });
  afterEach(() => localStorage.clear());

  it('applies a stored light/dark preference and the theme class', () => {
    localStorage.setItem('mode', 'dark');
    run(
      getColorModeInitScript({
        storageKey: 'mode',
        defaultColorMode: 'system',
        themeClassName: 'theme-x',
      }),
    );
    expect(root().getAttribute('data-color-mode')).toBe('dark');
    expect(root().classList.contains('theme-x')).toBe(true);
  });

  it('falls back to defaultColorMode for missing or invalid values', () => {
    localStorage.setItem('mode', 'purple');
    run(getColorModeInitScript({ storageKey: 'mode', defaultColorMode: 'light' }));
    expect(root().getAttribute('data-color-mode')).toBe('light');
  });

  it('removes the attribute for system so color-scheme follows the OS', () => {
    root().setAttribute('data-color-mode', 'dark');
    localStorage.setItem('mode', 'system');
    run(getColorModeInitScript({ storageKey: 'mode', defaultColorMode: 'dark' }));
    expect(root().hasAttribute('data-color-mode')).toBe(false);
  });

  it('escapes option values instead of interpolating them raw', () => {
    const script = getColorModeInitScript({
      storageKey: '"); alert(1); ("',
      defaultColorMode: 'system',
    });
    expect(() => run(script)).not.toThrow();
    expect(script).toContain(JSON.stringify('"); alert(1); ("'));
  });
});

describe('varUiColorMode (Vite plugin)', () => {
  it('injects the same script first in <head>', () => {
    const options = {
      storageKey: 'mode',
      defaultColorMode: 'system' as const,
      themeClassName: 'theme-x',
    };
    const plugin = varUiColorMode(options);
    expect(plugin.name).toBe('var-ui:color-mode');
    expect(plugin.transformIndexHtml.order).toBe('pre');
    expect(plugin.transformIndexHtml.handler()).toEqual([
      { tag: 'script', children: getColorModeInitScript(options), injectTo: 'head-prepend' },
    ]);
  });
});
