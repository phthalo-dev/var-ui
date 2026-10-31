/**
 * Vanilla controller for the Astro `Menu` component — a menu-button pattern
 * (trigger + popup list) with roving focus and typeahead. The popup is a native
 * `popover="auto"` element opened by the trigger's `popovertarget` (so it also works
 * before this script runs), anchored with CSS anchor positioning, and dismissed natively
 * (outside click, Escape). The script adds what the platform does not: arrow/typeahead
 * navigation, initial focus, focus return, item activation and the action event. Mirrors
 * the React `Menu` behavior without React Aria.
 */

/**
 * Event dispatched (bubbling) from the menu root after an item is activated.
 * `event.detail.id` holds the item's `data-item-id` value.
 */
export const MENU_ACTION_EVENT = 'var-ui:menu-action';

export type MenuActionDetail = {
  id: string | null;
};

/**
 * Popover placement relative to the trigger (CSS anchor positioning, set as `data-placement`):
 * a side (`top | bottom | start | end`), optionally with an alignment (`bottom end`). The popup
 * flips when it does not fit; `start`/`end` follow the writing direction.
 */
export type MenuPlacement =
  | 'top'
  | 'bottom'
  | 'start'
  | 'end'
  | `${'top' | 'bottom' | 'start' | 'end'} ${'start' | 'center' | 'end'}`;

/**
 * `none` mirrors the React `Menu`; `single` renders items as `menuitemradio`
 * and tracks one `aria-checked` item.
 */
export type MenuSelectionMode = 'none' | 'single';

/** Data model for one actionable row, mirroring the React `MenuItemDefinition`. */
export type MenuItemDefinition = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  /** Renders the item as a link that navigates natively instead of a button. */
  href?: string;
  /** Leading color swatch (e.g. theme pickers). Any CSS color value. */
  swatch?: string;
};

/** Data model for a group of items, mirroring the React `MenuSectionDefinition`. */
export type MenuSectionDefinition = {
  label?: string;
  items: MenuItemDefinition[];
};

export type MenuController = {
  readonly isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Moves `aria-checked` to the item with the given `data-item-id` (single mode). */
  select: (id: string) => void;
};

const ROOT_SELECTOR = '[data-var-ui-menu-root]';
const INITIALIZED_ATTR = 'data-var-ui-menu-initialized';
const TRIGGER_SELECTOR = '[data-var-ui-menu-trigger]';
const POPOVER_SELECTOR = '[data-var-ui-menu-popover]';
const ITEM_SELECTOR = '[data-var-ui-menu-item]';

const controllers = new WeakMap<Element, MenuController>();
const openRoots = new Set<HTMLElement>();
let globalListenersAttached = false;

export function getMenuController(element: Element): MenuController | null {
  const root = element.closest(ROOT_SELECTOR);
  if (!root) return null;
  return controllers.get(root) ?? null;
}

let menuInstanceCounter = 0;

/** SSR-safe unique id for wiring `aria-controls` between trigger and menu. */
export function nextMenuId(): string {
  menuInstanceCounter += 1;
  return `var-ui-menu-${menuInstanceCounter}`;
}

function attachGlobalListeners(): void {
  if (globalListenersAttached || typeof document === 'undefined') return;
  globalListenersAttached = true;

  // Close overlays before a view-transition swap replaces the DOM. (Outside clicks and Escape
  // are the platform's light dismiss.)
  document.addEventListener('astro:before-swap', () => {
    for (const root of openRoots) {
      controllers.get(root)?.close();
    }
  });
}

function isDisabled(item: HTMLElement): boolean {
  return item.getAttribute('aria-disabled') === 'true';
}

type ToggleLike = Event & { newState?: string };

