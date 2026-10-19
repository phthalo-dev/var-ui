import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  getMenuController,
  initMenu,
  initMenus,
  MENU_ACTION_EVENT,
  type MenuActionDetail,
} from './menu';

function mountMenu(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div data-var-ui-menu-root>
      <button
        type="button"
        data-var-ui-menu-trigger
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="menu-1"
      >
        Actions
      </button>
      <div data-var-ui-menu-popover data-placement="bottom-start" hidden>
        <div role="menu" id="menu-1" aria-label="Actions">
          <div role="presentation">File</div>
          <button type="button" role="menuitem" data-var-ui-menu-item data-item-id="new" tabindex="-1">
            <span>New</span>
          </button>
          <button type="button" role="menuitem" data-var-ui-menu-item data-item-id="open" tabindex="-1">
            <span>Open</span>
          </button>
          <button
            type="button"
            role="menuitem"
            aria-disabled="true"
            data-var-ui-menu-item
            data-item-id="save"
            tabindex="-1"
          >
            <span>Save</span>
          </button>
          <div role="separator"></div>
          <a role="menuitem" href="#docs" data-var-ui-menu-item data-item-id="docs" tabindex="-1">
            <span>Docs</span>
          </a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-var-ui-menu-root]') as HTMLElement;
}

function mountRadioMenu(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div data-var-ui-menu-root data-selection-mode="single">
      <button
        type="button"
        data-var-ui-menu-trigger
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="menu-2"
      >
        Theme
      </button>
      <div data-var-ui-menu-popover data-placement="bottom-end" hidden>
        <div role="menu" id="menu-2" aria-label="Site theme">
          <button
            type="button"
            role="menuitemradio"
            aria-checked="false"
            data-var-ui-menu-item
            data-item-id="default"
            tabindex="-1"
          >
            <span>Default</span>
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked="true"
            data-var-ui-menu-item
            data-item-id="forest"
            tabindex="-1"
          >
            <span>Forest</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-var-ui-menu-root]') as HTMLElement;
}

function trigger(root: HTMLElement): HTMLElement {
  return root.querySelector('[data-var-ui-menu-trigger]') as HTMLElement;
}

function popover(root: HTMLElement): HTMLElement {
  return root.querySelector('[data-var-ui-menu-popover]') as HTMLElement;
}

function item(root: HTMLElement, id: string): HTMLElement {
  return root.querySelector(`[data-item-id="${id}"]`) as HTMLElement;
}

