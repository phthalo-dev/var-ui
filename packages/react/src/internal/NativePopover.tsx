/**
 * NativePopover: the popup shell for react-aria-components (RAC) triggers that we do not own.
 *
 * RAC's `Popover` portals to `document.body` and positions with JS. Inside a native modal
 * `<dialog>` that portal is inert (not hit-testable), so every RAC popup (Select, ComboBox, Menu,
 * DatePicker, ColorPicker) renders this instead: a `<div popover="manual">` in place, in the top
 * layer, anchored with CSS anchor positioning. It is the ONLY file that reads RAC's contexts.
 *
 * Drop-in: render it exactly where RAC `Popover` was.
 *
 * ```tsx
 * <AriaSelect> ...trigger...
 *   <NativePopover className={s.popover}>
 *     <ListBox>...</ListBox>
 *   </NativePopover>
 * </AriaSelect>
 * ```
 *
 * ## RAC VERSION SENSITIVITY (pinned: react-aria-components 1.19.0, react-aria 3.50.0)
 *
 * This adapter depends on RAC internals that are exported but not specified as a contract. On any
 * RAC upgrade run `NativePopover.browser.test.tsx` and `Select.browser.test.tsx` and re-read the
 * list below against RAC's `Popover.tsx` and the `Provider` blocks of `Select`, `ComboBox`,
 * `MenuTrigger`, `DatePicker`, `DateRangePicker`, `ColorPicker`:
 *
 * 1. `OverlayTriggerStateContext` provides the open state (`isOpen`, `setOpen`, `close`); it is
 *    `null` in RAC's hidden collection tree. We use `null` as the "hidden tree / not under a RAC
 *    trigger" signal and render the children unchanged (RAC builds its collection by rendering
 *    children once inside a `<template>`; the shell must not mount, show or position there).
 *    RAC itself uses the private `useIsHidden`; we deliberately do not import it.
 * 2. `PopoverContext` provides `triggerRef`, `trigger` (`'Select' | 'ComboBox' | 'MenuTrigger' |
 *    'SubmenuTrigger' | 'DatePicker' | 'DateRangePicker' | ...`), `placement`, `isNonModal`
 *    (ComboBox only), `aria-labelledby`, `scrollRef` and `clearContexts` (contexts to reset to
 *    `null` for the content, so the trigger's Button/Label/Text contexts do not leak into it).
 *    We read all of them; an unknown new key is passed to nobody (never spread on the div).
 * 3. RAC `Popover` also rendered `DismissButton`s, an underlay (outside press, scroll lock),
 *    `ariaHideOutside` for the rest of the page, and a `FocusScope` for focus containment/return.
 *    We replace those with: our outside press (`usePopoverElement` manual mode), native top-layer
 *    focus return (`hidePopover()` restores focus), no `aria-hidden` on the rest of the page, no
 *    scroll lock (a `<dialog>` already locks scroll; a bare page may scroll under an open popup).
 *    The visually hidden DismissButtons for screen reader virtual cursors are not rendered.
 * 4. RAC's own Escape/blur dismissal lived in `usePopover -> useOverlay` on the popover element.
 *    We re-implement the same two rules on the shell: `Escape` keydown inside it, and focus moving
 *    to an element outside both the shell and the trigger (`relatedTarget` null is ignored).
 *    For ComboBox the focus stays in the input, which closes itself on Escape; nothing runs here.
 * 5. RAC triggers open on pointerdown and use `state.close()` themselves (selection, Escape in
 *    Menu, ...). We follow `state.isOpen` as the single source of truth and never keep open state.
 * 6. RAC `Popover` renders through react-aria's `Overlay`, whose `ClearPressResponder` stops the
 *    trigger's `PressResponder` (MenuTrigger, DialogTrigger) from merging its handlers and ref
 *    into every pressable inside the popup (without it, the first Menu item REPLACES `triggerRef`
 *    and every item behaves as a trigger). We use the same public `Overlay` from `react-aria`
 *    (an explicit dependency pinned to the version RAC pins), portaled into our own shell, with
 *    focus management off. A second copy of `react-aria` would silently break this.
 * 7. Children must mount only while open (and while the exit animation runs): RAC Menu/ListBox
 *    apply `autoFocus` when they mount, which on an always-mounted hidden shell would focus
 *    nothing useful.
 *
 * What is intentionally not supported: render-prop `children`, `isOpen`/`defaultOpen`/`onOpenChange`
 * standalone use (this is for RAC-owned triggers; use the `Popover` component otherwise),
 * `UNSTABLE_portalContainer`/`portalContainer` (content renders in place), `shouldFlip`,
 * `crossOffset`, `containerPadding`, `maxHeight` (CSS flips and caps).
 */
