import { useId, useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import { hoverCard } from '@var-ui/core/components/hoverCard';
import { findPartId } from '../internal/findPartId';
import {
  composeHandlers,
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
} from '../overlays';
import { mergeProps } from 'typestyles';

export type HoverCardRootProps = {
  children: ReactNode;
  /** Delay before the card opens on hover/focus, in milliseconds. @default 700 */
  openDelay?: number;
  /** Delay before the card closes after the pointer/focus leaves, in milliseconds. @default 300 */
  closeDelay?: number;
  /** Never show the card (hover and focus are ignored). @default false */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the card requests to open or close. Reasons: `hover`, `focus`, `escape-key`, `outside-press`, `imperative`. */
  onOpenChange?: OverlayOpenChangeHandler;
};

/** Alias for docs and consumers referring to the root hover card props. */
export type HoverCardProps = HoverCardRootProps;

export type HoverCardTriggerProps = OverlayTriggerProps;

/**
 * Native props go to the popover `<div role="dialog">`. `HoverCard.Title` names it; otherwise
 * pass `aria-label` / `aria-labelledby`.
 */
export type HoverCardPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'popover'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger: `top|bottom|start|end`, optionally `start|center|end` aligned. @default top */
  placement?: AnchorPlacement;
};

export type HoverCardTitleProps = ComponentPropsWithRef<'h2'>;

export type HoverCardContentProps = ComponentPropsWithRef<'div'>;

type HoverCardContextValue = {
  root: OverlayRoot;
  intent: ReturnType<typeof useHoverIntent>;
  disabled: boolean;
  titleId: string;
};

const { Context: HoverCardContext, use: useHoverCardContext } =
  createOverlayContext<HoverCardContextValue>('HoverCard');

function HoverCardRoot({
  children,
  openDelay = 700,
  closeDelay = 300,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
}: HoverCardRootProps): JSX.Element {
  const root = useOverlayRoot({ native: true, open, defaultOpen, onOpenChange });
  const intent = useHoverIntent(root, { openDelay, closeDelay });
  const titleId = useId();
  const context = useMemo<HoverCardContextValue>(
    () => ({ root, intent, disabled, titleId }),
    [root, intent, disabled, titleId],
  );
  return <HoverCardContext.Provider value={context}>{children}</HoverCardContext.Provider>;
}

function HoverCardTrigger({
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: HoverCardTriggerProps): JSX.Element {
  const { root, intent, disabled } = useHoverCardContext();
  const t = intent.triggerProps;
  const guard =
    <E,>(own: unknown, ours: (event: E) => void) =>
    (event: E) => {
      if (typeof own === 'function') own(event);
      if (!disabled) ours(event);
    };
  return (
    <OverlayTrigger
      {...props}
      root={root}
      relation="details"
      onPointerEnter={guard(onPointerEnter, t.onPointerEnter)}
      onPointerLeave={guard(onPointerLeave, t.onPointerLeave)}
      onFocus={guard(onFocus, t.onFocus)}
      onBlur={guard(onBlur, t.onBlur)}
    />
  );
}

function HoverCardPopup({
  children,
  className,
  placement = 'top',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...rest
}: HoverCardPopupProps): JSX.Element {
  const { root, intent, titleId } = useHoverCardContext();
  const hc = hoverCard();
  // `manual`, as for Tooltip: identical behaviour in every engine (no `hint` support in Safari).
  const pop = usePopoverElement(root, { mode: 'manual' });
  useAnchor(root.triggerEl, root.popupEl, { placement });
  const setRef = useMergedRef<HTMLDivElement>(pop.ref, root.setPopupEl, ref);
  const p = intent.popupProps;

  return (
    <div
      {...rest}
      {...pop.props}
      {...mergeProps(hc.root, className)}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (ariaLabel ? undefined : findPartId(children, HoverCardTitle, titleId))
      }
      onPointerEnter={composeHandlers(onPointerEnter, p.onPointerEnter)}
      onPointerLeave={composeHandlers(onPointerLeave, p.onPointerLeave)}
      onFocus={composeHandlers(onFocus, p.onFocus)}
      onBlur={composeHandlers(onBlur, p.onBlur)}
      ref={setRef}
    >
      {pop.mounted ? children : null}
    </div>
  );
}

function HoverCardTitle({ className, id: idProp, ...rest }: HoverCardTitleProps): JSX.Element {
  const { titleId } = useHoverCardContext();
  const hc = hoverCard();
  return <h2 {...rest} id={idProp ?? titleId} {...mergeProps(hc.title, className)} />;
}

function HoverCardContent({ className, ...rest }: HoverCardContentProps): JSX.Element {
  const hc = hoverCard();
  return <div {...rest} {...mergeProps(hc.content, className)} />;
}

/**
 * Non-modal rich preview shown on hover or focus, with independent open/close delays. Unlike
 * `Popover`, it does not trap focus: the trigger and panel behave like a tooltip that happens to
 * host interactive content (e.g. links). `HoverCard` is Root; compose Trigger and Popup.
 *
 * ```tsx
 * <HoverCard.Root openDelay={700} closeDelay={300}>
 *   <HoverCard.Trigger>
 *     <Link href="/u/ada">@ada</Link>
 *   </HoverCard.Trigger>
 *   <HoverCard.Popup placement="top">
 *     <HoverCard.Title>Ada Lovelace</HoverCard.Title>
 *     <HoverCard.Content>Mathematician and writer.</HoverCard.Content>
 *   </HoverCard.Popup>
 * </HoverCard.Root>
 * ```
 */
export const HoverCard = Object.assign(HoverCardRoot, {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Popup: HoverCardPopup,
  Title: HoverCardTitle,
  Content: HoverCardContent,
});
