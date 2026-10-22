import { describe, expect, it, beforeEach } from 'vite-plus/test';
import {
  applyColorModeToDocument,
  applyThemeBoot,
  bootTheme,
  readStoredColorMode,
  resolveColorMode,
  watchThemeOnNavigation,
} from './colorMode';

describe('colorMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('reads valid stored modes only', () => {
    localStorage.setItem('theme-mode', 'dark');
    expect(readStoredColorMode('theme-mode')).toBe('dark');
    localStorage.setItem('theme-mode', 'nope');
    expect(readStoredColorMode('theme-mode')).toBeNull();
  });

  it('resolveColorMode maps system via matchMedia stub', () => {
    expect(resolveColorMode('light')).toBe('light');
    expect(resolveColorMode('dark')).toBe('dark');
  });

  it('applyColorModeToDocument sets or removes data-color-mode', () => {
    applyColorModeToDocument('dark');
    expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('');
    applyColorModeToDocument('system');
    expect(document.documentElement.hasAttribute('data-color-mode')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('');
  });

  it('watchThemeOnNavigation applies stored mode to incoming document on astro:before-swap', () => {
    localStorage.setItem('theme-mode', 'light');
    const newDocument = document.implementation.createHTMLDocument('next');
    watchThemeOnNavigation('theme-var-ui-default');
    document.dispatchEvent(Object.assign(new Event('astro:before-swap'), { newDocument }));
    expect(newDocument.documentElement.getAttribute('data-color-mode')).toBe('light');
    expect(newDocument.documentElement.classList.contains('theme-var-ui-default')).toBe(true);
  });

  it('watchThemeOnNavigation re-applies stored mode on astro:after-swap', () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.removeAttribute('data-color-mode');
    watchThemeOnNavigation('theme-var-ui-default');
    document.dispatchEvent(new Event('astro:after-swap'));
    expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
    expect(document.documentElement.classList.contains('theme-var-ui-default')).toBe(true);
  });

  it('applyThemeBoot can target a detached document', () => {
    localStorage.setItem('theme-mode', 'dark');
    const doc = document.implementation.createHTMLDocument('next');
    applyThemeBoot(doc, 'theme-var-ui-default');
    expect(doc.documentElement.getAttribute('data-color-mode')).toBe('dark');
  });

  it('bootTheme restores system mode without data-color-mode', () => {
    localStorage.setItem('theme-mode', 'system');
    bootTheme('theme-var-ui-default');
    expect(document.documentElement.hasAttribute('data-color-mode')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('');
  });
});
