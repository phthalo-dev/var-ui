import type { JSX } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Autocomplete, Input, ListBox, ListBoxItem, TextField } from 'react-aria-components';
import type { ComponentAttrsResult } from 'typestyles';
import { commandPalette, type CommandPaletteVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { useOverlayPresence } from '../overlays';
import { cx, mergeProps } from 'typestyles';

export type CommandPaletteItem = {
  /** Unique item identifier passed to `onAction`. */
  id: string;
  /** Primary label shown in the results list. */
  title: string;
  /** Secondary text shown below the title (also searched by the default filter). */
  meta?: string;
  /** Extra search terms matched by the default filter but never rendered. */
  keywords?: string[];
};

export type CommandPaletteProps = {
  /** Controls the open state. */
  isOpen?: NonNullable<CommandPaletteVariantProps['open']>;
  /** Called when the open state changes (Escape, backdrop click, hotkey, or item selection). */
  onOpenChange?: (open: boolean) => void;
  /** Commands shown in the results list. */
  items: CommandPaletteItem[];
  /** Called with the selected item's `id` on Enter/click; the palette does not close itself. */
  onAction: (id: string) => void;
  /** Input placeholder. @default 'Search…' */
  placeholder?: string;
  /** Message shown when no items match the query. @default 'No results' */
  emptyLabel?: string;
  /** Toggles open state on ⌘K / Ctrl+K. @default true */
  hotkey?: boolean;
  /** Overrides the default case-insensitive title/meta/keywords match. */
  filter?: (item: CommandPaletteItem, query: string) => boolean;
  /**
   * Element the dialog renders into instead of its React parent. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

type CommandPaletteSlot =
  | 'root'
  | 'dialog'
  | 'inputRow'
  | 'inputIcon'
  | 'input'
  | 'results'
  | 'result'
  | 'resultLink'
  | 'resultLinkActive'
  | 'resultTitle'
  | 'resultMeta'
  | 'mark'
  | 'empty';
type CommandPaletteRecipeFn = (args?: {
  open?: boolean;
}) => Record<CommandPaletteSlot, ComponentAttrsResult>;
const commandPaletteSlots = commandPalette as unknown as CommandPaletteRecipeFn;

function defaultFilter(item: CommandPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.meta?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) return true;
  return false;
}

/**
 * ⌘K-style search overlay: filters a flat list of commands and reports the chosen `id` via
 * `onAction`. Callers own the open state and typically close the palette themselves inside
 * `onAction`.
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  items,
  onAction,
  placeholder = 'Search…',
  emptyLabel = 'No results',
  hotkey = true,
  filter = defaultFilter,
  portalContainer,
}: CommandPaletteProps): JSX.Element | null {
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const open = Boolean(isOpen);
  const presence = useOverlayPresence({
    isOpen: open,
    getAnimatedElements: () => [panelRef.current],
  });
  const cp = commandPaletteSlots({ open });
  const { style: layerStyle } = useLayer();

  useEffect(() => {
    if (!hotkey) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange?.(!open);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (presence.mounted) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [presence.mounted]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onOpenChange?.(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  const visibleItems = useMemo(
    () => items.filter((item) => filter(item, query)),
    [items, filter, query],
  );

  const palette = (
    <dialog
      ref={dialogRef}
      aria-label={placeholder}
      {...mergeProps(cp.root)}
      style={layerStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false);
      }}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange?.(false);
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        onOpenChange?.(false);
      }}
    >
      {presence.mounted ? (
        <div ref={panelRef} {...mergeProps(cp.dialog)} {...presence.attrs}>
          <Autocomplete inputValue={query} onInputChange={setQuery}>
            <div {...mergeProps(cp.inputRow)}>
              <span {...mergeProps(cp.inputIcon)}>
                <Icon name="search" />
              </span>
              <TextField aria-label={placeholder} style={{ display: 'flex', flex: 1, minWidth: 0 }}>
                <Input {...mergeProps(cp.input)} placeholder={placeholder} autoFocus />
              </TextField>
            </div>
            <ListBox
              items={visibleItems}
              {...mergeProps(cp.results)}
              aria-label={placeholder}
              renderEmptyState={() => <div {...mergeProps(cp.empty)}>{emptyLabel}</div>}
            >
              {(item) => (
                <ListBoxItem
                  id={item.id}
                  textValue={item.title}
                  {...mergeProps(cp.result)}
                  onAction={() => onAction(item.id)}
                >
                  {({ isFocused }) => (
                    <span {...mergeProps(cp.resultLink, cx(isFocused && cp.resultLinkActive))}>
                      <span {...mergeProps(cp.resultTitle)}>{item.title}</span>
                      {item.meta ? <span {...mergeProps(cp.resultMeta)}>{item.meta}</span> : null}
                    </span>
                  )}
                </ListBoxItem>
              )}
            </ListBox>
          </Autocomplete>
        </div>
      ) : null}
    </dialog>
  );

  return portalContainer ? createPortal(palette, portalContainer) : palette;
}
