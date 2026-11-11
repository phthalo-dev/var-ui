import { useCallback } from 'react';

export type TreeFocusItem = {
  id: string;
  element: HTMLElement;
  isDisabled: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
};

export type UseTreeFocusOptions = {
  /** Flat, visible-row snapshot in document order — re-queried on every keypress. */
  getItems: () => TreeFocusItem[];
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  /** Omit (or leave undefined) when rows are not selectable — Enter/Space become no-ops. */
  onSelect?: (id: string) => void;
};

export type UseTreeFocusResult = {
  onKeyDown: (event: KeyboardEvent) => void;
  /**
   * Bind to the `role="tree"` root. Rows own the roving `tabIndex` (0/-1); the
   * root itself stays out of the tab order (`-1`) since it's never a direct stop.
   */
  tabIndex: number;
};

function levelOf(element: HTMLElement): number {
  return Number(element.getAttribute('aria-level') ?? '1');
}

/**
 * Hand-rolled APG tree keyboard behavior: ArrowUp/Down move among visible,
 * enabled rows; ArrowRight expands (or moves to the first child if already
 * expanded); ArrowLeft collapses (or moves to the parent row, found by
 * scanning backwards for the nearest lower `aria-level`); Home/End jump to
 * the first/last row; Enter/Space call `onSelect` when provided. Disabled
 * rows are filtered out entirely — never a focus target.
 *
 * DOM-driven by design: `getItems()` re-queries the live, visible rows (and
 * their `aria-level`/`aria-expanded` state) on every keypress, so callers can
 * simply render/hide DOM instead of syncing a parallel model into this hook.
 * Bind the returned `onKeyDown` to the tree root (keydown bubbles up from
 * whichever row is focused).
 */
export function useTreeFocus(options: UseTreeFocusOptions): UseTreeFocusResult {
  const { getItems, onExpand, onCollapse, onSelect } = options;

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const items = getItems().filter((item) => !item.isDisabled);
      if (items.length === 0) return;

      const currentIndex = items.findIndex((item) => item.element === document.activeElement);
      const current = currentIndex === -1 ? undefined : items[currentIndex];

      const focusAt = (index: number) => {
        items[index]?.element.focus();
      };

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          focusAt(currentIndex === -1 ? 0 : Math.min(currentIndex + 1, items.length - 1));
          return;
        }
        case 'ArrowUp': {
          event.preventDefault();
          focusAt(currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0));
          return;
        }
        case 'Home': {
          event.preventDefault();
          focusAt(0);
          return;
        }
        case 'End': {
          event.preventDefault();
          focusAt(items.length - 1);
          return;
        }
        case 'ArrowRight': {
          if (current == null || !current.hasChildren) return;
          event.preventDefault();
          if (!current.isExpanded) {
            onExpand(current.id);
          } else if (currentIndex + 1 < items.length) {
            focusAt(currentIndex + 1);
          }
          return;
        }
        case 'ArrowLeft': {
          if (current == null) return;
          event.preventDefault();
          if (current.hasChildren && current.isExpanded) {
            onCollapse(current.id);
            return;
          }
          const currentLevel = levelOf(current.element);
          for (let index = currentIndex - 1; index >= 0; index -= 1) {
            if (levelOf(items[index].element) < currentLevel) {
              focusAt(index);
              break;
            }
          }
          return;
        }
        case 'Enter':
        case ' ': {
          if (current == null || onSelect == null) return;
          event.preventDefault();
          onSelect(current.id);
        }
      }
    },
    [getItems, onExpand, onCollapse, onSelect],
  );

  return { onKeyDown, tabIndex: -1 };
}
