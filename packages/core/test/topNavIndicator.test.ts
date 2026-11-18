// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { topNav } from '../src/components/topNav';
import {
  observeTopNavIndicator,
  topNavIndicatorCssVars,
} from '../src/components/indicators/top-nav';
import { findTextMatch } from '../src/shared/textMatch';

function zone(): { start: HTMLElement; items: HTMLElement[] } {
  const start = document.createElement('div');
  const items = [0, 1, 2].map((index) => {
    const item = document.createElement('a');
    Object.defineProperty(item, 'offsetParent', { value: start, configurable: true });
    Object.defineProperty(item, 'offsetLeft', { value: index * 100, configurable: true });
    Object.defineProperty(item, 'offsetWidth', { value: 80 + index, configurable: true });
    start.append(item);
    return item;
  });
  document.body.append(start);
  return { start, items };
}

describe('observeTopNavIndicator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('uses CSS var names that match the topNav recipe', () => {
    topNav();
    const css = getRegisteredCss();
    for (const name of Object.values(topNavIndicatorCssVars)) expect(css).toContain(name);
  });

  it('follows data-selected as it moves (any script toggling it), then marks itself ready', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    const { start, items } = zone();
    items[0]!.setAttribute('data-selected', '');
    const cleanup = observeTopNavIndicator(start);
    expect(start.style.getPropertyValue(topNavIndicatorCssVars.x)).toBe('0px');
    expect(start.style.getPropertyValue(topNavIndicatorCssVars.width)).toBe('80px');
    expect(start.hasAttribute('data-indicator')).toBe(true);
    expect(start.hasAttribute('data-indicator-ready')).toBe(true);

    items[0]!.removeAttribute('data-selected');
    items[2]!.setAttribute('data-selected', '');
    await Promise.resolve();
    expect(start.style.getPropertyValue(topNavIndicatorCssVars.x)).toBe('200px');
    expect(start.style.getPropertyValue(topNavIndicatorCssVars.width)).toBe('82px');

    items[2]!.removeAttribute('data-selected');
    await Promise.resolve();
    expect(start.style.getPropertyValue(topNavIndicatorCssVars.opacity)).toBe('0');
    expect(start.hasAttribute('data-indicator')).toBe(false);
    cleanup();
  });
});

describe('findTextMatch', () => {
  it('finds a case-insensitive match and maps offsets through length-changing lowercase', () => {
    expect(findTextMatch('Open Settings', 'sett')).toEqual([5, 9]);
    expect(findTextMatch('İstanbul', 'stan')).toEqual([1, 5]);
    expect(findTextMatch('Button', '  ')).toBeNull();
    expect(findTextMatch('Button', 'xyz')).toBeNull();
  });
});
