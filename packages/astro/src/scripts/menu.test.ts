import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  getMenuController,
  initMenu,
  initMenus,
  MENU_ACTION_EVENT,
  type MenuActionDetail,
} from './menu';

/**
 * jsdom has no popover API. Stub the observable parts: `showPopover` / `hidePopover` /
 * `togglePopover` (with `beforetoggle` and `toggle` events and an open flag), the invoker click
 * (`popovertarget` buttons toggle their target) and native Escape light dismiss is NOT stubbed
 * (the script handles Escape itself). Real focus/anchor/animation behaviour is covered in the
 * React browser tests and the shared recipe CSS tests.
 */
function stubPopover(): void {
  const open = new WeakSet<Element>();
  const fire = (el: HTMLElement, state: 'open' | 'closed') => {
    el.dispatchEvent(Object.assign(new Event('beforetoggle'), { newState: state }));
    if (state === 'open') open.add(el);
    else open.delete(el);
    el.dispatchEvent(Object.assign(new Event('toggle'), { newState: state }));
  };
  Object.assign(HTMLElement.prototype, {
    showPopover(this: HTMLElement) {
      if (!open.has(this)) fire(this, 'open');
    },
    hidePopover(this: HTMLElement) {
      if (open.has(this)) fire(this, 'closed');
    },
    togglePopover(this: HTMLElement) {
      if (open.has(this)) fire(this, 'closed');
      else fire(this, 'open');
    },
  });
  document.addEventListener('click', (event) => {
    const invoker = (event.target as Element | null)?.closest('[popovertarget]');
    if (!invoker) return;
    const target = document.getElementById(invoker.getAttribute('popovertarget')!);
    target?.togglePopover();
  });
  const original = Element.prototype.matches;
  Object.assign(Element.prototype, {
    matches(this: Element, selector: string) {
      if (selector === ':popover-open') return open.has(this);
      return Reflect.apply(original, this, [selector]);
    },
  });
}

stubPopover();

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
        popovertarget="menu-1-popover"
      >
        Actions
      </button>
      <div data-var-ui-menu-popover data-placement="bottom start" id="menu-1-popover" popover="auto">
        <div role="menu" id="menu-1" aria-label="Actions">
          <div role="presentation">File</div>
          <button type="button" role="menuitem" data-var-ui-menu-item data-var-ui-item-id="new" tabindex="-1">
            <span>New</span>
          </button>
          <button type="button" role="menuitem" data-var-ui-menu-item data-var-ui-item-id="open" tabindex="-1">
            <span>Open</span>
          </button>
          <button
            type="button"
            role="menuitem"
            aria-disabled="true"
            data-var-ui-menu-item
            data-var-ui-item-id="save"
            tabindex="-1"
          >
            <span>Save</span>
          </button>
          <div role="separator"></div>
          <a role="menuitem" href="#docs" data-var-ui-menu-item data-var-ui-item-id="docs" tabindex="-1">
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
    <div data-var-ui-menu-root data-var-ui-selection-mode="single">
      <button
        type="button"
        data-var-ui-menu-trigger
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="menu-2"
        popovertarget="menu-2-popover"
      >
        Theme
      </button>
      <div data-var-ui-menu-popover data-placement="bottom end" id="menu-2-popover" popover="auto">
        <div role="menu" id="menu-2" aria-label="Site theme">
          <button
            type="button"
            role="menuitemradio"
            aria-checked="false"
            data-var-ui-menu-item
            data-var-ui-item-id="default"
            tabindex="-1"
          >
            <span>Default</span>
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked="true"
            data-var-ui-menu-item
            data-var-ui-item-id="forest"
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

