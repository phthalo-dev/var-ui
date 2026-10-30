import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  Autocomplete,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  TextField,
} from 'react-aria-components';
import type { ComponentAttrsResult } from 'typestyles';
import { commandPalette } from '@var-ui/core/components/commandPalette';
import type { CommandPaletteVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { useMergedRef, useOverlayRoot, type OverlayOpenChangeHandler } from '../overlays';
import { cx, mergeProps } from 'typestyles';
import { Kbd } from './Kbd';
import type { CommandPaletteController } from '../internal/commandPaletteController';
import { DEFAULT_COMMAND_PALETTE_HOTKEY, matchesHotkey } from '../internal/commandPaletteHotkey';

export type CommandPaletteItem = {
  /** Unique item identifier passed to `onAction`. */
  id: string;
  /** Primary label shown in the results list. */
  title: string;
  /** Secondary text shown below the title (also searched by the default filter). */
  meta?: string;
  /** Extra search terms matched by the default filter but never rendered. */
  keywords?: string[];
  /**
   * Section heading. Consecutive items with the same `group` render together under that heading;
   * keyboard navigation still moves through all items in order. Items without a `group` render
   * without a heading.
   */
  group?: string;
  /** Leading icon, rendered in a recipe-sized `Icon` shell. */
  icon?: ReactNode;
  /**
   * Shortcut hint shown on the trailing edge. A string renders one key cap; an array renders one
   * per entry (`['⌘', 'K']`). Display only; it does not bind the shortcut.
   */
  shortcut?: string | string[];
  /** Called when the item is chosen, before `onAction`. */
  onSelect?: () => void;
};

export type CommandPaletteProps = Omit<ComponentPropsWithRef<'dialog'>, 'children' | 'open'> & {
  /** Controlled open state. */
  open?: NonNullable<CommandPaletteVariantProps['open']>;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /**
   * Called when the palette requests to open or close (Escape, backdrop click, hotkey, or item
   * selection). Call `details.cancel()` to veto the change.
   */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Drives the open state from a store made by `createCommandPalette()` or `useCommandPalette()`,
   * so the palette can be opened from outside the component tree. Takes precedence over `open`;
   * `onOpenChange` is still called.
   */
  controller?: CommandPaletteController;
  /** Commands shown in the results list. */
  items: CommandPaletteItem[];
  /** Called with the selected item's `id` on Enter/click, after the item's own `onSelect`. */
  onAction?: (id: string) => void;
  /** Closes the palette after an item is chosen. @default true */
  closeOnAction?: boolean;
  /** Input placeholder. @default 'Search…' */
  placeholder?: string;
  /** Message shown when no items match the query. @default 'No results' */
  emptyLabel?: string;
  /**
   * Key combo that toggles the palette, e.g. `'mod+k'`, `'ctrl+shift+p'`, or an array of combos.
   * `mod` is ⌘ on Apple platforms and Ctrl elsewhere (either is accepted). `true` uses the default
   * and `false` disables the listener. @default 'mod+k'
   */
  hotkey?: boolean | string | string[];
  /** Wraps the part of each title and meta that matches the query in a `<mark>`. */
  highlightMatches?: boolean;
  /**
   * Overrides the default case-insensitive title/meta/keywords match. Pass `false` to skip
   * client-side filtering, e.g. when `items` already are the (remote) results for the query.
   */
  filter?: ((item: CommandPaletteItem, query: string) => boolean) | false;
  /** Called with the input value as it changes, and with `''` when the palette closes. */
  onQueryChange?: (query: string) => void;
  /** Shows a busy state and `loadingLabel` in place of `emptyLabel` while `items` is empty. */
  loading?: boolean;
  /** Message shown while `loading` and no items are listed. @default 'Loading…' */
  loadingLabel?: string;
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
  | 'group'
  | 'groupHeading'
  | 'result'
  | 'resultLink'
  | 'resultLinkActive'
  | 'resultIcon'
  | 'resultBody'
  | 'resultShortcut'
  | 'resultTitle'
  | 'resultMeta'
  | 'mark'
  | 'empty';
type CommandPaletteRecipeFn = (args?: {
  open?: boolean;
}) => Record<CommandPaletteSlot, ComponentAttrsResult>;
// Slot recipe call results are typed `Record<string, ComponentAttrsResult>`, so slot names are lost;
// drop this cast once https://github.com/phthalo-dev/typestyles/issues/303 ships.
const commandPaletteSlots = commandPalette as unknown as CommandPaletteRecipeFn;

function defaultFilter(item: CommandPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.meta?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) return true;
  return false;
}

const subscribeNever = () => () => {};
const getFalse = () => false;

/**
 * Lowercases `text` and records, for every UTF-16 unit of the result, the index of the original
 * character it came from. Lowercasing can change length (`İ` → `i̇`), so offsets found in the
 * lowercase string must be mapped back before slicing the original.
 */
function lowerWithOffsets(text: string): { lower: string; origin: number[] } {
  let lower = '';
  const origin: number[] = [];
  for (let i = 0; i < text.length;) {
    const char = String.fromCodePoint(text.codePointAt(i)!);
    const lowered = char.toLowerCase();
    lower += lowered;
    for (let j = 0; j < lowered.length; j++) origin.push(i);
    i += char.length;
  }
  return { lower, origin };
}

function renderHighlighted(text: string, query: string, cp: { mark: ComponentAttrsResult }) {
  const q = query.trim().toLowerCase();
  if (!q) return text;
  const { lower, origin } = lowerWithOffsets(text);
  const matchStart = lower.indexOf(q);
  if (matchStart < 0) return text;
  const start = origin[matchStart]!;
  const lastOrigin = origin[matchStart + q.length - 1]!;
  const end = lastOrigin + String.fromCodePoint(text.codePointAt(lastOrigin)!).length;
  return (
    <>
      {text.slice(0, start)}
      <mark {...mergeProps(cp.mark)}>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

type ItemBlock = { group?: string; items: CommandPaletteItem[] };

/** Splits `items` into runs of consecutive items sharing a `group`, preserving order. */
function toBlocks(items: CommandPaletteItem[]): ItemBlock[] {
  const blocks: ItemBlock[] = [];
  for (const item of items) {
    const last = blocks[blocks.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else blocks.push({ group: item.group, items: [item] });
  }
  return blocks;
}

/**
 * ⌘K-style search overlay: filters a list of commands and reports the chosen `id` via
 * `onSelect` / `onAction`. Callers own the open state (via `open`, or a `controller`);
 * the palette closes itself after an item is chosen unless `closeOnAction` is `false`.
 */
export function CommandPalette({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  controller,
  items,
  onAction,
  closeOnAction = true,
  placeholder = 'Search…',
  emptyLabel = 'No results',
  hotkey = true,
  highlightMatches = false,
  filter = defaultFilter,
  onQueryChange,
  loading = false,
  loadingLabel = 'Loading…',
  portalContainer,
  className,
  style,
  'aria-label': ariaLabel,
  onClick,
  onCancel,
  onKeyDownCapture,
  ref,
  ...rest
}: CommandPaletteProps): JSX.Element | null {
  const [query, setQueryState] = useState('');
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    onQueryChangeRef.current?.(next);
  }, []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const controllerOpen = useSyncExternalStore(
    controller?.subscribe ?? subscribeNever,
    controller?.getSnapshot ?? getFalse,
    getFalse,
  );
  // Only the open state goes through the shared root: the palette stays a native `<dialog>`, so
  // the RAC props, trigger/backdrop wiring and `OverlayTrigger` do not apply. A controller makes
  // the palette controlled and is updated after `onOpenChange` unless it was canceled.
  const root = useOverlayRoot({
    open: controller ? controllerOpen : openProp,
    defaultOpen,
    onOpenChange: (next, details) => {
      onOpenChange?.(next, details);
      if (!details.isCanceled) controller?.setOpen(next);
    },
  });
  const { open } = root;
  const setDialogRef = useMergedRef<HTMLDialogElement>(dialogRef, ref);
  const cp = commandPaletteSlots({ open });
  const { style: layerStyle } = useLayer();

  const hotkeyId =
    hotkey === true ? DEFAULT_COMMAND_PALETTE_HOTKEY : hotkey ? [hotkey].flat().join('\0') : '';
  useEffect(() => {
    if (!hotkeyId) return undefined;
    const combos = hotkeyId.split('\0');
    function handleKeyDown(event: KeyboardEvent) {
      if (combos.some((combo) => matchesHotkey(event, combo))) {
        event.preventDefault();
        root.setOpen(!root.open, { event, reason: 'imperative' });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeyId, root]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open, setQuery]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (root.mounted) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [root.mounted]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Programmatic close (open flipped to false) also emits `close`; the root drops a request that
    // matches the current state, so only real closes are reported.
    const handleClose = (event: Event) => root.close({ event, reason: 'unknown' });
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [root]);

  const visibleItems = useMemo(
    () => (filter ? items.filter((item) => filter(item, query)) : items),
    [items, filter, query],
  );

  const blocks = useMemo(() => toBlocks(visibleItems), [visibleItems]);

  const renderItem = (item: CommandPaletteItem) => (
    <ListBoxItem
      key={item.id}
      id={item.id}
      textValue={item.title}
      {...mergeProps(cp.result)}
      onAction={() => {
        item.onSelect?.();
        onAction?.(item.id);
        if (closeOnAction) root.close({ reason: 'trigger-press' });
      }}
    >
      {({ isFocused }) => (
        <span {...mergeProps(cp.resultLink, cx(isFocused && cp.resultLinkActive))}>
          {item.icon ? (
            <span {...mergeProps(cp.resultIcon)}>
              <Icon>{item.icon}</Icon>
            </span>
          ) : null}
          <span {...mergeProps(cp.resultBody)}>
            <span {...mergeProps(cp.resultTitle)}>
              {highlightMatches ? renderHighlighted(item.title, query, cp) : item.title}
            </span>
            {item.meta ? (
              <span {...mergeProps(cp.resultMeta)}>
                {highlightMatches ? renderHighlighted(item.meta, query, cp) : item.meta}
              </span>
            ) : null}
          </span>
          {item.shortcut ? (
            <span {...mergeProps(cp.resultShortcut)}>
              {([] as string[]).concat(item.shortcut).map((key, index) => (
                <Kbd key={`${index}:${key}`}>{key}</Kbd>
              ))}
            </span>
          ) : null}
        </span>
      )}
    </ListBoxItem>
  );

  const palette = (
    <dialog
      ref={setDialogRef}
      {...rest}
      aria-label={ariaLabel ?? placeholder}
      {...mergeProps(cp.root, className)}
      style={{ ...layerStyle, ...style }}
      onClick={(event) => {
        onClick?.(event);
        if (event.target === event.currentTarget) {
          root.close({ event: event.nativeEvent, reason: 'outside-press' });
        }
      }}
      onCancel={(event) => {
        onCancel?.(event);
        event.preventDefault();
        root.close({ event: event.nativeEvent, reason: 'escape-key' });
      }}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event);
        if (event.key !== 'Escape') return;
        event.preventDefault();
        root.close({ event: event.nativeEvent, reason: 'escape-key' });
      }}
    >
      {root.mounted ? (
        <div
          ref={root.setPopupEl}
          {...mergeProps(cp.dialog)}
          {...root.presenceAttrs}
          aria-busy={loading || undefined}
        >
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
              {...mergeProps(cp.results)}
              aria-label={placeholder}
              renderEmptyState={() => (
                <div {...mergeProps(cp.empty)} role={loading ? 'status' : undefined}>
                  {loading ? loadingLabel : emptyLabel}
                </div>
              )}
            >
              {blocks.map((block, index) =>
                block.group ? (
                  <ListBoxSection key={`${index}:${block.group}`} {...mergeProps(cp.group)}>
                    <Header {...mergeProps(cp.groupHeading)}>{block.group}</Header>
                    {block.items.map(renderItem)}
                  </ListBoxSection>
                ) : (
                  block.items.map(renderItem)
                ),
              )}
            </ListBox>
          </Autocomplete>
        </div>
      ) : null}
    </dialog>
  );

  return portalContainer ? createPortal(palette, portalContainer) : palette;
}