export function initMenu(root: Element): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.hasAttribute(INITIALIZED_ATTR)) return;
  root.setAttribute(INITIALIZED_ATTR, '');

  const triggerEl = root.querySelector(TRIGGER_SELECTOR);
  const popoverEl = root.querySelector(POPOVER_SELECTOR);
  if (!(triggerEl instanceof HTMLElement) || !(popoverEl instanceof HTMLElement)) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
  if (items.length === 0) return;

  const rootEl = root;
  const trigger = triggerEl;
  const popover = popoverEl;

  attachGlobalListeners();

  const singleSelection = rootEl.dataset.selectionMode === 'single';

  let open = false;
  /** Which item the next open focuses (`none` for a programmatic open). */
  let pendingFocus: 'first' | 'last' | 'none' = 'first';
  /** Whether closing returns focus to the trigger (not after Tab or a link activation). */
  let returnFocus = true;
  let typeaheadBuffer = '';
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  function isOpenNow(): boolean {
    try {
      return popover.matches(':popover-open');
    } catch {
      return open;
    }
  }

  function syncCheckedItem(checkedItem: HTMLElement | null): void {
    for (const candidate of items) {
      if (candidate.getAttribute('role') !== 'menuitemradio') continue;
      candidate.setAttribute('aria-checked', String(candidate === checkedItem));
    }
  }

  function syncOpenState(next: boolean): void {
    open = next;
    trigger.setAttribute('aria-expanded', String(next));
    if (next) {
      rootEl.setAttribute('data-open', '');
      openRoots.add(rootEl);
    } else {
      rootEl.removeAttribute('data-open');
      openRoots.delete(rootEl);
    }
  }

  function focusItemAt(index: number): void {
    items[index]?.focus();
  }

  function focusOnOpen(target: 'first' | 'last' | 'none'): void {
    if (target === 'first') {
      const checkedIndex = singleSelection
        ? items.findIndex((candidate) => candidate.getAttribute('aria-checked') === 'true')
        : -1;
      focusItemAt(checkedIndex >= 0 ? checkedIndex : 0);
    } else if (target === 'last') {
      focusItemAt(items.length - 1);
    }
  }

  function showMenu(focusTarget: 'first' | 'last' | 'none'): void {
    if (isOpenNow()) {
      focusOnOpen(focusTarget);
      return;
    }
    pendingFocus = focusTarget;
    popover.showPopover();
  }

  function hideMenu({ restoreFocus = true } = {}): void {
    if (!isOpenNow()) return;
    returnFocus = restoreFocus;
    popover.hidePopover();
  }

  // State attributes follow the platform's own open/close (invoker click, light dismiss, Escape),
  // synchronously, before the popup is shown or hidden.
  popover.addEventListener('beforetoggle', (event) => {
    syncOpenState((event as ToggleLike).newState === 'open');
  });

  // After the popup is shown / hidden: focus the first item, or give focus back to the trigger.
  popover.addEventListener('toggle', (event) => {
    if ((event as ToggleLike).newState === 'open') {
      const target = pendingFocus;
      pendingFocus = 'first';
      focusOnOpen(target);
      return;
    }
    const restore = returnFocus;
    returnFocus = true;
    // Escape/light dismiss restore focus natively only when the popup itself had moved it there
    // (and Safari does not focus buttons on click): make it deterministic.
    const active = document.activeElement;
    if (restore && (active === document.body || popover.contains(active))) trigger.focus();
  });

  function moveFocus(currentIndex: number, delta: number): void {
    const next = (currentIndex + delta + items.length) % items.length;
    focusItemAt(next);
  }

  function handleTypeahead(event: KeyboardEvent, currentIndex: number): void {
    typeaheadBuffer += event.key.toLocaleLowerCase();
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = '';
    }, 500);

    for (let offset = 1; offset <= items.length; offset += 1) {
      const candidate = items[(currentIndex + offset) % items.length];
      const text = candidate?.textContent?.trim().toLocaleLowerCase() ?? '';
      if (text.startsWith(typeaheadBuffer)) {
        candidate?.focus();
        break;
      }
    }
  }

  const controller: MenuController = {
    get isOpen() {
      return isOpenNow();
    },
    open: () => showMenu('none'),
    close: () => hideMenu(),
    toggle: () => (isOpenNow() ? hideMenu() : showMenu('none')),
    select: (id: string) => {
      const match = items.find((candidate) => candidate.getAttribute('data-item-id') === id);
      if (match) syncCheckedItem(match);
    },
  };
  controllers.set(rootEl, controller);

  // Click toggling is the trigger's `popovertarget` (native invoker): no handler here, so there
  // is no double toggle and the menu opens before this script has run.

  trigger.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      showMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      showMenu('last');
    }
  });

  rootEl.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'Escape' && isOpenNow()) {
      // Handled here (not left to the platform's close request) so an enclosing modal dialog does
      // not also close.
      event.preventDefault();
      event.stopPropagation();
      hideMenu();
    }
  });

  popover.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const currentIndex = items.indexOf(target);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(currentIndex, 1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(currentIndex, -1);
        return;
      case 'Home':
        event.preventDefault();
        focusItemAt(0);
        return;
      case 'End':
        event.preventDefault();
        focusItemAt(items.length - 1);
        return;
      case 'Tab':
        hideMenu({ restoreFocus: false });
        return;
      case ' ':
        // Buttons activate on Space natively; links need a manual click.
        if (target.localName === 'a') {
          event.preventDefault();
          target.click();
        }
        return;
      default:
        break;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      handleTypeahead(event, currentIndex);
    }
  });

  for (const item of items) {
    item.addEventListener('focus', () => {
      item.setAttribute('data-focused', '');
    });
    item.addEventListener('blur', () => {
      item.removeAttribute('data-focused');
    });
    // Pointer hover moves menu focus, matching native menus and React Aria.
    item.addEventListener('pointerenter', () => {
      item.focus();
    });
    item.addEventListener('click', (event) => {
      if (isDisabled(item)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const isLink = item.localName === 'a';
      if (singleSelection) syncCheckedItem(item);
      rootEl.dispatchEvent(
        new CustomEvent<MenuActionDetail>(MENU_ACTION_EVENT, {
          bubbles: true,
          detail: { id: item.getAttribute('data-item-id') },
        }),
      );
      hideMenu({ restoreFocus: !isLink });
    });
  }
}

export function initMenus(root: ParentNode = document): void {
  root.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    initMenu(node);
  });
}
