import { afterEach, describe, expect, it } from 'vite-plus/test';
import { initDocsSidebarState } from './docsSidebarState';

function mount(): void {
  document.body.innerHTML = `
    <details data-docs-sidebar-section="Action" data-current open></details>
    <details data-docs-sidebar-section="Layout"></details>`;
}

describe('initDocsSidebarState', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
  });

  it('restores stored open state but keeps the current group open', () => {
    window.localStorage.setItem(
      'var-docs-sidebar-open',
      JSON.stringify({ Action: false, Layout: true }),
    );
    mount();
    initDocsSidebarState();
    const [action, layout] = document.querySelectorAll('details');
    expect(action!.open).toBe(true);
    expect(layout!.open).toBe(true);
  });

  it('remembers a toggle', () => {
    mount();
    initDocsSidebarState();
    const layout = document.querySelectorAll('details')[1]!;
    layout.open = true;
    layout.dispatchEvent(new Event('toggle'));
    expect(JSON.parse(window.localStorage.getItem('var-docs-sidebar-open')!)).toEqual({
      Layout: true,
    });
  });
});
