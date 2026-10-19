import { defaultIconSvgs } from '@var-ui/icons/glyphs';

type MobileNavController = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const providers = new WeakMap<HTMLElement, MobileNavController>();

const MENU_ICON = defaultIconSvgs.menu;
const CLOSE_ICON = defaultIconSvgs.close;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
}

function lockScroll(locked: boolean, previousOverflow: { value: string }): void {
  if (locked) {
    previousOverflow.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return;
  }
  document.body.style.overflow = previousOverflow.value;
}

function syncOpenState(root: HTMLElement, isOpen: boolean): void {
  root
    .querySelectorAll('[data-var-ui-mobile-nav-overlay], [data-var-ui-mobile-nav-panel]')
    .forEach((el) => {
      if (isOpen) {
        el.setAttribute('data-open', '');
      } else {
        el.removeAttribute('data-open');
      }
    });

  root.querySelectorAll('[data-var-ui-mobile-nav-toggle]').forEach((el) => {
    el.setAttribute('aria-expanded', String(isOpen));
  });
}

export function getMobileNavProvider(element: Element): MobileNavController | null {
  const root = element.closest('[data-var-ui-mobile-nav-provider]');
  if (!root) return null;
  return providers.get(root as HTMLElement) ?? null;
}

function markInitialized(element: Element): boolean {
  if (element.hasAttribute('data-var-ui-initialized')) return false;
  element.setAttribute('data-var-ui-initialized', '');
  return true;
}

export function initMobileNavProvider(root: HTMLElement): () => void {
  if (!markInitialized(root)) {
    return () => {};
  }
  const previousOverflow = { value: '' };
  let isOpen = false;
  let lastFocused: HTMLElement | null = null;

  const controller: MobileNavController = {
    get isOpen() {
      return isOpen;
    },
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen),
  };

  const setOpen = (next: boolean) => {
    if (isOpen === next) return;
    isOpen = next;
    syncOpenState(root, isOpen);
    lockScroll(isOpen, previousOverflow);

    const panel = root.querySelector<HTMLElement>('[data-var-ui-mobile-nav-panel]');
    if (isOpen && panel) {
      lastFocused = document.activeElement as HTMLElement | null;
      const focusables = getFocusableElements(panel);
      (focusables[0] ?? panel).focus();
      return;
    }

    if (!isOpen && lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  };

  providers.set(root, controller);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen || event.key !== 'Escape') return;
    event.preventDefault();
    setOpen(false);
  };

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!isOpen || event.key !== 'Tab') return;
    const panel = root.querySelector<HTMLElement>('[data-var-ui-mobile-nav-panel]');
    if (!panel) return;
    const focusables = getFocusableElements(panel);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleDocumentKeyDown);

  return () => {
    providers.delete(root);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', handleDocumentKeyDown);
    lockScroll(false, previousOverflow);
  };
}

export function initMobileNavToggle(button: HTMLElement): () => void {
  if (!markInitialized(button)) {
    return () => {};
  }

  const provider = getMobileNavProvider(button);
  button.setAttribute('aria-expanded', 'false');
  if (!button.innerHTML.trim()) {
    button.innerHTML = MENU_ICON;
  }

  const handleClick = () => {
    if (provider) {
      provider.toggle();
      return;
    }
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  };

  button.addEventListener('click', handleClick);
  return () => button.removeEventListener('click', handleClick);
}

export function initMobileNav(drawer: HTMLElement): () => void {
  if (!markInitialized(drawer)) {
    return () => {};
  }

  const providerRoot = drawer.closest('[data-var-ui-mobile-nav-provider]') as HTMLElement | null;
  const provider = providerRoot ? getMobileNavProvider(drawer) : null;
  const overlay = drawer.querySelector<HTMLElement>('[data-var-ui-mobile-nav-overlay]');
  const panel = drawer.querySelector<HTMLElement>('[data-var-ui-mobile-nav-panel]');
  const closeButton = drawer.querySelector<HTMLElement>('[data-var-ui-mobile-nav-close]');

  if (closeButton && !closeButton.innerHTML.trim()) {
    closeButton.innerHTML = CLOSE_ICON;
  }

  const close = () => provider?.close();

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) {
      close();
    }
  };

  const handleCloseClick = () => close();

  const handlePanelClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a[href]')) {
      close();
    }
  };

  overlay?.addEventListener('click', handleOverlayClick);
  closeButton?.addEventListener('click', handleCloseClick);
  panel?.addEventListener('click', handlePanelClick);

  return () => {
    overlay?.removeEventListener('click', handleOverlayClick);
    closeButton?.removeEventListener('click', handleCloseClick);
    panel?.removeEventListener('click', handlePanelClick);
  };
}

export function initMobileNavProviders(): void {
  document.querySelectorAll('[data-var-ui-mobile-nav-provider]').forEach((root) => {
    initMobileNavProvider(root as HTMLElement);
  });
}

export function initMobileNavs(): void {
  document.querySelectorAll('[data-var-ui-mobile-nav]').forEach((drawer) => {
    initMobileNav(drawer as HTMLElement);
  });
}

export function initMobileNavToggles(): void {
  document.querySelectorAll('[data-var-ui-mobile-nav-toggle]').forEach((button) => {
    initMobileNavToggle(button as HTMLElement);
  });
}

export function initMobileNavChrome(): void {
  initMobileNavProviders();
  initMobileNavs();
  initMobileNavToggles();
}