import { createPortal } from 'react-dom';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
  type ReactNode,
  type Context,
} from 'react';
import {
  OverlayTriggerStateContext,
  PopoverContext,
  useContextProps,
  type PopoverProps as RacPopoverProps,
} from 'react-aria-components';
import { Overlay } from 'react-aria/Overlay';
import { useAnchor, type AnchorPlacement } from '../overlays/useAnchor';
import { useMergedRef } from '../overlays/useMergedRef';
import { useOverlayRoot } from '../overlays/useOverlayRoot';
import { usePopoverElement } from '../overlays/usePopoverElement';

/**
 * RAC's `DialogTrigger`, re-exported so this adapter stays the only file that imports a RAC overlay
 * component (see `nativeOverlayGates.test.ts`). It owns the open state and provides the contexts
 * `NativePopover` reads, for popups whose trigger is not a RAC `Select`/`ComboBox`/`MenuTrigger`.
 */
export { DialogTrigger as NativePopoverTrigger } from 'react-aria-components';

export type NativePopoverProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children?: ReactNode;
  /**
   * Requested placement relative to the trigger: a side (`top|bottom|start|end`), optionally with
   * an alignment (`bottom end`). Defaults to RAC's own default for the trigger (`bottom start`).
   */
  placement?: AnchorPlacement;
  /** Gap between trigger and popup: a number is px, a string any CSS length. */
  offset?: number | string;
  /**
   * Size the popup to the trigger with `anchor-size(width)`: `true`/`'exact'` is the trigger's
   * width, `'min'` is a minimum. Recipes usually do this in CSS already; this is for popups whose
   * recipe does not.
   */
  matchWidth?: boolean | 'exact' | 'min';
  /**
   * Overrides RAC's modality (`true` for ComboBox: focus stays in the input, so the shell takes no
   * role/focus). When `false` the shell is `role="dialog"` unless the content has its own.
   */
  isNonModal?: boolean;
};

/** The fields RAC puts in `PopoverContext` (a subset of `PopoverProps`) that we read. */
type RacPopoverContextProps = Pick<
  RacPopoverProps,
  'trigger' | 'triggerRef' | 'isNonModal' | 'shouldCloseOnInteractOutside'
> & {
  clearContexts?: Array<Context<unknown>>;
  'aria-labelledby'?: string;
  scrollRef?: unknown;
};

const SIDES = new Set(['top', 'bottom', 'start', 'end']);
const ALIGNS = new Set(['start', 'center', 'end']);

/** RAC placements (`'bottom start'`, `'end top'`, `'left'`) to ours; unknown values -> default. */
export function toAnchorPlacement(placement: string | undefined): AnchorPlacement {
  const [side = '', align = ''] = (placement ?? '').split(' ');
  const mappedSide = side === 'left' ? 'start' : side === 'right' ? 'end' : side;
  if (!SIDES.has(mappedSide)) return 'bottom start';
  const mappedAlign =
    align === 'top' || align === 'left'
      ? 'start'
      : align === 'bottom' || align === 'right'
        ? 'end'
        : align;
  return (ALIGNS.has(mappedAlign) ? `${mappedSide} ${mappedAlign}` : mappedSide) as AnchorPlacement;
}

/**
 * Renders RAC popup content in a native `[popover=manual]` shell. Outside a RAC trigger (or in
 * RAC's hidden collection pass) it renders `children` unchanged.
 */
