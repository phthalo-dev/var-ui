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
  OverlayArrow,
  Popover as AriaPopover,
  Pressable,
  type Placement,
} from 'react-aria-components';
import { popover } from '@var-ui/core/components/popover';
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

export type PopoverRootProps = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the popover portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root popover props. */
export type PopoverProps = PopoverRootProps;

export type PopoverTriggerProps = OverlayTriggerProps;

/**
 * Native props go to the popover `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * dialog element. When `Popover.Title` is rendered it names the dialog, otherwise pass
 * `aria-label` / `aria-labelledby`.
 */
export type PopoverPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
  portalContainer?: Element;
};

export type PopoverTitleProps = ComponentPropsWithRef<'h2'>;

export type PopoverContentProps = ComponentPropsWithRef<'div'>;

export type PopoverArrowProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

type PopoverContextValue = {
  presence: UseOverlayPresenceResult;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  setPopupEl: (element: HTMLDivElement | null) => void;
  setTriggerEl: (element: HTMLElement | null) => void;
  portalContainer?: Element;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error('Popover compound components must be rendered inside <Popover>.');
  }
  return ctx;
}

function composeHandler(existing: unknown, ours: (...args: unknown[]) => void) {
  if (typeof existing !== 'function') {
    return ours;
  }
  return (...args: unknown[]) => {
    existing(...args);
    ours(...args);
  };
}

function PopoverRoot({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: PopoverRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = isOpen ?? uncontrolledOpen;
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setPopupEl] = useState<HTMLDivElement | null>(null);
  const [, setTriggerEl] = useState<HTMLElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [popupRef.current],
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      const details = createOverlayChangeDetails({
        reason: inferOverlayCloseReason(lastEventRef.current),
        event: lastEventRef.current,
      });
      onOpenChange?.(next, details);
      lastEventRef.current = null;
      if (details.isCanceled) return;
      if (isOpen === undefined) setRequestedOpen(next);
    },
    [isOpen, onOpenChange],
  );

  useEffect(() => {
    if (!presence.mounted) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        lastEventRef.current = event;
        return;
      }
      if (popupRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      lastEventRef.current = event;
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [presence.mounted]);

  const context = useMemo<PopoverContextValue>(
    () => ({
      presence,
      popupRef,
      triggerRef,
      setPopupEl,
      setTriggerEl,
      portalContainer,
      lastEventRef,
      handleOpenChange,
    }),
    [handleOpenChange, portalContainer, presence],
  );

  return (
    <PopoverContext.Provider value={context}>
      {/*
        RAC DialogTrigger has no DOM node. Root captures the last keydown here so
        inferOverlayCloseReason can map Escape. Document pointerdown (outside popup
        and trigger) is outside-press; Trigger stashes press/click (trigger-press).
        cancel() only blocks uncontrolled requestedOpen updates after onOpenChange.
      */}
      <div
        style={{ display: 'contents' }}
        onKeyDownCapture={(event) => {
          lastEventRef.current = event.nativeEvent;
        }}
      >
        <AriaDialogTrigger isOpen={presence.mounted} onOpenChange={handleOpenChange}>
          {children}
        </AriaDialogTrigger>
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children, className, ref, ...props }: PopoverTriggerProps): JSX.Element {
  const ctx = usePopoverContext();
  const child = Children.only(children);
  const stashTriggerPress = (...args: unknown[]) => {
    const event = args[0] as { nativeEvent?: Event } | Event | undefined;
    if (event instanceof Event) {
      ctx.lastEventRef.current = event;
      return;
    }
    if (event?.nativeEvent instanceof Event) {
      ctx.lastEventRef.current = event.nativeEvent;
      return;
    }
    ctx.lastEventRef.current = new Event('press');
  };
  const assignTriggerEl = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    ctx.setTriggerEl(node);
  };
  const triggerProps = props as Record<string, unknown>;
  const racTriggerProps: Record<string, unknown> = {
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
    onClick: composeHandler(triggerProps.onClick, stashTriggerPress),
    onPress: composeHandler(triggerProps.onPress, stashTriggerPress),
    onPointerDown: composeHandler(triggerProps.onPointerDown, () => {
      ctx.lastEventRef.current = new Event('press');
    }),
  };
  const merged = mergeOverlayChild(child, racTriggerProps);
  if (typeof child.type === 'string') {
    return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
  }
  return merged;
}

function PopoverPopup({
  children,
  className,
  style,
  placement = 'bottom',
  portalContainer,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: PopoverPopupProps): JSX.Element {
  const ctx = usePopoverContext();
  const p = popover();
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
      {...mergeProps(p.root, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      isOpen={ctx.presence.mounted}
      onOpenChange={ctx.handleOpenChange}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      <AriaDialog aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
        {children}
      </AriaDialog>
    </AriaPopover>
  );
}

function PopoverTitle({ className, children, ...rest }: PopoverTitleProps): JSX.Element {
  const p = popover();
  return (
    <Heading {...rest} slot="title" {...mergeProps(p.title, className)}>
      {children}
    </Heading>
  );
}

function PopoverContent({ className, ...rest }: PopoverContentProps): JSX.Element {
  const p = popover();
  return <div {...rest} {...mergeProps(p.content, className)} />;
}

function PopoverArrow({ className, ...rest }: PopoverArrowProps): JSX.Element {
  const p = popover();
  return (
    <OverlayArrow>
      {({ placement }) => (
        <div
          {...rest}
          {...mergeProps(p.arrow, className)}
          data-placement={placement ?? undefined}
        />
      )}
    </OverlayArrow>
  );
}

/**
 * Compound popover. `Popover` is Root; compose Trigger, Popup, and chrome parts.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>
 *     <Button>Filters</Button>
 *   </Popover.Trigger>
 *   <Popover.Popup placement="bottom">
 *     <Popover.Arrow />
 *     <Popover.Title>Filters</Popover.Title>
 *     <Popover.Content>{children}</Popover.Content>
 *   </Popover.Popup>
 * </Popover.Root>
 * ```
 */
export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Title: PopoverTitle,
  Content: PopoverContent,
  Arrow: PopoverArrow,
});
