import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  Popover as AriaPopover,
  type Placement,
} from 'react-aria-components';
import { hoverCard } from '@var-ui/core/components/hoverCard';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  useMergedRef,
  useOverlayPresence,
  usePositionerVars,
  type OverlayOpenChangeHandler,
  type OverlayTriggerProps,
  type UseOverlayPresenceResult,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type HoverCardProps = {
  /** Single focusable trigger element (e.g. a link or avatar). */
  trigger: ReactElement;
  /** Optional heading shown at the top of the card. */
  title?: ReactNode;
  /** Rich preview content — may contain interactive elements such as links. */
  children: ReactNode;
  /** Delay before the card opens on hover/focus, in milliseconds. @default 700 */
  openDelay?: number;
  /** Delay before the card closes after the pointer/focus leaves, in milliseconds. @default 300 */
  closeDelay?: number;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
  /**
   * Element the card portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
  /** Accessible name for the card when no `title` is given. */
  'aria-label'?: string;
  /** Id of an element that names the card; takes precedence over `title`. */
  'aria-labelledby'?: string;
};

export type HoverCardRootProps = {
  children: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  portalContainer?: Element;
};

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
  portalContainer?: Element;
};

export type HoverCardTitleProps = ComponentPropsWithRef<'h2'>;

export type HoverCardContentProps = ComponentPropsWithRef<'div'>;

function composeHandler(existing: unknown, ours: (...args: unknown[]) => void) {
  if (typeof existing !== 'function') {
    return ours;
  }
  return (...args: unknown[]) => {
    existing(...args);
    ours(...args);
  };
}

function callIfFn(fn: unknown, args: unknown[]) {
  if (typeof fn === 'function') fn(...args);
}

type HoverCardContextValue = {
  presence: UseOverlayPresenceResult;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  setPopupEl: (element: HTMLDivElement | null) => void;
  setTriggerEl: (element: HTMLElement | null) => void;
  portalContainer?: Element;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelCloseTimer: () => void;
};

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext(): HoverCardContextValue {
  const ctx = useContext(HoverCardContext);
  if (!ctx) {
    throw new Error('HoverCard compound components must be rendered inside <HoverCard>.');
  }
  return ctx;
}

function HoverCardRoot({
  children,
  openDelay = 700,
  closeDelay = 300,
  open,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: HoverCardRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = open ?? uncontrolledOpen;
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setPopupEl] = useState<HTMLDivElement | null>(null);
  const [, setTriggerEl] = useState<HTMLElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);
  const mountedRef = useRef(true);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [popupRef.current],
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!mountedRef.current) return;
      const details = createOverlayChangeDetails({
        reason: inferOverlayCloseReason(lastEventRef.current),
        event: lastEventRef.current,
      });
      onOpenChange?.(next, details);
      lastEventRef.current = null;
      if (details.isCanceled) return;
      if (open === undefined) setRequestedOpen(next);
    },
    [open, onOpenChange],
  );

  const cancelOpenTimer = useCallback(() => {
    if (openTimer.current !== undefined) {
      clearTimeout(openTimer.current);
      openTimer.current = undefined;
    }
  }, []);

  const cancelCloseTimer = useCallback(() => {
    if (closeTimer.current !== undefined) {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const stashScheduleEvent = useCallback((...args: unknown[]) => {
    const event = args[0] as { nativeEvent?: Event } | Event | undefined;
    if (event instanceof Event) {
      lastEventRef.current = event;
      return;
    }
    if (event?.nativeEvent instanceof Event) {
      lastEventRef.current = event.nativeEvent;
      return;
    }
  }, []);

  const scheduleOpen = useCallback(
    (...args: unknown[]) => {
      stashScheduleEvent(...args);
      if (!lastEventRef.current) {
        lastEventRef.current = new Event('hover');
      }
      cancelCloseTimer();
      cancelOpenTimer();
      openTimer.current = setTimeout(() => {
        handleOpenChange(true);
      }, openDelay);
    },
    [cancelCloseTimer, cancelOpenTimer, handleOpenChange, openDelay, stashScheduleEvent],
  );

  const scheduleClose = useCallback(
    (...args: unknown[]) => {
      stashScheduleEvent(...args);
      if (!lastEventRef.current) {
        lastEventRef.current = new Event('hover');
      }
      cancelOpenTimer();
      cancelCloseTimer();
      closeTimer.current = setTimeout(() => {
        handleOpenChange(false);
      }, closeDelay);
    },
    [cancelCloseTimer, cancelOpenTimer, closeDelay, handleOpenChange, stashScheduleEvent],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelOpenTimer();
      cancelCloseTimer();
    };
  }, [cancelCloseTimer, cancelOpenTimer]);

  const context = useMemo<HoverCardContextValue>(
    () => ({
      presence,
      popupRef,
      triggerRef,
      setPopupEl,
      setTriggerEl,
      portalContainer,
      lastEventRef,
      handleOpenChange,
      scheduleOpen,
      scheduleClose,
      cancelCloseTimer,
    }),
    [cancelCloseTimer, handleOpenChange, portalContainer, presence, scheduleClose, scheduleOpen],
  );

  return (
    <HoverCardContext.Provider value={context}>
      <AriaDialogTrigger isOpen={presence.mounted} onOpenChange={handleOpenChange}>
        {children}
      </AriaDialogTrigger>
    </HoverCardContext.Provider>
  );
}

