import { useEffect, useRef, type RefObject } from 'react';

type ElementRef = RefObject<Element | null>;

export type UseClickOutsideOptions = {
  /**
   * Document events to listen for, all in the capture phase.
   * @default ['pointerdown']
   */
  events?: readonly ('pointerdown' | 'mousedown' | 'touchstart' | 'click' | 'focusin')[];
  /**
   * Turn the listener off, e.g. while a panel is closed.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Calls `handler` when a pointer event starts outside every element in `refs`. The listener is
 * on the document in the capture phase, so it still fires when something inside calls
 * `stopPropagation()`, and it uses the event path, so clicks inside shadow roots count.
 *
 * Interaction with the platform:
 *
 * - **Native top layer.** A `<dialog>` or `[popover]` opened inside the ref is still a DOM
 *   descendant of it, so clicks in it count as inside. The `::backdrop` of a modal dialog is
 *   part of the dialog element, so a click on it counts as inside too.
 * - **Portaled content** (see `Portal`) is not a descendant of the ref. Pass its ref as well:
 *   `useClickOutside([panelRef, portaledRef], close)`.
 * - Overlays already handle light dismiss themselves (`onOpenChange` with a reason). Reach for
 *   this hook for your own panels, not to close a `Popover`.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setEditing(false), { enabled: editing });
 *
 * <div ref={ref}>...</div>
 * ```
 */
export function useClickOutside(
  refs: ElementRef | readonly ElementRef[],
  handler: (event: Event) => void,
  { events = ['pointerdown'], enabled = true }: UseClickOutsideOptions = {},
): void {
  const latest = useRef({ refs, handler });
  useEffect(() => {
    latest.current = { refs, handler };
  });

  const eventsKey = events.join(' ');
  useEffect(() => {
    if (!enabled) return undefined;
    function listener(event: Event) {
      const { refs: current, handler: onOutside } = latest.current;
      const list = Array.isArray(current) ? current : [current as ElementRef];
      const nodes = list.map((ref) => ref.current).filter((node): node is Element => node !== null);
      if (nodes.length === 0) return;
      const path = event.composedPath();
      const target = event.target as Node | null;
      const inside = nodes.some(
        (node) => path.includes(node) || (target instanceof Node && node.contains(target)),
      );
      if (!inside) onOutside(event);
    }
    const names = eventsKey.split(' ');
    for (const name of names) document.addEventListener(name, listener, true);
    return () => {
      for (const name of names) document.removeEventListener(name, listener, true);
    };
  }, [eventsKey, enabled]);
}
