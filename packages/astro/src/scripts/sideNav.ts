import { svg as chevronLeftSvg } from '@var-ui/icons/glyphs/chevronLeft';
import { svg as chevronRightSvg } from '@var-ui/icons/glyphs/chevronRight';
import { createResizeHandle } from './resizeHandle';

/** Keep in sync with `SIDE_NAV_COLLAPSED_WIDTH` in `@var-ui/core`. */
const SIDE_NAV_COLLAPSED_WIDTH = 56;

export type SideNavCollapsibleConfig = {
  defaultIsCollapsed?: boolean;
  hasButton?: boolean;
  buttonLabel?: string;
};

export type ResizableConfig = {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  autoSaveId?: string;
  collapsible?: boolean;
  collapsedSize?: number;
};

const STORAGE_KEY_PREFIX = 'var-ui-resizable:';
const DEFAULT_WIDTH = 260;
const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MAX_WIDTH = 480;
const DEFAULT_COLLAPSED_SIZE = 160;

const CHEVRON_LEFT = chevronLeftSvg;
const CHEVRON_RIGHT = chevronRightSvg;

function markInitialized(element: Element): boolean {
  if (element.hasAttribute('data-var-ui-initialized')) return false;
  element.setAttribute('data-var-ui-initialized', '');
  return true;
}

function readStoredWidth(autoSaveId: string | undefined): number | undefined {
  if (!autoSaveId) return undefined;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${autoSaveId}`);
    if (raw === null) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredWidth(autoSaveId: string | undefined, width: number): void {
  if (!autoSaveId) return;
  try {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${autoSaveId}`, String(width));
  } catch {
    // Storage disabled — width still tracked in memory for this session.
  }
}

function parseJsonConfig<T extends object>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return { ...fallback, ...JSON.parse(value) };
  } catch {
    return fallback;
  }
}

function syncCollapseButton(button: HTMLElement, isCollapsed: boolean, label?: string): void {
  button.setAttribute(
    'aria-label',
    label ?? (isCollapsed ? 'Expand navigation' : 'Collapse navigation'),
  );
  button.innerHTML = isCollapsed ? CHEVRON_RIGHT : CHEVRON_LEFT;
}

export function initSideNav(root: HTMLElement): () => void {
  if (!markInitialized(root)) {
    return () => {};
  }

  const collapsibleEnabled = root.hasAttribute('data-collapsible');
  const resizableEnabled = root.hasAttribute('data-resizable');
  const collapsibleConfig = parseJsonConfig<SideNavCollapsibleConfig>(
    root.dataset.collapsibleConfig,
    {},
  );
  const resizableConfig = parseJsonConfig<ResizableConfig>(root.dataset.resizableConfig, {});

  const minWidth = resizableConfig.minWidth ?? DEFAULT_MIN_WIDTH;
  const maxWidth = resizableConfig.maxWidth ?? DEFAULT_MAX_WIDTH;
  const defaultWidth = resizableConfig.defaultWidth ?? DEFAULT_WIDTH;
  const collapsedSize = resizableConfig.collapsedSize ?? DEFAULT_COLLAPSED_SIZE;
  const resizeCollapsible = resizableEnabled && (resizableConfig.collapsible ?? collapsibleEnabled);

  let isCollapsed = collapsibleConfig.defaultIsCollapsed ?? false;
  let width = (() => {
    const stored = readStoredWidth(resizableConfig.autoSaveId);
    const initial = stored ?? defaultWidth;
    return Math.min(Math.max(initial, minWidth), maxWidth);
  })();
  let expandedWidth = width;

  const collapseButton = root.querySelector<HTMLElement>('[data-var-ui-side-nav-collapse]');
  const resizeHandleEl = root.querySelector<HTMLElement>('[data-var-ui-side-nav-resize]');

  const applyCollapsed = (next: boolean) => {
    isCollapsed = next;
    if (isCollapsed) {
      root.setAttribute('data-collapsed', '');
    } else {
      root.removeAttribute('data-collapsed');
    }
    if (collapseButton) {
      syncCollapseButton(collapseButton, isCollapsed, collapsibleConfig.buttonLabel);
    }
    if (resizeHandleEl) {
      if (isCollapsed) {
        resizeHandleEl.setAttribute('data-collapsed', '');
      } else {
        resizeHandleEl.removeAttribute('data-collapsed');
      }
    }
    if (!collapsibleEnabled) return;

    if (isCollapsed) {
      if (resizableEnabled) {
        expandedWidth = width;
      }
      root.style.width = `${SIDE_NAV_COLLAPSED_WIDTH}px`;
      return;
    }

    if (resizableEnabled) {
      root.style.width = `${expandedWidth}px`;
      width = expandedWidth;
      return;
    }

    root.style.removeProperty('width');
  };

  const applyWidth = (next: number) => {
    width = Math.min(Math.max(next, minWidth), maxWidth);
    root.style.width = `${width}px`;
    writeStoredWidth(resizableConfig.autoSaveId, width);
    if (resizeHandleEl) {
      resizeHandleEl.setAttribute('aria-valuenow', String(width));
    }
    if (resizeCollapsible && next < collapsedSize) {
      applyCollapsed(true);
    }
  };

  applyCollapsed(isCollapsed);
  if (resizableEnabled) {
    expandedWidth = width;
    if (!isCollapsed) {
      root.style.width = `${width}px`;
    }
  }

  const cleanups: Array<() => void> = [];

  if (collapseButton && collapsibleEnabled) {
    const handleCollapseClick = () => applyCollapsed(!isCollapsed);
    collapseButton.addEventListener('click', handleCollapseClick);
    cleanups.push(() => collapseButton.removeEventListener('click', handleCollapseClick));
  }

  if (resizeHandleEl && resizableEnabled) {
    cleanups.push(
      createResizeHandle(resizeHandleEl, {
        getValue: () => width,
        minValue: minWidth,
        maxValue: maxWidth,
        onChange: applyWidth,
        getIsCollapsed: () => isCollapsed,
        onCollapse: resizeCollapsible ? () => applyCollapsed(!isCollapsed) : undefined,
        'aria-label': 'Resize side navigation',
      }),
    );
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function initSideNavs(): void {
  document.querySelectorAll('[data-var-ui-side-nav]').forEach((root) => {
    initSideNav(root as HTMLElement);
  });
}
