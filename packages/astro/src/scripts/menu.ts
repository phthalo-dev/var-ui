/**
 * Vanilla controller for the Astro `Menu` component — a menu-button pattern
 * (trigger + popup list) with roving focus, typeahead, and presence animation
 * attrs. Generalizes the interaction model first proven in the docs theme
 * picker; mirrors the React `Menu` behavior without React Aria.
 */

/**
 * Event dispatched (bubbling) from the menu root after an item is activated.
 * `event.detail.id` holds the item's `data-item-id` value.
 */
export const MENU_ACTION_EVENT = 'var-ui:menu-action';

export type MenuActionDetail = {
  id: string | null;
};

/** Popover placement relative to the trigger (CSS-only, anchored to the root). */
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

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

  document.addEventListener(
    'pointerdown',
    (event) => {
      for (const root of openRoots) {
        if (event.target instanceof Node && root.contains(event.target)) continue;
        controllers.get(root)?.close();
      }
    },
    true,
  );

  // Close overlays before a view-transition swap replaces the DOM.
  document.addEventListener('astro:before-swap', () => {
    for (const root of openRoots) {
      controllers.get(root)?.close();
    }
  });
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

function nextFrames(callback: () => void): void {
  const raf =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb: () => void) => setTimeout(cb, 16);
  raf(() => raf(callback));
}

function isDisabled(item: HTMLElement): boolean {
  return item.getAttribute('aria-disabled') === 'true';
}

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
  let generation = 0;
  let typeaheadBuffer = '';
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  function syncCheckedItem(checkedItem: HTMLElement | null): void {
    for (const candidate of items) {
      if (candidate.getAttribute('role') !== 'menuitemradio') continue;
      candidate.setAttribute('aria-checked', String(candidate === checkedItem));
    }
  }

  function syncOpenState(): void {
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
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

  function openMenu(focusTarget: 'first' | 'last' | 'none' = 'first'): void {
    if (open) return;
    open = true;
    const gen = ++generation;
    popover.hidden = false;
    popover.removeAttribute('data-closed');
    popover.removeAttribute('data-ending-style');
    popover.setAttribute('data-open', '');
    popover.setAttribute('data-starting-style', '');
    nextFrames(() => {
      if (gen === generation) popover.removeAttribute('data-starting-style');
    });
    syncOpenState();
    if (focusTarget === 'first') {
      const checkedIndex = singleSelection
        ? items.findIndex((candidate) => candidate.getAttribute('aria-checked') === 'true')
        : -1;
      focusItemAt(checkedIndex >= 0 ? checkedIndex : 0);
    } else if (focusTarget === 'last') {
      focusItemAt(items.length - 1);
    }
  }

  function closeMenu({ focusTrigger = false } = {}): void {
    if (!open) return;
    open = false;
    const gen = ++generation;
    syncOpenState();

    const finish = () => {
      if (gen !== generation) return;
      popover.hidden = true;
      popover.removeAttribute('data-open');
      popover.removeAttribute('data-closed');
      popover.removeAttribute('data-ending-style');
    };

    if (prefersReducedMotion()) {
      finish();
    } else {
      popover.setAttribute('data-closed', '');
      popover.setAttribute('data-ending-style', '');
      nextFrames(() => {
        if (gen !== generation) return;
        const animations = popover.getAnimations?.() ?? [];
        if (animations.length === 0) {
          finish();
        } else {
          void Promise.allSettled(animations.map((animation) => animation.finished)).then(finish);
        }
      });
    }

    if (focusTrigger) trigger.focus();
  }

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
      return open;
    },
    open: () => openMenu('none'),
    close: () => closeMenu(),
    toggle: () => (open ? closeMenu() : openMenu()),
    select: (id: string) => {
      const match = items.find((candidate) => candidate.getAttribute('data-item-id') === id);
      if (match) syncCheckedItem(match);
    },
  };
  controllers.set(rootEl, controller);

  trigger.addEventListener('click', () => {
    if (open) {
      closeMenu();
    } else {
      openMenu('first');
    }
  });

  trigger.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu('last');
    }
  });

  rootEl.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'Escape' && open) {
      closeMenu({ focusTrigger: true });
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
        closeMenu();
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
      closeMenu({ focusTrigger: !isLink });
    });
  }
}

export function initMenus(root: ParentNode = document): void {
  root.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    initMenu(node);
  });
}
