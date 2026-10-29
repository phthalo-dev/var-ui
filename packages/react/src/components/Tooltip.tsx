import {
  Children,
  createContext,
  useCallback,
  useContext,
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
  Focusable,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type Placement,
} from 'react-aria-components';
import { tooltip } from '@var-ui/core';
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

export type TooltipRootProps = {
  children: ReactNode;
  /** Delay before the tooltip opens, in milliseconds. @default 500 */
  delay?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the tooltip portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root tooltip props. */
export type TooltipProps = TooltipRootProps;

export type TooltipTriggerProps = {
  children: ReactElement;
  className?: string;
  /** Ref to the trigger element. */
  ref?: Ref<HTMLElement>;
};

export type TooltipPopupProps = {
  children: ReactNode;
  className?: string;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
  portalContainer?: Element;
};

type TooltipContextValue = {
  presence: UseOverlayPresenceResult;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  setPopupEl: (element: HTMLDivElement | null) => void;
  setTriggerEl: (element: HTMLElement | null) => void;
  portalContainer?: Element;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error('Tooltip compound components must be rendered inside <Tooltip>.');
  }
  return ctx;
}

function TooltipRoot({
  children,
  delay = 500,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: TooltipRootProps): JSX.Element {
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

  const context = useMemo<TooltipContextValue>(
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
    <TooltipContext.Provider value={context}>
      <AriaTooltipTrigger delay={delay} isOpen={presence.mounted} onOpenChange={handleOpenChange}>
        {children}
      </AriaTooltipTrigger>
    </TooltipContext.Provider>
  );
}

function TooltipTriggerPart({
  children,
  className,
  ref,
  ...props
}: TooltipTriggerProps): JSX.Element {
  const ctx = useTooltipContext();
  const child = Children.only(children);
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
  });
  // RAC TooltipTrigger injects hover/focus via FocusableProvider context, not cloneElement.
  // Host nodes need Focusable so they register; RAC Button already does.
  if (typeof child.type === 'string') {
    return <Focusable>{merged as ReactElement<{ className?: string }, string>}</Focusable>;
  }
  return merged;
}

function TooltipPopup({
  children,
  className,
  placement = 'top',
  portalContainer,
}: TooltipPopupProps): JSX.Element {
  const ctx = useTooltipContext();
  const tip = tooltip();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });

  return (
    <AriaTooltip
      {...mergeProps(tip.root, className)}
      {...ctx.presence.attrs}
      ref={(node: HTMLDivElement | null) => {
        ctx.popupRef.current = node;
        ctx.setPopupEl(node);
      }}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style }}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      {children}
    </AriaTooltip>
  );
}

/**
 * Compound tooltip. `Tooltip` is Root; compose Trigger and Popup.
 *
 * ```tsx
 * <Tooltip.Root delay={500}>
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
