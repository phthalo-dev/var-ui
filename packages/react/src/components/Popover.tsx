import {
  Children,
  useId,
  useMemo,
  type ComponentPropsWithRef,
  type JSX,
  type ReactNode,
} from 'react';
import { popover } from '@var-ui/core/components/popover';
import { Icon } from '../icons';
import { findPartId } from '../internal/findPartId';
import {
  composeHandlers,
  createOverlayContext,
  OverlayCloseContext,
  OverlayTrigger,
  useAnchor,
  useMergedRef,
  useOverlayClose,
  useOverlayRoot,
  usePopoverElement,
  wireOverlayChild,
  type AnchorPlacement,
  type OverlayCloseProps,
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
  /** Called when the popover requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
};

/** Alias for docs and consumers referring to the root popover props. */
export type PopoverProps = PopoverRootProps;

/** The single child must be a button (or a component that forwards DOM props to one). */
export type PopoverTriggerProps = OverlayTriggerProps;

/**
 * Props of the popup `<div popover="auto">`: `ref`, `className`, `style`, handlers and
 * `data-*`/`aria-*` attributes all land on it. When `Popover.Title` is rendered (or an
 * `aria-label` / `aria-labelledby` is passed) the popup gets `role="dialog"` and that name.
 */
export type PopoverPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'popover'> & {
  children: ReactNode;
  /**
   * Preferred side of the trigger, optionally with an alignment: `top`, `bottom`, `start`, `end`,
   * `bottom start`, `top end`, ... The popup flips when there is no room. @default bottom
   */
  placement?: AnchorPlacement;
  /** Gap between the trigger and the popup: a number is px, a string any CSS length. */
  offset?: number | string;
};

export type PopoverTitleProps = ComponentPropsWithRef<'h2'>;

export type PopoverDescriptionProps = ComponentPropsWithRef<'p'>;

export type PopoverContentProps = ComponentPropsWithRef<'div'>;

export type PopoverCloseProps = OverlayCloseProps;

type PopoverContextValue = {
  root: OverlayRoot;
  titleId: string;
  descriptionId: string;
};

const { Context: PopoverContext, use: usePopoverContext } =
  createOverlayContext<PopoverContextValue>('Popover');

function PopoverRoot({ children, open, defaultOpen, onOpenChange }: PopoverRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const titleId = useId();
  const descriptionId = useId();
  const context = useMemo<PopoverContextValue>(
    () => ({ root, titleId, descriptionId }),
    [root, titleId, descriptionId],
  );

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
}

function PopoverTrigger(props: PopoverTriggerProps): JSX.Element {
  const { root } = usePopoverContext();
  return (
    <OverlayTrigger
      aria-haspopup="dialog"
      aria-expanded={root.open}
      {...props}
      root={root}
      relation="popovertarget"
    />
  );
}

function PopoverPopup({
  children,
  className,
  placement = 'bottom',
  offset,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ref,
  ...rest
}: PopoverPopupProps): JSX.Element {
  const ctx = usePopoverContext();
  const { root } = ctx;
  const p = popover();
  const pop = usePopoverElement(root, { mode: 'auto' });
  useAnchor(root.triggerEl, root.popupEl, { placement, offset });
  const setRef = useMergedRef<HTMLElement>(pop.ref, ref);
  const labelledBy =
    ariaLabelledBy ?? (ariaLabel ? undefined : findPartId(children, PopoverTitle, ctx.titleId));
  const named = Boolean(ariaLabel || labelledBy);

  return (
    <div
      {...rest}
      {...mergeProps(p.root, className)}
      {...pop.props}
      role={named ? 'dialog' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={
        ariaDescribedBy ?? findPartId(children, PopoverDescription, ctx.descriptionId)
      }
      data-open={root.open ? '' : undefined}
      data-closed={root.open ? undefined : ''}
      ref={setRef}
    >
      {pop.mounted ? (
        <OverlayCloseContext.Provider value={root.close}>{children}</OverlayCloseContext.Provider>
      ) : null}
    </div>
  );
}

function PopoverTitle({ className, id: idProp, ...rest }: PopoverTitleProps): JSX.Element {
  const { titleId } = usePopoverContext();
  const p = popover();
  return <h2 {...rest} id={idProp ?? titleId} {...mergeProps(p.title, className)} />;
}

function PopoverDescription({
  className,
  id: idProp,
  ...rest
}: PopoverDescriptionProps): JSX.Element {
  const { descriptionId } = usePopoverContext();
  const p = popover();
  return <p {...rest} id={idProp ?? descriptionId} {...mergeProps(p.content, className)} />;
}

function PopoverContent({ className, ...rest }: PopoverContentProps): JSX.Element {
  const p = popover();
  return <div {...rest} {...mergeProps(p.content, className)} />;
}

function PopoverClose({
  children,
  className,
  'aria-label': ariaLabel,
  onClick,
  ref,
  ...rest
}: PopoverCloseProps): JSX.Element {
  const close = useOverlayClose();
  const requestClose = (event: Event | null = null) => close({ reason: 'close-press', event });

  if (children) {
    return wireOverlayChild(
      Children.only(children),
      {
        ...rest,
        ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : null),
        ...(onClick ? { onClick } : null),
        ref,
        className,
      },
      'none',
      requestClose,
    );
  }

  return (
    <button
      type="button"
      {...rest}
      className={className}
      ref={ref}
      aria-label={ariaLabel ?? 'Close'}
      onClick={composeHandlers(onClick, (event: { nativeEvent: Event }) =>
        requestClose(event.nativeEvent),
      )}
    >
      <Icon name="close" size="sm" />
    </button>
  );
}

/**
 * Compound popover on the native `popover` attribute. `Popover` is Root; `Popup` is the
 * `<div popover="auto">` itself (top layer, light dismiss, no portal). Trigger becomes a
 * `popovertarget` invoker on its single child, so a click toggles without a double toggle.
 * Opening does not move focus; put `autofocus` on an element inside to take it.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>
 *     <Button>Filters</Button>
 *   </Popover.Trigger>
 *   <Popover.Popup placement="bottom start">
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
  Close: PopoverClose,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Content: PopoverContent,
});