/** Two independent radio groups in one menu (sections with their own `defaultValue`). */
function mountGroupedRadioMenu(): HTMLElement {
  const radio = (id: string, checked: boolean) => `
    <button type="button" role="menuitemradio" aria-checked="${checked}" data-var-ui-menu-item
      data-var-ui-item-id="${id}" tabindex="-1"><span>${id}</span></button>`;
  const host = document.createElement('div');
  host.innerHTML = `
    <div data-var-ui-menu-root data-var-ui-selection-mode="none">
      <button type="button" data-var-ui-menu-trigger aria-haspopup="menu" aria-expanded="false"
        aria-controls="menu-3" popovertarget="menu-3-popover">Appearance</button>
      <div data-var-ui-menu-popover data-placement="bottom end" id="menu-3-popover" popover="auto">
        <div role="menu" id="menu-3" aria-label="Appearance">
          <div role="group" aria-label="Mode" data-var-ui-menu-group>
            ${radio('light', false)}${radio('dark', true)}
          </div>
          <div role="separator"></div>
          <div role="group" aria-label="Theme" data-var-ui-menu-group>
            ${radio('teal', true)}${radio('rose', false)}
          </div>
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

function isOpen(root: HTMLElement): boolean {
  return popover(root).matches(':popover-open');
}

function item(root: HTMLElement, id: string): HTMLElement {
  return root.querySelector(`[data-var-ui-item-id="${id}"]`) as HTMLElement;
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
  });

  it('opens on trigger click and focuses the first item', () => {
    const root = mountMenu();
    initMenu(root);

    trigger(root).click();

    expect(isOpen(root)).toBe(true);
    expect(trigger(root).getAttribute('aria-expanded')).toBe('true');
    expect(root.hasAttribute('data-open')).toBe(true);
    expect(document.activeElement).toBe(item(root, 'new'));
  });

  it('closes on a second trigger click', () => {
    const root = mountMenu();
    initMenu(root);

    trigger(root).click();
    trigger(root).click();

    expect(isOpen(root)).toBe(false);
    expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
    expect(root.hasAttribute('data-open')).toBe(false);
  });

  it('opens on ArrowDown focusing the first item and on ArrowUp the last', () => {
    const root = mountMenu();
    initMenu(root);

    keydown(trigger(root), 'ArrowDown');
    expect(isOpen(root)).toBe(true);
    expect(document.activeElement).toBe(item(root, 'new'));

    keydown(root, 'Escape');

    keydown(trigger(root), 'ArrowUp');
    expect(isOpen(root)).toBe(true);
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

    expect(isOpen(root)).toBe(false);
    expect(document.activeElement).toBe(trigger(root));
  });

  it('follows a platform dismissal (outside click / light dismiss) and returns focus', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();
    expect(isOpen(root)).toBe(true);

    // The browser's light dismiss hides the popover; the script only mirrors the state.
    popover(root).hidePopover();

    expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
    expect(root.hasAttribute('data-open')).toBe(false);
    expect(document.activeElement).toBe(trigger(root));
  });

  it('wires the trigger to the popover natively (no click handler of its own)', () => {
    const root = mountMenu();
    initMenu(root);

    expect(trigger(root).getAttribute('popovertarget')).toBe(popover(root).id);
    expect(popover(root).getAttribute('popover')).toBe('auto');
    expect(popover(root).getAttribute('data-placement')).toBe('bottom start');
    trigger(root).click();
    expect(isOpen(root)).toBe(true);
    trigger(root).click();
    expect(isOpen(root)).toBe(false);
  });

  it('closes on Tab without moving focus back to the trigger', () => {
    const root = mountMenu();
    initMenu(root);
    trigger(root).click();

    keydown(item(root, 'new'), 'Tab');

    expect(isOpen(root)).toBe(false);
    expect(document.activeElement).not.toBe(trigger(root));
  });

  it('dispatches a bubbling action event, closes, and refocuses the trigger', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'open').click();

    expect(actions).toEqual(['open']);
    expect(isOpen(root)).toBe(false);
    expect(document.activeElement).toBe(trigger(root));
  });

  it('ignores activation of disabled items', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'save').click();

    expect(actions).toEqual([]);
    expect(isOpen(root)).toBe(true);
  });

  it('still dispatches the action event for link items', () => {
    const root = mountMenu();
    initMenu(root);
    const actions = collectActions(root);
    trigger(root).click();

    item(root, 'docs').click();

    expect(actions).toEqual(['docs']);
    expect(isOpen(root)).toBe(false);
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
    expect(isOpen(root)).toBe(true);
  });

  it('exposes an imperative controller', () => {
    const root = mountMenu();
    initMenu(root);

    const controller = getMenuController(item(root, 'new'));
    expect(controller).not.toBeNull();
    expect(controller?.isOpen).toBe(false);

    controller?.open();
    expect(controller?.isOpen).toBe(true);
    expect(isOpen(root)).toBe(true);

    controller?.toggle();
    expect(controller?.isOpen).toBe(false);
    expect(isOpen(root)).toBe(false);
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
    expect(isOpen(root)).toBe(false);
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

describe('menu with per-section radio groups', () => {
  it('checks within the item group only', () => {
    const root = mountGroupedRadioMenu();
    initMenu(root);
    trigger(root).click();

    item(root, 'rose').click();

    expect(item(root, 'rose').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'teal').getAttribute('aria-checked')).toBe('false');
    // The other group keeps its choice.
    expect(item(root, 'dark').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'light').getAttribute('aria-checked')).toBe('false');
  });

  it('controller.select() moves the check within that group', () => {
    const root = mountGroupedRadioMenu();
    initMenu(root);

    getMenuController(root)?.select('light');

    expect(item(root, 'light').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'dark').getAttribute('aria-checked')).toBe('false');
    expect(item(root, 'teal').getAttribute('aria-checked')).toBe('true');
  });
});

describe('initMenus', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes every menu under the given root', () => {
    const first = mountMenu();
    const second = mountMenu();

    initMenus();

    expect(first.hasAttribute('data-var-ui-menu-initialized')).toBe(true);
    expect(second.hasAttribute('data-var-ui-menu-initialized')).toBe(true);
  });
});

describe('row sections (layout: row)', () => {
  it('ArrowRight/Left step through a row; outside a row they do nothing', () => {
    const host = document.createElement('div');
    host.innerHTML = `
      <div data-var-ui-menu-root data-var-ui-selection-mode="none">
        <button type="button" data-var-ui-menu-trigger aria-haspopup="menu" aria-expanded="false"
          aria-controls="menu-r" popovertarget="menu-r-popover">Appearance</button>
        <div data-var-ui-menu-popover id="menu-r-popover" popover="auto">
          <div role="menu" id="menu-r" aria-label="Appearance">
            <div role="group" aria-label="Mode" data-layout="row">
              <button type="button" role="menuitemradio" aria-checked="false" aria-label="Light" data-var-ui-menu-item data-var-ui-item-id="light" tabindex="-1"></button>
              <button type="button" role="menuitemradio" aria-checked="true" aria-label="Dark" data-var-ui-menu-item data-var-ui-item-id="dark" tabindex="-1"></button>
            </div>
            <button type="button" role="menuitem" data-var-ui-menu-item data-var-ui-item-id="other" tabindex="-1">Other</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(host);
    const root = host.querySelector('[data-var-ui-menu-root]') as HTMLElement;
    initMenu(root);
    keydown(trigger(root), 'ArrowDown');
    // Opens on the checked item.
    expect(document.activeElement).toBe(item(root, 'dark'));
    keydown(item(root, 'dark'), 'ArrowLeft');
    expect(document.activeElement).toBe(item(root, 'light'));
    keydown(item(root, 'light'), 'ArrowRight');
    expect(document.activeElement).toBe(item(root, 'dark'));
    item(root, 'other').focus();
    keydown(item(root, 'other'), 'ArrowLeft');
    expect(document.activeElement).toBe(item(root, 'other'));
  });
  let appearanceCount = 0;
  function mountAppearance({ themeKeepsOpen = false } = {}): HTMLElement {
    appearanceCount += 1;
    const id = `menu-a${appearanceCount}`;
    const radio = (itemId: string, checked: boolean) =>
      `<button type="button" role="menuitemradio" aria-checked="${checked}" aria-label="${itemId}"
        data-var-ui-menu-item data-var-ui-item-id="${itemId}" tabindex="-1"></button>`;
    const host = document.createElement('div');
    host.innerHTML = `
      <div data-var-ui-menu-root data-var-ui-selection-mode="none">
        <button type="button" data-var-ui-menu-trigger aria-haspopup="menu" aria-expanded="false"
          aria-controls="${id}" popovertarget="${id}-popover">Appearance</button>
        <div data-var-ui-menu-popover id="${id}-popover" popover="auto">
          <div role="menu" id="${id}" aria-label="Appearance">
            <div role="group" aria-label="Mode" data-var-ui-menu-group data-layout="row" data-var-ui-menu-keep-open>
              ${radio('light', false)}${radio('dark', false)}${radio('system', true)}
            </div>
            <div role="separator"></div>
            <div role="group" aria-label="Theme" data-var-ui-menu-group ${themeKeepsOpen ? 'data-var-ui-menu-keep-open' : ''}>
              <button type="button" role="menuitemradio" aria-checked="true" data-var-ui-menu-item data-var-ui-item-id="teal" tabindex="-1">Teal</button>
              <button type="button" role="menuitemradio" aria-checked="false" data-var-ui-menu-item data-var-ui-item-id="rose" tabindex="-1">Rose</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(host);
    const root = host.querySelector('[data-var-ui-menu-root]') as HTMLElement;
    initMenu(root);
    return root;
  }

  it('wraps ArrowLeft/Right within the row instead of leaving it', () => {
    const root = mountAppearance();
    keydown(trigger(root), 'ArrowDown');
    expect(document.activeElement).toBe(item(root, 'system'));
    keydown(item(root, 'system'), 'ArrowRight');
    expect(document.activeElement).toBe(item(root, 'light'));
    keydown(item(root, 'light'), 'ArrowLeft');
    expect(document.activeElement).toBe(item(root, 'system'));
    // Left/Right inside the Theme list do nothing.
    item(root, 'teal').focus();
    keydown(item(root, 'teal'), 'ArrowRight');
    expect(document.activeElement).toBe(item(root, 'teal'));
  });

  it('ArrowUp/Down treat the row as one stop, entering it on the checked item', () => {
    const root = mountAppearance();
    trigger(root).click();
    item(root, 'light').focus();
    keydown(item(root, 'light'), 'ArrowDown');
    expect(document.activeElement).toBe(item(root, 'teal'));
    keydown(item(root, 'teal'), 'ArrowUp');
    expect(document.activeElement).toBe(item(root, 'system'));
    keydown(item(root, 'system'), 'ArrowUp');
    expect(document.activeElement).toBe(item(root, 'rose'));
    keydown(item(root, 'rose'), 'ArrowDown');
    expect(document.activeElement).toBe(item(root, 'system'));
  });

  it('stays open after a row pick; a list pick still closes', () => {
    const root = mountAppearance();
    const actions = collectActions(root);
    trigger(root).click();
    item(root, 'dark').click();
    expect(isOpen(root)).toBe(true);
    expect(item(root, 'dark').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'system').getAttribute('aria-checked')).toBe('false');
    item(root, 'rose').click();
    expect(isOpen(root)).toBe(false);
    expect(actions).toEqual(['dark', 'rose']);
  });

  it('stays open after a pick in a closeOnSelect: false list section', () => {
    const root = mountAppearance({ themeKeepsOpen: true });
    const actions = collectActions(root);
    trigger(root).click();
    item(root, 'rose').click();
    expect(isOpen(root)).toBe(true);
    expect(item(root, 'rose').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'teal').getAttribute('aria-checked')).toBe('false');
    expect(actions).toEqual(['rose']);
  });
});
