import type { CSSProperties, JSX, MouseEvent, ReactElement, Ref } from 'react';
import { useCallback, useState } from 'react';
import { MenuTrigger, Popover, Pressable, type MenuTriggerProps } from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
import { mergeOverlayChild } from '../overlays';
import { IconButton } from '../components/IconButton';
import { MenuContent, type MenuContentProps } from './menuContent';
import { mergeProps } from 'typestyles';

export type MenuFromSectionsProps = Omit<MenuTriggerProps, 'children' | 'trigger'> &
  MenuContentProps & {
    /** Trigger element (usually a `Button`). */
    trigger: JSX.Element;
  };

/** Data preset: pass a `trigger` and `sections` of items. */
export function MenuFromSections({
  trigger,
  sections,
  ...props
}: MenuFromSectionsProps): JSX.Element {
  const m = menu();
  return (
    <MenuTrigger {...props}>
      {trigger}
      <Popover {...mergeProps(m.popover)}>
        <MenuContent sections={sections} />
      </Popover>
    </MenuTrigger>
  );
}

export type MenuContextMenuProps = MenuContentProps & {
  /** A single host element (e.g. `<div>`) that receives the context-menu gesture. */
  children: ReactElement<any, string>;
};

const contextMenuAnchorStyle: CSSProperties = {
  position: 'fixed',
  width: 1,
  height: 1,
  pointerEvents: 'none',
  opacity: 0,
};

/** Right-click menu anchored to the wrapped surface at the pointer. */
export function MenuContextMenu({ children, sections }: MenuContextMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const m = menu();

  const handleContextMenu = useCallback((...args: unknown[]) => {
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
    setAnchor({ x, y });
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setAnchor(null);
    }
  }, []);

  const host = mergeOverlayChild(children, {
    onContextMenu: handleContextMenu,
  });

  return (
    <>
      {host}
      <MenuTrigger isOpen={open} onOpenChange={handleOpenChange}>
        <Pressable>
          <span
            data-context-menu-anchor=""
            aria-hidden
            style={{
              ...contextMenuAnchorStyle,
              left: anchor?.x ?? 0,
              top: anchor?.y ?? 0,
            }}
          />
        </Pressable>
        <Popover {...mergeProps(m.popover)} placement="bottom start">
          <MenuContent sections={sections} />
        </Popover>
      </MenuTrigger>
    </>
  );
}

export type MenuOverflowProps = MenuContentProps & {
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
}: MenuOverflowProps): JSX.Element {
  return (
    <MenuFromSections
      sections={sections}
      trigger={
        <IconButton
          name="moreHorizontal"
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
