// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vite-plus/test';
import { initTopNavs } from './topNav';

describe('initTopNavs', () => {
  it('starts the sliding pill on each TopNav start zone, once', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    document.body.innerHTML = `
      <nav data-var-ui-top-nav>
        <div data-var-ui-top-nav-start>
          <a href="/a">A</a><a href="/b" data-selected>B</a>
        </div>
      </nav>`;
    const start = document.querySelector<HTMLElement>('[data-var-ui-top-nav-start]')!;
    const selected = start.querySelector<HTMLElement>('[data-selected]')!;
    Object.defineProperty(selected, 'offsetLeft', { value: 40, configurable: true });
    Object.defineProperty(selected, 'offsetWidth', { value: 60, configurable: true });
    initTopNavs();
    initTopNavs();
    expect(
      document
        .querySelector('[data-var-ui-top-nav]')!
        .hasAttribute('data-var-ui-top-nav-initialized'),
    ).toBe(true);
    expect(start.style.getPropertyValue('--var-ui-top-nav-indicatorx')).toBe('40px');
    expect(start.style.getPropertyValue('--var-ui-top-nav-indicatorwidth')).toBe('60px');
    expect(start.hasAttribute('data-indicator')).toBe(true);
    vi.unstubAllGlobals();
  });
});
