import { svg as closeSvg } from '@var-ui/icons/glyphs/close';
import { svg as menuSvg } from '@var-ui/icons/glyphs/menu';
import { isBackdropTarget } from './backdropDismiss';

type MobileNavController = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const providers = new WeakMap<HTMLElement, MobileNavController>();

const MENU_ICON = menuSvg;
const CLOSE_ICON = closeSvg;

function getPopup(root: ParentNode): HTMLDialogElement | null {
  return root.querySelector<HTMLDialogElement>('[data-var-ui-mobile-nav-popup]');
}

function syncOpenState(root: HTMLElement, isOpen: boolean): void {
  const popup = getPopup(root);
  if (popup) {
    if (isOpen) popup.setAttribute('data-open', '');
    else popup.removeAttribute('data-open');
  }

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

/**
 * The provider owns the open state; the native `<dialog>` owns focus trapping, Escape, the
 * top layer, inertness of the page and scroll locking (a global CSS rule).
 */
export function initMobileNavProvider(root: HTMLElement): () => void {
  if (!markInitialized(root)) {
    return () => {};
  }
  let isOpen = false;

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
    const popup = getPopup(root);
    if (popup) {
      if (next && !popup.open) popup.showModal();
      else if (!next && popup.open) popup.close();
    }
    syncOpenState(root, isOpen);
  };

  providers.set(root, controller);

  return () => {
    providers.delete(root);
    const popup = getPopup(root);
    if (popup?.open) popup.close();
  };
}

export function initMobileNavToggle(button: HTMLElement): () => void {
  if (!markInitialized(button)) {
    return () => {};
  }

  button.setAttribute('aria-expanded', 'false');
  if (!button.innerHTML.trim()) {
    button.innerHTML = MENU_ICON;
  }

  const handleClick = () => {
    const provider = getMobileNavProvider(button);
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

  const popup = getPopup(drawer);
  const closeButton = drawer.querySelector<HTMLElement>('[data-var-ui-mobile-nav-close]');

  if (closeButton && !closeButton.innerHTML.trim()) {
    closeButton.innerHTML = CLOSE_ICON;
  }

  // Resolved at event time: the drawer script and `AppShell` both initialize, and whichever
  // runs first wins `data-var-ui-initialized`.
  const close = () => getMobileNavProvider(drawer)?.close();

  let pressedBackdrop = false;
  let pressedLink = false;
  const handlePointerDown = (event: PointerEvent) => {
    if (!popup) return;
    pressedBackdrop = isBackdropTarget(popup, event);
    const target = event.target;
    pressedLink = target instanceof Element && !!target.closest('a[href]');
  };
  // Backdrop: pointerdown and click both outside the dialog box. A link closes only when the
  // press started on that link, so a drag that ends on it does not.
  const handlePopupClick = (event: MouseEvent) => {
    const target = event.target;
    const link = pressedLink && target instanceof Element ? target.closest('a[href]') : null;
    const backdrop = popup ? pressedBackdrop && isBackdropTarget(popup, event) : false;
    pressedBackdrop = false;
    pressedLink = false;
    if (backdrop || link) close();
  };
  // Native closes (Escape, `requestClose()`) keep the provider's state in sync.
  const handlePopupClose = () => close();
  const handleCloseClick = () => close();

  popup?.addEventListener('pointerdown', handlePointerDown);
  popup?.addEventListener('click', handlePopupClick);
  popup?.addEventListener('close', handlePopupClose);
  closeButton?.addEventListener('click', handleCloseClick);

  return () => {
    popup?.removeEventListener('pointerdown', handlePointerDown);
    popup?.removeEventListener('click', handlePopupClick);
    popup?.removeEventListener('close', handlePopupClose);
    closeButton?.removeEventListener('click', handleCloseClick);
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
