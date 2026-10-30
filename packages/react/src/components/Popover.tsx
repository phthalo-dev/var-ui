import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  OverlayArrow,
  type Placement,
} from 'react-aria-components';
import { Popover as AriaPopover } from '../internal/nativeDialogShim';
import { popover } from '@var-ui/core/components/popover';
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

export type PopoverRootProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover requests to open or close. */
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
};

export type PopoverTitleProps = ComponentPropsWithRef<'h2'>;

export type PopoverContentProps = ComponentPropsWithRef<'div'>;

export type PopoverArrowProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

type PopoverContextValue = {
  root: OverlayRoot;
  portalContainer?: Element;
};

const { Context: PopoverContext, use: usePopoverContext } =
  createOverlayContext<PopoverContextValue>('Popover');

function PopoverRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  portalContainer,
}: PopoverRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const context = useMemo<PopoverContextValue>(
    () => ({ root, portalContainer }),
    [root, portalContainer],
  );

  return (
    <PopoverContext.Provider value={context}>
      <AriaDialogTrigger {...root.rac}>{children}</AriaDialogTrigger>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger(props: PopoverTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={usePopoverContext().root} />;
}

function PopoverPopup({
  children,
  className,
  style,
  placement = 'bottom',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: PopoverPopupProps): JSX.Element {
  const { root, portalContainer } = usePopoverContext();
  const p = popover();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: root.popupRef,
    triggerRef: root.triggerRef,
  });
  const setRef = useMergedRef<HTMLDivElement>(root.setPopupEl, ref);

  return (
    <AriaPopover
      {...rest}
      {...mergeProps(p.root, className)}
      {...root.presenceAttrs}
      {...root.rac}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      UNSTABLE_portalContainer={portalContainer}
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
