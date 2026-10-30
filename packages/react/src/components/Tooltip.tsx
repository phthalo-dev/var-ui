import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type Placement,
} from 'react-aria-components';
import { useNativeDialogContainer } from '../internal/nativeDialogShim';
import { tooltip } from '@var-ui/core/components/tooltip';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayContext,
  OverlayTrigger,
  useMergedRef,
  useOverlayRoot,
  usePositionerVars,
  type OverlayOpenChangeHandler,
  type OverlayRoot,
  type OverlayTriggerProps,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type TooltipRootProps = {
  children: ReactNode;
  /** Delay before the tooltip opens, in milliseconds. @default 500 */
  delay?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip requests to open or close. */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the tooltip portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root tooltip props. */
export type TooltipProps = TooltipRootProps;

export type TooltipTriggerProps = OverlayTriggerProps;

export type TooltipPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
};

type TooltipContextValue = {
  root: OverlayRoot;
  portalContainer?: Element;
};

const { Context: TooltipContext, use: useTooltipContext } =
  createOverlayContext<TooltipContextValue>('Tooltip');

function TooltipRoot({
  children,
  delay = 500,
  open,
  defaultOpen,
  onOpenChange,
  portalContainer,
}: TooltipRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const context = useMemo<TooltipContextValue>(
    () => ({ root, portalContainer }),
    [root, portalContainer],
  );

  return (
    <TooltipContext.Provider value={context}>
      <AriaTooltipTrigger delay={delay} {...root.rac}>
        {children}
      </AriaTooltipTrigger>
    </TooltipContext.Provider>
  );
}

function TooltipTriggerPart(props: TooltipTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={useTooltipContext().root} mode="focusable" />;
}

function TooltipPopup({
  children,
  className,
  style,
  placement = 'top',
  ref,
  ...rest
}: TooltipPopupProps): JSX.Element {
  const { root, portalContainer } = useTooltipContext();
  const nativeDialog = useNativeDialogContainer();
  const tip = tooltip();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: root.popupRef,
    triggerRef: root.triggerRef,
  });
  const setRef = useMergedRef<HTMLDivElement>(root.setPopupEl, ref);

  return (
    <AriaTooltip
      {...rest}
      {...mergeProps(tip.root, className)}
      {...root.presenceAttrs}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      UNSTABLE_portalContainer={portalContainer ?? nativeDialog}
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
