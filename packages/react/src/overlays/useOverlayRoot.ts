import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type RefCallback,
} from 'react';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  type OverlayChangeEventDetails,
  type OverlayOpenChangeHandler,
  type OverlayOpenChangeReason,
} from './changeEvent';
import { useOverlayPresence, type OverlayPresenceAttrs } from './useOverlayPresence';

export type UseOverlayRootOptions = {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the overlay requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Overrides the `prefers-reduced-motion` sample used by the exit animation wait. */
  reducedMotion?: boolean;
};

/** Optional explicit cause of a change; wins over anything observed from the DOM. */
export type OverlayRequestOptions = {
  reason?: OverlayOpenChangeReason;
  event?: Event | null;
};

/** What a react-aria overlay (`DialogTrigger`, `ModalOverlay`, `Popover`, ...) needs. */
export type OverlayRacProps = {
  /** `true` from the moment the overlay opens until its exit animation has finished. */
  isOpen: boolean;
  onOpenChange: (next: boolean) => void;
};

export type OverlayRoot = {
  /** The requested open state (flips immediately on open and close). */
  open: boolean;
  /** `true` while the overlay must stay in the tree: `open` plus the exit animation. */
  mounted: boolean;
  /** `data-open`, `data-closed`, `data-starting-style` and `data-ending-style` for the parts. */
  presenceAttrs: OverlayPresenceAttrs;
  /** Spread on the react-aria overlay: `isOpen={mounted}` and a details-aware change handler. */
  rac: OverlayRacProps;
  /**
   * Requests a change with an explicit cause (`'imperative'` unless given). Returns `false` when
   * the handler vetoed it with `details.cancel()` or nothing would change.
   */
  setOpen: (next: boolean, options?: OverlayRequestOptions) => boolean;
  /** `setOpen(false, options)`; this is what `OverlayCloseContext` carries. */
  close: (options?: OverlayRequestOptions) => boolean;
  /** Stable callback refs: pass to the element (or merge with `useMergedRef`). */
  setPopupEl: RefCallback<HTMLElement>;
  setTriggerEl: RefCallback<HTMLElement>;
  setBackdropEl: RefCallback<HTMLElement>;
  /** Elements, as state: they re-render the root when they attach, so layout can read them. */
  popupEl: HTMLElement | null;
  triggerEl: HTMLElement | null;
  /** Ref objects mirroring the elements, for APIs that want a `RefObject` (`usePositionerVars`). */
  popupRef: MutableRefObject<HTMLElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

type Stash = { event: Event | null; reason?: OverlayOpenChangeReason; at?: number };

const TRIGGER_KEYS = new Set(['Enter', ' ', 'ArrowDown', 'ArrowUp']);

function contains(el: Element | null, target: EventTarget | null): boolean {
  return el !== null && target instanceof Node && el.contains(target);
}

function useElementState() {
  const ref = useRef<HTMLElement | null>(null);
  const [el, setEl] = useState<HTMLElement | null>(null);
  const set = useCallback<RefCallback<HTMLElement>>((node) => {
    ref.current = node;
    // Detach keeps the last element in state on purpose: setting `null` here would re-render
    // (null then node) whenever a merged callback ref is re-created, and listeners on a detached
    // element are harmless. The ref object is exact.
    if (node) setEl((current) => (current === node ? current : node));
  }, []);
  return [el, ref, set] as const;
}

/**
 * The shared root of every overlay: controllable `open`, a details-aware `onOpenChange`, exit
 * presence, element tracking, and close-reason derivation.
 *
 * The reason of a change comes from, in order: an explicit `setOpen(next, {reason})`; the last
 * DOM event the hook observed with native listeners (document `keydown` Escape, `pointerdown`
 * outside the popup and trigger, `focusout` leaving them; on the trigger `pointerdown`, `click`,
 * Enter/Space/Arrow keys, `pointerenter/leave`, `focusin/out`; on the popup `pointerleave`);
 * otherwise `'unknown'`. No wrapper element is needed. The observed event is consumed by the
 * change it caused.
 */
export function useOverlayRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  reducedMotion,
}: UseOverlayRootOptions = {}): OverlayRoot {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = openProp ?? uncontrolledOpen;

  const [popupEl, popupRef, setPopupEl] = useElementState();
  const [triggerEl, triggerRef, setTriggerEl] = useElementState();
  const [, backdropRef, setBackdropEl] = useElementState();

  const presence = useOverlayPresence({
    isOpen: open,
    reducedMotion,
    getAnimatedElements: () => [backdropRef.current, popupRef.current],
  });
  const { mounted } = presence;

  const latest = useRef({ open, isControlled, onOpenChange });
  useLayoutEffect(() => {
    latest.current = { open, isControlled, onOpenChange };
  });
  const stashRef = useRef<Stash | null>(null);

  const setOpen = useCallback((next: boolean, options?: OverlayRequestOptions): boolean => {
    const stash = stashRef.current;
    stashRef.current = null;
    const { open: current, isControlled: controlled, onOpenChange: handler } = latest.current;
    if (next === current) return false;
    const event = options?.event ?? stash?.event ?? null;
    const details: OverlayChangeEventDetails = createOverlayChangeDetails({
      reason:
        options?.reason ?? stash?.reason ?? (event ? inferOverlayCloseReason(event) : 'unknown'),
      event,
    });
    handler?.(next, details);
    if (details.isCanceled) return false;
    if (!controlled) setUncontrolledOpen(next);
    return true;
  }, []);

  // Calls from our own code are programmatic unless they say otherwise; react-aria's go through `rac`.
  const setOpenPublic = useCallback(
    (next: boolean, options?: OverlayRequestOptions) =>
      setOpen(next, { reason: 'imperative', ...options }),
    [setOpen],
  );
  const close = useCallback(
    (options?: OverlayRequestOptions) => setOpenPublic(false, options),
    [setOpenPublic],
  );
  const onRacOpenChange = useCallback((next: boolean) => void setOpen(next), [setOpen]);

  // Trigger and popup listeners: native, so they work for react-aria children that drop DOM props.
  useEffect(() => {
    const stash = (event: Event, reason: OverlayOpenChangeReason) => {
      // A press moves focus to the trigger as part of the same gesture (react-aria's menu trigger
      // opens on pointerdown and focuses itself): the press stays the cause.
      const current = stashRef.current;
      if (
        reason === 'focus' &&
        current?.reason === 'trigger-press' &&
        event.timeStamp - (current.at ?? 0) < 100
      ) {
        return;
      }
      stashRef.current = { event, reason, at: event.timeStamp };
    };
    const cleanups: Array<() => void> = [];
    const on = <E extends Event>(
      el: HTMLElement | null,
      type: string,
      handler: (event: E) => void,
    ) => {
      if (!el) return;
      el.addEventListener(type, handler as EventListener);
      cleanups.push(() => el.removeEventListener(type, handler as EventListener));
    };
    on(triggerEl, 'pointerdown', (e) => stash(e, 'trigger-press'));
    on(triggerEl, 'click', (e) => stash(e, 'trigger-press'));
    on<KeyboardEvent>(triggerEl, 'keydown', (e) => {
      if (TRIGGER_KEYS.has(e.key)) stash(e, 'trigger-press');
    });
    on(triggerEl, 'pointerenter', (e) => stash(e, 'hover'));
    on(triggerEl, 'pointerleave', (e) => stash(e, 'hover'));
    on(triggerEl, 'focusin', (e) => stash(e, 'focus'));
    on(triggerEl, 'focusout', (e) => stash(e, 'focus'));
    on(popupEl, 'pointerleave', (e) => stash(e, 'hover'));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [triggerEl, popupEl]);

  // Document listeners while the overlay is in the tree.
  useEffect(() => {
    if (!mounted) return;
    const outside = (target: EventTarget | null) =>
      !contains(popupRef.current, target) && !contains(triggerRef.current, target);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stashRef.current = { event, reason: 'escape-key' };
    };
    const onPointerDown = (event: PointerEvent) => {
      if (outside(event.target)) stashRef.current = { event, reason: 'outside-press' };
    };
    const onFocusOut = (event: FocusEvent) => {
      const from = event.target;
      const to = event.relatedTarget;
      const leaving = !outside(from) && outside(to);
      if (leaving && to !== null) stashRef.current = { event, reason: 'focus' };
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focusout', onFocusOut, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('focusout', onFocusOut, true);
    };
  }, [mounted, popupRef, triggerRef]);

  const rac = useMemo<OverlayRacProps>(
    () => ({ isOpen: mounted, onOpenChange: onRacOpenChange }),
    [mounted, onRacOpenChange],
  );

  return useMemo<OverlayRoot>(
    () => ({
      open,
      mounted,
      presenceAttrs: presence.attrs,
      rac,
      setOpen: setOpenPublic,
      close,
      setPopupEl,
      setTriggerEl,
      setBackdropEl,
      popupEl,
      triggerEl,
      popupRef,
      triggerRef,
    }),
    [
      open,
      mounted,
      presence.attrs,
      rac,
      setOpenPublic,
      close,
      setPopupEl,
      setTriggerEl,
      setBackdropEl,
      popupEl,
      triggerEl,
      popupRef,
      triggerRef,
    ],
  );
}
