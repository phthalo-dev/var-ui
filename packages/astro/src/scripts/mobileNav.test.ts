import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';
import {
  getMobileNavProvider,
  initMobileNav,
  initMobileNavProvider,
  initMobileNavToggle,
} from './mobileNav';

function mountProvider(): HTMLElement {
  const root = document.createElement('div');
  root.dataset.varUiMobileNavProvider = '';
  root.innerHTML = `
    <button type="button" data-var-ui-mobile-nav-toggle aria-label="Open navigation"></button>
    <div data-var-ui-mobile-nav>
      <dialog data-var-ui-mobile-nav-popup aria-label="Navigation">
        <button type="button" data-var-ui-mobile-nav-close aria-label="Close navigation"></button>
        <a href="/docs">Docs</a>
      </dialog>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

describe('mobileNav', () => {
  // jsdom has no top layer: stub showModal/close with their observable effects.
  beforeEach(() => {
    document.body.innerHTML = '';
    Object.assign(HTMLDialogElement.prototype, {
      showModal(this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
      close(this: HTMLDialogElement) {
        if (!this.open) return;
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      },
    });
  });
  afterEach(() => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  });

  it('shares open state between toggle and drawer via the provider', () => {
    const root = mountProvider();
    initMobileNavProvider(root);
    initMobileNav(root.querySelector('[data-var-ui-mobile-nav]') as HTMLElement);
    initMobileNavToggle(root.querySelector('[data-var-ui-mobile-nav-toggle]') as HTMLElement);

    const provider = getMobileNavProvider(root);
    const popup = root.querySelector('[data-var-ui-mobile-nav-popup]') as HTMLDialogElement;
    const toggle = root.querySelector('[data-var-ui-mobile-nav-toggle]') as HTMLElement;

    expect(provider?.isOpen).toBe(false);
    provider?.open();
    expect(popup.open).toBe(true);
    expect(popup.hasAttribute('data-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    provider?.close();
    expect(popup.open).toBe(false);
    expect(popup.hasAttribute('data-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when the backdrop (the dialog itself) is clicked', () => {
    const root = mountProvider();
    initMobileNavProvider(root);
    initMobileNav(root.querySelector('[data-var-ui-mobile-nav]') as HTMLElement);

    const provider = getMobileNavProvider(root);
    const popup = root.querySelector('[data-var-ui-mobile-nav-popup]') as HTMLDialogElement;

    provider?.open();
    popup.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(provider?.isOpen).toBe(false);
  });

  it('stays in sync when the dialog closes natively (Escape)', () => {
    const root = mountProvider();
    initMobileNavProvider(root);
    initMobileNav(root.querySelector('[data-var-ui-mobile-nav]') as HTMLElement);
    const provider = getMobileNavProvider(root);
    const popup = root.querySelector('[data-var-ui-mobile-nav-popup]') as HTMLDialogElement;
    provider?.open();
    // What the browser does on Escape: close the dialog and fire `close`.
    popup.removeAttribute('open');
    popup.dispatchEvent(new Event('close'));
    expect(provider?.isOpen).toBe(false);
    expect(
      (root.querySelector('[data-var-ui-mobile-nav-toggle]') as HTMLElement).getAttribute(
        'aria-expanded',
      ),
    ).toBe('false');
  });
});
