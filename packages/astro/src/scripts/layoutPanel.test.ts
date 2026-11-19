import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  initLayoutPanel,
  initLayoutPanels,
  LAYOUT_PANEL_OPEN_CHANGE_EVENT,
  setLayoutPanelOpen,
} from './layoutPanel';

let narrow = true;
const listeners = new Set<() => void>();
function setNarrow(next: boolean) {
  narrow = next;
  listeners.forEach((listener) => listener());
}

function mount(mode: 'overlay' | 'hidden'): { panel: HTMLElement; toggle: HTMLElement } {
  document.body.innerHTML = `
    <button type="button" data-var-ui-layout-panel-toggle aria-controls="nav">Menu</button>
    <div class="layout">
      <div id="nav" data-var-ui-layout-panel data-responsive="${mode}" data-responsive-below="md">Links</div>
      ${mode === 'overlay' ? '<dialog data-layout-panel-popup><div class="body"></div></dialog>' : ''}
    </div>`;
  return {
    panel: document.getElementById('nav')!,
    toggle: document.querySelector('[data-var-ui-layout-panel-toggle]')!,
  };
}

describe('LayoutPanel responsive (Astro, #190)', () => {
  beforeEach(() => {
    narrow = true;
    listeners.clear();
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return narrow;
      },
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }));
    // jsdom has no top layer: stub showModal/close with their observable effects.
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
    vi.unstubAllGlobals();
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  });

  it('overlay: opening moves the panel into the modal drawer; closing puts it back', () => {
    const { panel, toggle } = mount('overlay');
    const home = panel.parentElement!;
    const dialog = document.querySelector('dialog')!;
    initLayoutPanels();
    const onChange = vi.fn();
    panel.addEventListener(LAYOUT_PANEL_OPEN_CHANGE_EVENT, onChange);

    toggle.click();
    expect(dialog.open).toBe(true);
    expect(panel.parentElement).toBe(dialog.querySelector('.body'));
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(onChange).toHaveBeenCalledTimes(1);

    // Escape / backdrop: the dialog closes itself.
    dialog.close();
    expect(panel.parentElement).toBe(home);
    expect(panel.hasAttribute('data-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('overlay: widening past the breakpoint returns the panel inline and closes the drawer', () => {
    const { panel } = mount('overlay');
    const home = panel.parentElement!;
    initLayoutPanel(panel);
    setLayoutPanelOpen(panel, true);
    setNarrow(false);
    expect(document.querySelector('dialog')!.open).toBe(false);
    expect(panel.parentElement).toBe(home);
  });

  it('hidden: toggles data-open in place, no dialog', () => {
    const { panel, toggle } = mount('hidden');
    initLayoutPanels();
    toggle.click();
    expect(panel.hasAttribute('data-open')).toBe(true);
    toggle.click();
    expect(panel.hasAttribute('data-open')).toBe(false);
  });
});