export function NativePopover(props: NativePopoverProps): JSX.Element {
  const state = useContext(OverlayTriggerStateContext);
  if (!state) return <>{props.children}</>;
  return <NativePopoverShell {...props} state={state} />;
}

type OverlayTriggerState = NonNullable<React.ContextType<typeof OverlayTriggerStateContext>>;

function NativePopoverShell({
  state,
  ...rawProps
}: NativePopoverProps & { state: OverlayTriggerState }): JSX.Element {
  const [merged, racRef] = useContextProps(
    rawProps as Record<string, unknown>,
    rawProps.ref as never,
    PopoverContext as never,
  ) as unknown as [NativePopoverProps & RacPopoverContextProps, React.RefObject<HTMLDivElement>];
  const {
    children,
    placement,
    offset,
    matchWidth,
    isNonModal,
    trigger,
    triggerRef,
    clearContexts,
    scrollRef: _scrollRef,
    // RAC's submenu rule "the parent item is not outside": our outside press already excludes the
    // trigger element, so the prop is only removed from the DOM spread.
    shouldCloseOnInteractOutside: _shouldCloseOnInteractOutside,
    'aria-labelledby': labelledBy,
    onKeyDown,
    onBlur,
    style,
    ref: _ref,
    ...rest
  } = merged;

  // RAC state is the source of truth; the root mirrors it (controlled) so the shared popover hook
  // can drive `showPopover()`, anchor and outside press.
  const root = useOverlayRoot({
    open: state.isOpen,
    onOpenChange: (next) => state.setOpen(next),
  });
  const { setTriggerEl } = root;
  // RAC's `triggerRef` is a ref object (a getter for ComboBox/DatePicker): sample it each commit.
  useLayoutEffect(() => {
    setTriggerEl((triggerRef?.current as HTMLElement | null | undefined) ?? null);
  });

  const latestOpen = useRef(state.isOpen);
  latestOpen.current = state.isOpen;
  const latestState = useRef(state);
  latestState.current = state;
  const openAtDown = useRef(false);
  const pop = usePopoverElement(root, { mode: 'manual', escape: false });
  useAnchor(root.triggerEl, root.popupEl, {
    placement: toAnchorPlacement(placement),
    offset,
  });
  const ref = useMergedRef<HTMLDivElement>(racRef, pop.ref);

  // Focus return. RAC's `FocusScope restoreFocus` is gone and a native popover only restores
  // focus when it moved it itself, so: remember the focused element at open, and after close put
  // focus back there if it is still inside the popup (or lost to `body`). A press that moved focus
  // elsewhere (outside click on a button) is left alone. Done in a passive effect: while the exit
  // runs, RAC's still-mounted focused option may re-focus itself during the close commit.
  const origin = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (state.isOpen) origin.current = document.activeElement as HTMLElement | null;
  }, [state.isOpen]);
  useEffect(() => {
    if (state.isOpen) return;
    const target = origin.current;
    origin.current = null;
    const el = pop.element;
    if (!target?.isConnected || target === document.body) return;
    const active = document.activeElement;
    if (active === document.body || (el?.contains(active) && active !== target)) {
      target.focus({ preventScroll: true });
    }
  }, [state.isOpen, pop.element]);

  // RAC rule: the popover is a `role="dialog"` (focused on mount unless focus is already inside)
  // unless it is non-modal or the content brings its own dialog.
  const shouldBeDialog = !isNonModal;
  const [isDialog, setDialog] = useState(false);
  useLayoutEffect(() => {
    const el = pop.element;
    if (el) setDialog(shouldBeDialog && !el.querySelector('[role=dialog]'));
  }, [pop.element, pop.mounted, shouldBeDialog]);
  useLayoutEffect(() => {
    const el = pop.element;
    if (isDialog && state.isOpen && el && !el.contains(document.activeElement)) {
      el.focus({ preventScroll: true });
    }
  }, [isDialog, state.isOpen, pop.element]);

  // Pressing the trigger while open closes the popup. RAC opens on pointerdown (`state.open()`,
  // not a toggle) and used to close through the popover's interact-outside, so: if it was open at
  // pointerdown and still is at the click (RAC toggles by itself for ComboBox/DatePicker/touch),
  // close. Text inputs inside the trigger (ComboBox) are not toggles.
  useEffect(() => {
    if (!state.isOpen) return undefined;
    const inTrigger = (target: EventTarget | null) =>
      target instanceof Element && !!triggerRef?.current?.contains(target);
    const onDown = (event: PointerEvent) => {
      openAtDown.current = inTrigger(event.target);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!openAtDown.current || !inTrigger(target)) return;
      openAtDown.current = false;
      if (target?.closest('input, textarea, [contenteditable], [role="textbox"]')) return;
      if (latestOpen.current) {
        // Swallow the click: triggers that open on the click itself (DatePicker's button,
        // a plain `Button` with `onPress`) would otherwise reopen right after this close.
        event.stopPropagation();
        latestState.current.close();
      }
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [state.isOpen, triggerRef]);

  // Non-modal popups (ComboBox) keep focus in the trigger's input, so Escape never reaches the
  // shell. RAC's input handler closes the list but does not cancel the key, and an enclosing
  // modal `<dialog>` would also treat it as `cancel`. Cancel the default (not propagation: RAC
  // still has to see the key to revert the input) while this popup is open.
  useEffect(() => {
    const el = triggerRef?.current as HTMLElement | null | undefined;
    if (!state.isOpen || !isNonModal || !(el instanceof HTMLElement)) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [state.isOpen, isNonModal, triggerRef]);

  const content = useMemo(() => {
    let node: ReactNode = children;
    for (const Ctx of clearContexts ?? []) {
      node = <Ctx.Provider value={null}>{node}</Ctx.Provider>;
    }
    return node;
  }, [children, clearContexts]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    // Not gated on `defaultPrevented`: RAC widgets inside (RangeCalendar) prevent Escape to cancel
    // their own state but RAC's `useOverlay` closed the popover regardless.
    if (event.key !== 'Escape' || event.nativeEvent.isComposing) return;
    // Like RAC's `useOverlay`: Escape inside the popup closes it, and stops here so an enclosing
    // modal `<dialog>` (native `cancel`) or popover does not also close.
    event.stopPropagation();
    event.preventDefault();
    state.close();
  };
  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    const next = event.relatedTarget;
    if (!(next instanceof Node)) return; // focus to nowhere (clicked padding, window blur)
    if (event.currentTarget.contains(next) || triggerRef?.current?.contains(next)) return;
    state.close();
  };

  const widthStyle: CSSProperties | undefined = matchWidth
    ? matchWidth === 'min'
      ? { boxSizing: 'border-box', minWidth: 'anchor-size(width)' }
      : { boxSizing: 'border-box', width: 'anchor-size(width)', minWidth: 'anchor-size(width)' }
    : undefined;

  // A submenu shell must not be a DOM descendant of its parent `role=menu` element: RAC treats
  // focus entering `parentMenuRef` (other than the trigger item) as "moved to another item" and
  // closes the submenu. React renders `SubmenuTrigger`'s popup inside the menu, so portal the
  // shell into the nearest enclosing popover shell (the parent's), which still contains it for the
  // parent's outside-press and blur rules.
  const [parentShell, setParentShell] = useState<Element | null>(null);
  useLayoutEffect(() => {
    if (trigger !== 'SubmenuTrigger') return;
    const host = (triggerRef?.current as Element | null | undefined)?.closest('[popover]') ?? null;
    setParentShell((current) => (current === host ? current : host));
  });

  const shell = (
    <div
      {...rest}
      {...pop.props}
      ref={ref}
      role={isDialog ? 'dialog' : undefined}
      tabIndex={isDialog ? -1 : undefined}
      aria-labelledby={labelledBy}
      data-trigger={trigger}
      data-open={state.isOpen || undefined}
      data-closed={state.isOpen ? undefined : ''}
      style={widthStyle ? { ...widthStyle, ...style } : style}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {pop.mounted && pop.element ? (
        <Overlay portalContainer={pop.element} disableFocusManagement>
          {content}
        </Overlay>
      ) : null}
    </div>
  );
  return parentShell ? createPortal(shell, parentShell) : shell;
}
