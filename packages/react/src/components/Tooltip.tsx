import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import { tooltip } from '@var-ui/core/components/tooltip';
import {
  createOverlayContext,
  OverlayTrigger,
  useAnchor,
  useHoverIntent,
  useMergedRef,
  useOverlayRoot,
  usePopoverElement,
  type AnchorPlacement,
  type OverlayOpenChangeHandler,
  type OverlayRoot,
  type OverlayTriggerProps,
  type PopoverElement,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type TooltipRootProps = {
  children: ReactNode;
  /** Delay before the tooltip opens on hover or keyboard focus, in milliseconds. @default 500 */
  openDelay?: number;
  /** Delay before the tooltip closes after the pointer or focus leaves, in milliseconds. @default 0 */
  closeDelay?: number;
  /** Never show the tooltip (hover and focus are ignored). @default false */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip requests to open or close. Reasons: `hover`, `focus`, `escape-key`, `outside-press`, `imperative`. */
  onOpenChange?: OverlayOpenChangeHandler;
};

/** Alias for docs and consumers referring to the root tooltip props. */
export type TooltipProps = TooltipRootProps;

export type TooltipTriggerProps = OverlayTriggerProps;

/** Native props go to the popover `<div>` (`role="tooltip"`). */
export type TooltipPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'popover'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger: `top|bottom|start|end`, optionally `start|center|end` aligned. @default top */
  placement?: AnchorPlacement;
};

type TooltipContextValue = {
  root: OverlayRoot;
  intent: ReturnType<typeof useHoverIntent>;
  disabled: boolean;
};

const { Context: TooltipContext, use: useTooltipContext } =
  createOverlayContext<TooltipContextValue>('Tooltip');

function TooltipRoot({
  children,
  openDelay = 500,
  closeDelay = 0,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipRootProps): JSX.Element {
  const root = useOverlayRoot({ native: true, open, defaultOpen, onOpenChange });
  // Hover intent: delays, focus-visible, touch ignored, Escape (WCAG 1.4.13), and a warm-up window
  // shared by every tooltip.
  const intent = useHoverIntent(root, { openDelay, closeDelay, warmUp: true });
  const context = useMemo<TooltipContextValue>(
    () => ({ root, intent, disabled }),
    [root, intent, disabled],
  );
  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>;
}

function TooltipTriggerPart({
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps): JSX.Element {
  const { root, intent, disabled } = useTooltipContext();
  const t = intent.triggerProps;
  const guard = <E,>(own: unknown, ours: (event: E) => void) => {
    return (event: E) => {
      if (typeof own === 'function') own(event);
      if (!disabled) ours(event);
    };
  };
  return (
    <OverlayTrigger
      {...props}
      root={root}
      relation="describedby"
      onPointerEnter={guard(onPointerEnter, t.onPointerEnter)}
      onPointerLeave={guard(onPointerLeave, t.onPointerLeave)}
      onFocus={guard(onFocus, t.onFocus)}
      onBlur={guard(onBlur, t.onBlur)}
    />
  );
}

function TooltipPopup({
  children,
  className,
  placement = 'top',
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TooltipPopupProps): JSX.Element {
  const { root, intent } = useTooltipContext();
  const tip = tooltip();
  // `manual` on purpose, not `hint`: Safari has no `hint`, and `hint` adds its own light dismiss
  // and closes other hints, so one behaviour (ours) everywhere.
  const pop: PopoverElement = usePopoverElement(root, { mode: 'manual' });
  useAnchor(root.triggerEl, root.popupEl, { placement });
  const setRef = useMergedRef<HTMLDivElement>(pop.ref, root.setPopupEl, ref);
  const p = intent.popupProps;
  const both =
    <E,>(own: unknown, ours: (event: E) => void) =>
    (event: E) => {
      if (typeof own === 'function') own(event);
      ours(event);
    };

  return (
    <div
      {...rest}
      {...pop.props}
      {...mergeProps(tip.root, className)}
      role="tooltip"
      onPointerEnter={both(onPointerEnter, p.onPointerEnter)}
      onPointerLeave={both(onPointerLeave, p.onPointerLeave)}
      onFocus={both(onFocus, p.onFocus)}
      onBlur={both(onBlur, p.onBlur)}
      ref={setRef}
    >
      {pop.mounted ? children : null}
    </div>
  );
}

/**
 * Compound tooltip. `Tooltip` is Root; compose Trigger and Popup.
 *
 * ```tsx
 * <Tooltip.Root openDelay={500}>
 *   <Tooltip.Trigger>
 *     <button type="button">Info</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
 * </Tooltip.Root>
 * ```
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTriggerPart,
  Popup: TooltipPopup,
});
