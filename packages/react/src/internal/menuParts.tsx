import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Separator,
  type Placement,
} from 'react-aria-components';
import { Popover as AriaPopover } from './nativeDialogShim';
import { menu } from '@var-ui/core/components/menu';
import { useLayer } from '../layers/LayerProvider';
import { toRacProps } from './racProps';
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

export type MenuRootProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /**
   * Called when the menu requests to open or close. `details.reason` is `trigger-press`,
   * `escape-key`, `outside-press`, `focus` or `imperative`; `details.cancel()` vetoes the change.
   */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the menu portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root menu props. */
export type MenuProps = MenuRootProps;

export type MenuTriggerProps = OverlayTriggerProps;

/**
 * Native props go to the popover `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * `role="menu"` element, which is the accessible name target.
 */
export type MenuPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
};

export type MenuItemProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'id'> & {
  children: ReactNode;
  id: string;
  onAction?: () => void;
  /** Prevents the item from being focused or activated. */
  disabled?: boolean;
  /** Plain-text value used for typeahead when `children` is not a string. */
  textValue?: string;
};

export type MenuSeparatorProps = Omit<ComponentPropsWithRef<'hr'>, 'children'>;

export type MenuSectionProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & {
  children: ReactNode;
  /** Section heading rendered above the items. */
  title?: string;
};

type MenuContextValue = {
  root: OverlayRoot;
  portalContainer?: Element;
};

const { Context: MenuContext, use: useMenuContext } =
  createOverlayContext<MenuContextValue>('Menu');

function MenuRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  portalContainer,
}: MenuRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const context = useMemo<MenuContextValue>(
    () => ({ root, portalContainer }),
    [root, portalContainer],
  );

  return (
    <MenuContext.Provider value={context}>
      <AriaMenuTrigger {...root.rac}>{children}</AriaMenuTrigger>
    </MenuContext.Provider>
  );
}

function MenuTrigger(props: MenuTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={useMenuContext().root} />;
}

function MenuPopup({
  children,
  className,
  style,
  placement = 'bottom',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: MenuPopupProps): JSX.Element {
  const { root, portalContainer } = useMenuContext();
  const m = menu();
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
      {...mergeProps(m.popover, className)}
      {...root.presenceAttrs}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      UNSTABLE_portalContainer={portalContainer}
      // Focus or pointer landing on the trigger is not "outside": the trigger toggles the menu itself.
      shouldCloseOnInteractOutside={(element) => !root.triggerRef.current?.contains(element)}
    >
      <AriaMenu
        {...mergeProps(m.menu)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        selectionMode="none"
      >
        {children}
      </AriaMenu>
    </AriaPopover>
  );
}

function MenuItem({
  children,
  id,
  onAction,
  className,
  disabled,
  textValue,
  ref,
  ...rest
}: MenuItemProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuItem
      {...(rest as AriaMenuItemProps)}
      id={id}
      onAction={onAction}
      {...toRacProps({ disabled })}
      textValue={textValue}
      {...mergeProps(m.item, className)}
      ref={ref}
    >
      {children}
    </AriaMenuItem>
  );
}

function MenuSeparator({ className, ...rest }: MenuSeparatorProps): JSX.Element {
  const m = menu();
  return <Separator {...rest} {...mergeProps(m.separator, className)} />;
}

function MenuSection({ children, title, className, ...rest }: MenuSectionProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuSection {...rest} {...mergeProps(m.section, className)}>
      {title ? <Header {...mergeProps(m.sectionHeader)}>{title}</Header> : null}
      {children}
    </AriaMenuSection>
  );
}

export { MenuRoot, MenuTrigger, MenuPopup, MenuItem, MenuSeparator, MenuSection };
