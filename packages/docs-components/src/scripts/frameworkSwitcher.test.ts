import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  frameworkCookieWriteValue,
  initFrameworkSwitcher,
  selectFramework,
} from './frameworkSwitcher';
import { FRAMEWORK_COOKIE } from '../framework';

vi.mock('astro:transitions/client', () => ({ navigate: vi.fn() }));

class ResizeObserverMock {
  observe(): void {}
  disconnect(): void {}
}

/** Mirrors the `SegmentedControl` markup `FrameworkSwitcher.astro` renders. */
function switcher(selected: string, name = 'fw'): string {
  return `
    <div role="radiogroup" data-var-ui-segmented-control data-framework-switcher>
      ${['react', 'astro', 'html']
        .map(
          (id) =>
            `<label data-segment-id="${id}"${id === selected ? ' data-selected' : ''}><input type="radio" name="${name}" value="${id}"${id === selected ? ' checked' : ''}>${id}</label>`,
        )
        .join('')}
    </div>
  `;
}

function changeTo(root: Element, id: string): void {
  root.dispatchEvent(
    new CustomEvent('var-ui:segmented-control-change', { bubbles: true, detail: { id } }),
  );
}

describe('frameworkCookieWriteValue', () => {
  it('builds a cookie assignment for the chosen framework', () => {
    expect(frameworkCookieWriteValue('html')).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(frameworkCookieWriteValue('html')).toMatch(/Path=\//);
    expect(frameworkCookieWriteValue('html')).toMatch(/Max-Age=/);
  });
});

describe('selectFramework', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    document.documentElement.dataset.framework = 'react';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('updates the cookie, <html data-framework> and every switcher on the page', () => {
    document.body.innerHTML = switcher('react', 'a') + switcher('react', 'b');

    selectFramework('html');

    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(document.documentElement.dataset.framework).toBe('html');
    for (const root of document.querySelectorAll('[data-framework-switcher]')) {
      expect(root.querySelector('[data-segment-id="html"]')?.hasAttribute('data-selected')).toBe(
        true,
      );
      expect(root.querySelector<HTMLInputElement>('input[value="html"]')?.checked).toBe(true);
      expect(root.querySelector('[data-segment-id="react"]')?.hasAttribute('data-selected')).toBe(
        false,
      );
    }
  });

  it('is a no-op when the framework is already selected', () => {
    document.body.innerHTML = switcher('react');
    const cookieBefore = document.cookie;

    selectFramework('react');

    expect(document.cookie).toBe(cookieBefore);
  });
});

describe('initFrameworkSwitcher', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    document.documentElement.dataset.framework = 'react';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('switches framework on the segmented control change event', () => {
    document.body.innerHTML = switcher('react');

    initFrameworkSwitcher();

    const root = document.querySelector('[data-framework-switcher]')!;
    expect(root.hasAttribute('data-framework-switcher-initialized')).toBe(true);

    changeTo(root, 'astro');

    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=astro`);
    expect(document.documentElement.dataset.framework).toBe('astro');
  });

  it('reflects <html data-framework> into a switcher rendered for another framework', () => {
    document.documentElement.dataset.framework = 'html';
    document.body.innerHTML = switcher('react');

    initFrameworkSwitcher();

    const root = document.querySelector('[data-framework-switcher]')!;
    expect(root.querySelector<HTMLInputElement>('input[value="html"]')?.checked).toBe(true);
  });

  it('does not double-bind the same root', () => {
    document.body.innerHTML = switcher('react');
    initFrameworkSwitcher();
    initFrameworkSwitcher();
    const root = document.querySelector('[data-framework-switcher]')!;
    const cookie = vi.spyOn(document, 'cookie', 'set');

    changeTo(root, 'html');

    expect(cookie).toHaveBeenCalledTimes(1);
  });
});
