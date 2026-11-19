import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { applyColorModeToDocument, readStoredColorMode, resolveColorMode } from './colorMode';

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
});