function keydown(target: Element, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function collectActions(root: HTMLElement): Array<string | null> {
  const ids: Array<string | null> = [];
  root.addEventListener(MENU_ACTION_EVENT, (event) => {
    ids.push((event as CustomEvent<MenuActionDetail>).detail.id);
  });
  return ids;
}

describe('initMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Deterministic presence frames: run both rAF callbacks synchronously.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  it('opens on trigger click and focuses the first item', () => {
    const root = mountMenu();
    initMenu(root);

    trigger(root).click();

    expect(popover(root).hidden).toBe(false);
    expect(trigger(root).getAttribute('aria-expanded')).toBe('true');
    expect(root.hasAttribute('data-open')).toBe(true);
    expect(popover(root).hasAttribute('data-open')).toBe(true);
    expect(popover(root).hasAttribute('data-starting-style')).toBe(false);
    expect(document.activeElement).toBe(item(root, 'new'));
  });

  it('closes on a second trigger click', () => {
    const root = mountMenu();
    initMenu(root);

    trigger(root).click();
    trigger(root).click();

    expect(popover(root).hidden).toBe(true);
    expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
    expect(root.hasAttribute('data-open')).toBe(false);
  });

  it('opens on ArrowDown focusing the first item and on ArrowUp the last', () => {
    const root = mountMenu();
    initMenu(root);

    keydown(trigger(root), 'ArrowDown');
    expect(popover(root).hidden).toBe(false);
    expect(document.activeElement).toBe(item(root, 'new'));

    keydown(root, 'Escape');

    keydown(trigger(root), 'ArrowUp');
    expect(popover(root).hidden).toBe(false);
    expect(document.activeElement).toBe(item(root, 'docs'));
  });

  it('moves focus with arrow keys, wrapping around', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    keydown(item(root, 'new'), 'ArrowUp');
    expect(document.activeElement).toBe(item(root, 'docs'));

    keydown(item(root, 'docs'), 'ArrowDown');
    expect(document.activeElement).toBe(item(root, 'new'));

    keydown(item(root, 'new'), 'ArrowDown');
    expect(document.activeElement).toBe(item(root, 'open'));
  });

  it('supports Home and End', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    keydown(item(root, 'new'), 'End');
    expect(document.activeElement).toBe(item(root, 'docs'));

    keydown(item(root, 'docs'), 'Home');
    expect(document.activeElement).toBe(item(root, 'new'));
  });

  it('marks the focused item with data-focused', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    expect(item(root, 'new').hasAttribute('data-focused')).toBe(true);

    keydown(item(root, 'new'), 'ArrowDown');
    expect(item(root, 'new').hasAttribute('data-focused')).toBe(false);
    expect(item(root, 'open').hasAttribute('data-focused')).toBe(true);
  });

  it('closes on Escape and returns focus to the trigger', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    keydown(item(root, 'new'), 'Escape');

    expect(popover(root).hidden).toBe(true);
    expect(document.activeElement).toBe(trigger(root));
  });

  it('closes on outside pointerdown but not on inside pointerdown', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    trigger(root).dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(popover(root).hidden).toBe(false);

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(popover(root).hidden).toBe(true);
  });

  it('closes on Tab without moving focus back to the trigger', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    keydown(item(root, 'new'), 'Tab');

    expect(popover(root).hidden).toBe(true);
    expect(document.activeElement).not.toBe(trigger(root));
  });

  it('dispatches a bubbling action event, closes, and refocuses the trigger', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'open').click();

    expect(actions).toEqual(['open']);
    expect(popover(root).hidden).toBe(true);
    expect(document.activeElement).toBe(trigger(root));
  });

  it('ignores activation of disabled items', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'save').click();

    expect(actions).toEqual([]);
    expect(popover(root).hidden).toBe(false);
  });

  it('still dispatches the action event for link items', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'docs').click();

    expect(actions).toEqual(['docs']);
    expect(popover(root).hidden).toBe(true);
  });

  it('activates link items with Space', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    keydown(item(root, 'docs'), ' ');

    expect(actions).toEqual(['docs']);
  });

  it('focuses matching items with typeahead', () => {
    vi.useFakeTimers();
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    // Keystrokes accumulate into a prefix buffer.
    keydown(item(root, 'new'), 'o');
    keydown(item(root, 'open'), 'p');
    expect(document.activeElement).toBe(item(root, 'open'));

    // The buffer resets after a pause, starting a fresh search.
    vi.advanceTimersByTime(600);
    keydown(item(root, 'open'), 'd');
    expect(document.activeElement).toBe(item(root, 'docs'));

    vi.useRealTimers();
  });

  it('moves focus on pointer hover', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    item(root, 'open').dispatchEvent(new Event('pointerenter'));

    expect(document.activeElement).toBe(item(root, 'open'));
  });

  it('is idempotent per root element', () => {
    const root = mountMenu();
    initMenu(root);
    initMenu(root);

    expect(root.hasAttribute('data-var-ui-menu-initialized')).toBe(true);

    // A single click still toggles exactly once.
    trigger(root).click();
    expect(popover(root).hidden).toBe(false);
  });

  it('exposes an imperative controller', () => {
    const root = mountMenu();
    initMenu(root);

    const controller = getMenuController(item(root, 'new'));
    expect(controller).not.toBeNull();
    expect(controller?.isOpen).toBe(false);

    controller?.open();
    expect(controller?.isOpen).toBe(true);
    expect(popover(root).hidden).toBe(false);

    controller?.toggle();
    expect(controller?.isOpen).toBe(false);
    expect(popover(root).hidden).toBe(true);
  });

  it('checks the activated radio item and unchecks the rest', () => {
    const root = mountRadioMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'default').click();

    expect(item(root, 'default').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('false');
    expect(actions).toEqual(['default']);
    expect(popover(root).hidden).toBe(true);
  });

  it('focuses the checked item when opening a single-selection menu', () => {
    const root = mountRadioMenu();
    initMenu(root);

    trigger(root).click();

    expect(document.activeElement).toBe(item(root, 'forest'));
  });

  it('moves aria-checked via controller.select()', () => {
    const root = mountRadioMenu();
    initMenu(root);

    const controller = getMenuController(item(root, 'default'));
    controller?.select('default');

    expect(item(root, 'default').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('false');
  });
});

describe('initMenus', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  it('initializes every menu under the given root', () => {
    const first = mountMenu();
    const second = mountMenu();

    initMenus();

    expect(first.hasAttribute('data-var-ui-menu-initialized')).toBe(true);
    expect(second.hasAttribute('data-var-ui-menu-initialized')).toBe(true);
  });
});
