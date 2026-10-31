import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefCallback,
} from 'react';

export type AnchorSide = 'top' | 'bottom' | 'start' | 'end';
export type AnchorAlign = 'start' | 'center' | 'end';
/**
 * Requested placement: a side, optionally followed by an alignment (`'bottom'`, `'bottom end'`).
 * `start`/`end` are logical (RTL correct); `left`/`right` do not exist.
 */
export type AnchorPlacement = AnchorSide | `${AnchorSide} ${AnchorAlign}`;

export type UseAnchorOptions = {
  /**
   * Written to the popup as `data-placement`: the REQUESTED placement (core maps it to
   * `position-area`; after a flip the rendered side differs). Do not also render
   * `data-placement` in JSX. @default 'bottom'
   */
  placement?: AnchorPlacement;
  /**
   * Gap between trigger and popup. A number is px, a string is any CSS length or `var()`.
   * Written as `--var-ui-popup-offset` on the popup (so the recipe's token default applies when
   * omitted, and CSS can override it).
   */
  offset?: number | string;
};

export type AnchorResult = {
  /** The dashed ident used for this root, `--var-ui-<id>`. */
  name: string;
};

const PLACEMENT_ATTR = 'data-placement';
const OFFSET_PROP = '--var-ui-popup-offset';

/**
 * Wires CSS anchor positioning between a trigger and its popup with explicit names (implicit
 * anchors are not relied on): `anchor-name: --var-ui-<id>` on the trigger, `position-anchor` on
 * the popup, `data-placement` and `--var-ui-popup-offset` on the popup. Everything is written
 * with `style.setProperty`/`setAttribute` in a layout effect and removed on cleanup, so no React
 * state or re-render is involved and the elements keep their own `style`/attributes.
 *
 * Pass elements (state from `root.triggerEl` / `root.popupEl`), not refs, so the effect re-runs
 * when they attach. The trigger may be any element, including a virtual one (`useVirtualAnchor`).
 */
export function useAnchor(
  triggerEl: Element | null,
  popupEl: HTMLElement | null,
  { placement = 'bottom', offset }: UseAnchorOptions = {},
): AnchorResult {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const name = `--var-ui-${id}`;

  useLayoutEffect(() => {
    const trigger = triggerEl as (HTMLElement | SVGElement) | null;
    if (!trigger?.style) return undefined;
    trigger.style.setProperty('anchor-name', name);
    return () => {
      if (trigger.style.getPropertyValue('anchor-name') === name) {
        trigger.style.removeProperty('anchor-name');
      }
    };
  }, [triggerEl, name]);

  useLayoutEffect(() => {
    if (!popupEl) return undefined;
    popupEl.style.setProperty('position-anchor', name);
    return () => {
      if (popupEl.style.getPropertyValue('position-anchor') === name) {
        popupEl.style.removeProperty('position-anchor');
      }
    };
  }, [popupEl, name]);

  useLayoutEffect(() => {
    if (!popupEl) return undefined;
    popupEl.setAttribute(PLACEMENT_ATTR, placement);
    return () => popupEl.removeAttribute(PLACEMENT_ATTR);
  }, [popupEl, placement]);

  const offsetValue =
    offset === undefined ? undefined : typeof offset === 'number' ? `${offset}px` : offset;
  useLayoutEffect(() => {
    if (!popupEl || offsetValue === undefined) return undefined;
    popupEl.style.setProperty(OFFSET_PROP, offsetValue);
    return () => void popupEl.style.removeProperty(OFFSET_PROP);
  }, [popupEl, offsetValue]);

  return { name };
}

const VIRTUAL_ANCHOR_STYLE: CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: 1,
  height: 1,
  margin: 0,
  padding: 0,
  border: 0,
  pointerEvents: 'none',
  visibility: 'hidden',
};

export type VirtualAnchor = {
  /** Spread on the 1px element you render next to the popup: `ref`, `style`, `aria-hidden`. */
  props: { ref: RefCallback<HTMLElement>; style: CSSProperties; 'aria-hidden': true };
  /** The attached element: pass it to `useAnchor` as the trigger. */
  element: HTMLElement | null;
  /** Moves the anchor to viewport coordinates (`clientX`/`clientY`); call before opening. */
  moveTo: (x: number, y: number) => void;
};

/**
 * A 1px fixed element you can move to pointer coordinates, for popups that anchor to a point
 * rather than a trigger (ContextMenu):
 *
 * ```tsx
 * const point = useVirtualAnchor();
 * useAnchor(point.element, popupEl, { placement: 'bottom start' });
 * <span {...point.props} />
 * onContextMenu={(e) => { point.moveTo(e.clientX, e.clientY); setOpen(true); }}
 * ```
 */
export function useVirtualAnchor(): VirtualAnchor {
  const ref = useRef<HTMLElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const setRef = useCallback<RefCallback<HTMLElement>>((node) => {
    ref.current = node;
    if (node) setElement(node);
  }, []);
  const moveTo = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }, []);
  return useMemo(
    () => ({
      props: { ref: setRef, style: VIRTUAL_ANCHOR_STYLE, 'aria-hidden': true as const },
      element,
      moveTo,
    }),
    [setRef, element, moveTo],
  );
}
