import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  type Placement,
} from 'react-aria-components';
import { Popover as AriaPopover } from '../internal/nativeDialogShim';
import { hoverCard } from '@var-ui/core/components/hoverCard';
import { useLayer } from '../layers/LayerProvider';
import {
  composeHandlers,
  createOverlayContext,
  OverlayTrigger,
  useHoverIntent,
  useMergedRef,
  useOverlayRoot,
  usePositionerVars,
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
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the card requests to open or close. Reasons: `hover`, `focus`, `escape-key`, `outside-press`, `imperative`. */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the card portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root hover card props. */
export type HoverCardProps = HoverCardRootProps;

export type HoverCardTriggerProps = OverlayTriggerProps;

/**
 * Native props go to the popover `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * dialog element. When `HoverCard.Title` is rendered it names the dialog, otherwise pass
 * `aria-label` / `aria-labelledby`.
 */
export type HoverCardPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
};

export type HoverCardTitleProps = ComponentPropsWithRef<'h2'>;

export type HoverCardContentProps = ComponentPropsWithRef<'div'>;

type HoverCardContextValue = {
  root: OverlayRoot;
  portalContainer?: Element;
  scheduleOpen: ReturnType<typeof useHoverIntent>['scheduleOpen'];
  scheduleClose: ReturnType<typeof useHoverIntent>['scheduleClose'];
  cancel: ReturnType<typeof useHoverIntent>['cancel'];
};

const { Context: HoverCardContext, use: useHoverCardContext } =
  createOverlayContext<HoverCardContextValue>('HoverCard');

function HoverCardRoot({
  children,
  openDelay = 700,
  closeDelay = 300,
  open,
  defaultOpen,
  onOpenChange,
  portalContainer,
}: HoverCardRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const { scheduleOpen, scheduleClose, cancel } = useHoverIntent(root, { openDelay, closeDelay });
  const context = useMemo<HoverCardContextValue>(
    () => ({ root, portalContainer, scheduleOpen, scheduleClose, cancel }),
    [root, portalContainer, scheduleOpen, scheduleClose, cancel],
  );

  return (
    <HoverCardContext.Provider value={context}>
      <AriaDialogTrigger {...root.rac}>{children}</AriaDialogTrigger>
    </HoverCardContext.Provider>
  );
}

function HoverCardTrigger({
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: HoverCardTriggerProps): JSX.Element {
  const ctx = useHoverCardContext();
  return (
    <OverlayTrigger
      {...props}
      root={ctx.root}
      mode="none"
      onMouseEnter={composeHandlers(onMouseEnter, (e: unknown) =>
        ctx.scheduleOpen({ event: e as { nativeEvent?: Event }, reason: 'hover' }),
      )}
      onMouseLeave={composeHandlers(onMouseLeave, (e: unknown) =>
        ctx.scheduleClose({ event: e as { nativeEvent?: Event }, reason: 'hover' }),
      )}
      onFocus={composeHandlers(onFocus, (e: unknown) =>
        ctx.scheduleOpen({ event: e as { nativeEvent?: Event }, reason: 'focus' }),
      )}
      onBlur={composeHandlers(onBlur, (e: unknown) =>
        ctx.scheduleClose({ event: e as { nativeEvent?: Event }, reason: 'focus' }),
      )}
    />
  );
}

function HoverCardPopup({
  children,
  className,
  style,
  placement = 'top',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onMouseEnter,
  onMouseLeave,
  ref,
  ...rest
}: HoverCardPopupProps): JSX.Element {
  const { root, portalContainer, scheduleClose, cancel } = useHoverCardContext();
  const hc = hoverCard();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: root.popupRef,
    triggerRef: root.triggerRef,
  });
  const setRef = useMergedRef<HTMLDivElement>(root.setPopupEl, ref);
  const leave = (e: unknown, reason: 'hover' | 'focus') =>
    scheduleClose({ event: e as { nativeEvent?: Event }, reason });

  return (
    <AriaPopover
      {...rest}
      {...mergeProps(hc.root, className)}
      {...root.presenceAttrs}
      {...root.rac}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      isNonModal
      UNSTABLE_portalContainer={portalContainer}
      onMouseEnter={composeHandlers(onMouseEnter, cancel)}
      onMouseLeave={composeHandlers(onMouseLeave, (e: unknown) => leave(e, 'hover'))}
    >
      <AriaDialog aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
        {/*
         * `onFocus`/`onBlur` aren't part of RAC's `Dialog`/`Popover` DOM prop allowlist (they're
         * only exposed on focusable elements), so a plain wrapper div carries the panel's
         * hover/focus retention logic. `Heading[slot="title"]` still wires up via React context
         * regardless of this extra nesting.
         */}
        <div
          onMouseEnter={cancel}
          onMouseLeave={(e) => leave(e, 'hover')}
          onFocus={cancel}
          onBlur={(e) => leave(e, 'focus')}
        >
          {children}
        </div>
      </AriaDialog>
    </AriaPopover>
  );
}

function HoverCardTitle({ className, children, ...rest }: HoverCardTitleProps): JSX.Element {
  const hc = hoverCard();
  return (
    <Heading {...rest} slot="title" {...mergeProps(hc.title, className)}>
      {children}
    </Heading>
  );
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
