import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
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
import { popover } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  useOverlayPresence,
  usePositionerVars,
  type OverlayOpenChangeHandler,
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

export type PopoverTriggerProps = {
  children: ReactElement;
  className?: string;
  /** Ref to the trigger element. */
  ref?: Ref<HTMLElement>;
};

export type PopoverPopupProps = {
  children: ReactNode;
  className?: string;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
  portalContainer?: Element;
  /** Ref to the underlying popover `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type PopoverTitleProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying heading element. */
  ref?: Ref<HTMLHeadingElement>;
};

export type PopoverContentProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type PopoverArrowProps = {
  className?: string;
  /** Ref to the underlying arrow `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

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
  placement = 'bottom',
  portalContainer,
  ref,
}: PopoverPopupProps): JSX.Element {
  const ctx = usePopoverContext();
  const p = popover();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });

  return (
    <AriaPopover
      {...mergeProps(p.root, className)}
      {...ctx.presence.attrs}
      ref={(node: HTMLDivElement | null) => {
        ctx.popupRef.current = node;
        ctx.setPopupEl(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style }}
      isOpen={ctx.presence.mounted}
      onOpenChange={ctx.handleOpenChange}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      <AriaDialog>{children}</AriaDialog>
    </AriaPopover>
  );
}

function PopoverTitle({ children, className, ref }: PopoverTitleProps): JSX.Element {
  const p = popover();
  return (
    <Heading slot="title" {...mergeProps(p.title, className)} ref={ref}>
      {children}
    </Heading>
  );
}

function PopoverContent({ children, className, ref }: PopoverContentProps): JSX.Element {
  const p = popover();
  return (
    <div {...mergeProps(p.content, className)} ref={ref}>
      {children}
    </div>
  );
}

function PopoverArrow({ className, ref }: PopoverArrowProps): JSX.Element {
  const p = popover();
  return (
    <OverlayArrow>
      {({ placement }) => (
        <div
          {...mergeProps(p.arrow, className)}
          ref={ref}
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
