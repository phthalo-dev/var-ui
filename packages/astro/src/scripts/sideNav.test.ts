import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { initSideNav } from './sideNav';

function mountSideNav(attrs: Record<string, string> = {}): HTMLElement {
  const root = document.createElement('nav');
  root.dataset.varUiSideNav = '';
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'collapsible') {
      root.toggleAttribute('data-collapsible', true);
      return;
    }
    if (key === 'resizable') {
      root.toggleAttribute('data-resizable', true);
      return;
    }
    root.setAttribute(key, value);
  });
  root.innerHTML = `
    <button type="button" data-var-ui-side-nav-collapse aria-label="Collapse navigation"></button>
    <div data-var-ui-side-nav-resize></div>
  `;
  document.body.appendChild(root);
  return root;
}

describe('initSideNav', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
  });

  it('toggles data-collapsed via the collapse button', () => {
    const root = mountSideNav({ collapsible: '' });
    initSideNav(root);
    const button = root.querySelector('[data-var-ui-side-nav-collapse]') as HTMLButtonElement;

    expect(root.hasAttribute('data-collapsed')).toBe(false);
    button.click();
    expect(root.getAttribute('data-collapsed')).toBe('');
    button.click();
    expect(root.hasAttribute('data-collapsed')).toBe(false);
  });

  it('applies width when resizable', () => {
    const root = mountSideNav({
      resizable: '',
      'data-resizable-config': JSON.stringify({ defaultWidth: 300 }),
    });
    initSideNav(root);
    expect(root.style.width).toBe('300px');
  });

  it('hides the resize handle when collapsed', () => {
    const root = mountSideNav({ collapsible: '', resizable: '' });
    initSideNav(root);
    const button = root.querySelector('[data-var-ui-side-nav-collapse]') as HTMLButtonElement;
    const handle = root.querySelector('[data-var-ui-side-nav-resize]') as HTMLElement;

    button.click();
    expect(handle.getAttribute('data-collapsed')).toBe('');
  });

  it('narrows the nav width when collapsed', () => {
    const root = mountSideNav({
      collapsible: '',
      resizable: '',
      'data-resizable-config': JSON.stringify({ defaultWidth: 300 }),
    });
    initSideNav(root);
    const button = root.querySelector('[data-var-ui-side-nav-collapse]') as HTMLButtonElement;

    expect(root.style.width).toBe('300px');
    button.click();
    expect(root.style.width).toBe('56px');
    button.click();
    expect(root.style.width).toBe('300px');
  });

  it('preserves a custom resize handle aria-label from markup', () => {
    const root = mountSideNav({
      resizable: '',
      'data-resizable-config': JSON.stringify({ defaultWidth: 300 }),
    });
    const handle = root.querySelector('[data-var-ui-side-nav-resize]') as HTMLElement;
    handle.setAttribute('aria-label', 'Drag nav edge');

    initSideNav(root);

    expect(handle.getAttribute('aria-label')).toBe('Drag nav edge');
    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('tabindex')).toBe('0');
  });

  it('defaults the resize handle aria-label when markup omits one', () => {
    const root = mountSideNav({
      resizable: '',
      'data-resizable-config': JSON.stringify({ defaultWidth: 300 }),
    });
    initSideNav(root);
    const handle = root.querySelector('[data-var-ui-side-nav-resize]') as HTMLElement;

    expect(handle.getAttribute('aria-label')).toBe('Resize side navigation');
  });
});
