import type { JSX, MouseEvent, ReactElement, Ref } from 'react';
import { useCallback, useState } from 'react';
import { createOverlayChangeDetails, mergeOverlayChild, useVirtualAnchor } from '../overlays';
import { IconButton } from '../components/IconButton';
import { MenuContent, type MenuContentProps } from './menuContent';
import {
  MenuPopup,
  MenuRoot,
  MenuTrigger,
  type MenuPopupProps,
  type MenuRootProps,
} from './menuParts';

/** Root-level props the presets forward to `Menu.Root`. */
type MenuPresetRootProps = Pick<MenuRootProps, 'open' | 'defaultOpen' | 'onOpenChange'>;

/** Popup-level props the presets forward to `Menu.Popup` (native props, `placement`, aria-*). */
type MenuPresetPopupProps = Omit<MenuPopupProps, 'children'>;

export type MenuFromSectionsProps = MenuPresetRootProps &
  MenuPresetPopupProps &
  MenuContentProps & {
    /** Trigger element (usually a `Button`). */
    trigger: JSX.Element;
  };

/** Data preset: pass a `trigger` and `sections` of items. Composes `Menu.Root` / `Trigger` / `Popup`. */
export function MenuFromSections({
  trigger,
  sections,
  open,
  defaultOpen,
  onOpenChange,
  ...popupProps
}: MenuFromSectionsProps): JSX.Element {
  return (
    <MenuRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuPopup {...popupProps}>
        <MenuContent sections={sections} />
      </MenuPopup>
    </MenuRoot>
  );
}

export type MenuContextMenuProps = MenuContentProps &
  Pick<MenuRootProps, 'onOpenChange'> &
  MenuPresetPopupProps & {
    /** A single host element (e.g. `<div>`) that receives the context-menu gesture. */
    children: ReactElement<any, string>;
  };

/** Right-click menu anchored to the wrapped surface at the pointer. */
export function MenuContextMenu({
  children,
  sections,
  onOpenChange,
  placement = 'bottom start',
  ...popupProps
}: MenuContextMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  // A 1px fixed element moved to the pointer: it is the RAC trigger, so the popup anchors to it.
  const point = useVirtualAnchor();
  const { moveTo } = point;

  const handleContextMenu = useCallback(
    (...args: unknown[]) => {
      const event = args[0] as MouseEvent;
      event.preventDefault();
      let { clientX: x, clientY: y } = event;
      // Keyboard invocation (Shift+F10 / ContextMenu key) reports 0,0 in some browsers:
      // anchor to the focused target's bottom-start corner instead.
      if (x === 0 && y === 0) {
        const el =
          event.target instanceof Element
            ? event.target
            : event.currentTarget instanceof Element
              ? event.currentTarget
              : null;
        if (el) {
          const rect = el.getBoundingClientRect();
          x = rect.left;
          y = rect.bottom;
        }
      }
      moveTo(x, y);
      const details = createOverlayChangeDetails({
        reason: 'trigger-press',
        event: event.nativeEvent,
      });
      onOpenChange?.(true, details);
      if (!details.isCanceled) setOpen(true);
    },
    [onOpenChange, moveTo],
  );

  const host = mergeOverlayChild(children, {
    onContextMenu: handleContextMenu,
  });

  return (
    <>
      {host}
      <MenuRoot
        open={open}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);
          if (!details.isCanceled) setOpen(next);
        }}
      >
        <MenuTrigger>
          <span data-context-menu-anchor="" tabIndex={-1} {...point.props} />
        </MenuTrigger>
        <MenuPopup {...popupProps} placement={placement}>
          <MenuContent sections={sections} />
        </MenuPopup>
      </MenuRoot>
    </>
  );
}

export type MenuOverflowProps = MenuPresetRootProps &
  Omit<MenuPresetPopupProps, 'ref' | 'aria-label'> &
  MenuContentProps & {
    /** Accessible label for the overflow trigger. @default More options */
    'aria-label'?: string;
    /** Ref to the trigger `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

/** Icon-only overflow menu using the `moreHorizontal` registry glyph. */
export function MenuOverflow({
  sections,
  'aria-label': ariaLabel = 'More options',
  ref,
  open,
  defaultOpen,
  onOpenChange,
  ...popupProps
}: MenuOverflowProps): JSX.Element {
  return (
    <MenuFromSections
      {...popupProps}
      sections={sections}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={
        <IconButton
          icon="moreHorizontal"
          aria-label={ariaLabel}
          tone="accent"
          appearance="ghost"
          size="sm"
          ref={ref}
        />
      }
    />
  );
}