function HoverCardTrigger({
  children,
  className,
  ref,
  ...props
}: HoverCardTriggerProps): JSX.Element {
  const ctx = useHoverCardContext();
  const child = Children.only(children);
  const childProps = child.props as Record<string, unknown>;
  const assignTriggerEl = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    ctx.setTriggerEl(node);
  };
  const triggerProps = props as Record<string, unknown>;
  const merged = mergeOverlayChild(child, {
    ...triggerProps,
    className,
    ref: (node: HTMLElement | null) => {
      assignTriggerEl(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: composeHandler(
      composeHandler(childProps.onMouseEnter, (...args) =>
        callIfFn(triggerProps.onMouseEnter, args),
      ),
      ctx.scheduleOpen,
    ),
    onMouseLeave: composeHandler(
      composeHandler(childProps.onMouseLeave, (...args) =>
        callIfFn(triggerProps.onMouseLeave, args),
      ),
      ctx.scheduleClose,
    ),
    onFocus: composeHandler(
      composeHandler(childProps.onFocus, (...args) => callIfFn(triggerProps.onFocus, args)),
      ctx.scheduleOpen,
    ),
    onBlur: composeHandler(
      composeHandler(childProps.onBlur, (...args) => callIfFn(triggerProps.onBlur, args)),
      ctx.scheduleClose,
    ),
  });
  return merged;
}

function HoverCardPopup({
  children,
  className,
  style,
  placement = 'top',
  portalContainer,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onMouseEnter,
  onMouseLeave,
  ref,
  ...rest
}: HoverCardPopupProps): JSX.Element {
  const ctx = useHoverCardContext();
  const hc = hoverCard();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });
  const setRef = useMergedRef(ctx.popupRef, ref, ctx.setPopupEl);

  return (
    <AriaPopover
      {...rest}
      {...mergeProps(hc.root, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      isOpen={ctx.presence.mounted}
      isNonModal
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
      onMouseEnter={composeHandler(onMouseEnter, ctx.cancelCloseTimer)}
      onMouseLeave={composeHandler(onMouseLeave, ctx.scheduleClose)}
    >
      <AriaDialog aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
        {/*
         * `onFocus`/`onBlur` aren't part of RAC's `Dialog`/`Popover` DOM prop allowlist (they're
         * only exposed on focusable elements), so a plain wrapper div carries the panel's
         * hover/focus retention logic. `Heading[slot="title"]` still wires up via React context
         * regardless of this extra nesting.
         */}
        <div
          onMouseEnter={ctx.cancelCloseTimer}
          onMouseLeave={ctx.scheduleClose}
          onFocus={ctx.cancelCloseTimer}
          onBlur={ctx.scheduleClose}
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

function HoverCardPreset({
  trigger,
  title,
  children,
  openDelay = 700,
  closeDelay = 300,
  placement = 'top',
  portalContainer,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: HoverCardProps): JSX.Element {
  return (
    <HoverCardRoot openDelay={openDelay} closeDelay={closeDelay} portalContainer={portalContainer}>
      <HoverCardTrigger>{trigger}</HoverCardTrigger>
      <HoverCardPopup
        placement={placement}
        portalContainer={portalContainer}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {title ? <HoverCardTitle>{title}</HoverCardTitle> : null}
        <HoverCardContent>{children}</HoverCardContent>
      </HoverCardPopup>
    </HoverCardRoot>
  );
}

/**
 * Non-modal rich preview shown on hover or focus, with independent open/close delays. Unlike
 * `Popover`, it does not trap focus — the trigger and panel behave like a tooltip that happens to
 * host interactive content (e.g. links). `HoverCard` is the assembled preset; compose
 * `HoverCard.Root` / `Trigger` / `Popup` for custom chrome.
 */
export const HoverCard = Object.assign(HoverCardPreset, {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Popup: HoverCardPopup,
  Title: HoverCardTitle,
  Content: HoverCardContent,
});
