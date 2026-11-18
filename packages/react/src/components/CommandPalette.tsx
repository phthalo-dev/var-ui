import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Autocomplete,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListStateContext,
  TextField,
} from 'react-aria-components';
import type { ComponentAttrsResult } from 'typestyles';
import { commandPalette } from '@var-ui/core/components/commandPalette';
import {
  commandMetaSnippet,
  matchCommandItem,
  rankCommandItems,
} from '@var-ui/core/shared/commandSearch';
import { findTextMatch } from '@var-ui/core/shared/textMatch';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import {
  useDialogElement,
  useMergedRef,
  useOverlayRoot,
  type OverlayOpenChangeHandler,
} from '../overlays';
import { cx, mergeProps } from 'typestyles';
import { Kbd } from './Kbd';
import type { CommandPaletteController } from '../internal/commandPaletteController';
import { DEFAULT_COMMAND_PALETTE_HOTKEY } from '../internal/commandPaletteHotkey';
import { useHotkeys, type HotkeyHandler } from '../hooks/useHotkeys';

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
   * without a heading. While filtering, items sharing a `group` are gathered and groups are ordered
   * by their best match.
   */
  group?: string;
  /**
   * Leading type icon (page, component, theme…): an icon registry name or a node, rendered in a
   * small tile before the title.
   */
  icon?: IconName | Exclude<ReactNode, string>;
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
  open?: boolean;
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
  /** Message shown when no items match the query, followed by the query. @default 'No results' */
  emptyLabel?: string;
  /** Second line of the empty state, e.g. a suggestion ("Try 'button'"). */
  emptyHint?: string;
  /** Label of the Cancel button shown on touch-first devices (no Escape key). @default 'Cancel' */
  cancelLabel?: string;
  /**
   * Key combo that toggles the palette, e.g. `'mod+k'`, `'ctrl+shift+p'`, or an array of combos.
   * `mod` is ⌘ on Apple platforms and Ctrl elsewhere (either is accepted). `true` uses the default
   * and `false` disables the listener. @default 'mod+k'
   */
  hotkey?: boolean | string | string[];
  /**
   * Wraps the part of each title and meta that matches the query in a `<mark>`. Pass `false` to
   * render plain text. @default true
   */
  highlightMatches?: boolean;
  /**
   * Remembers chosen items in `localStorage` under this key and lists them under a "Recent"
   * heading while the query is empty. Omit to keep no history.
   */
  recentKey?: string;
  /** Heading of the recent items group (see `recentKey`). @default 'Recent' */
  recentLabel?: string;
  /**
   * Overrides the default case-insensitive title/meta/keywords match. Matches are ranked by
   * relevance (exact title > title prefix > title word-start > title substring > keyword >
   * description), groups by their best hit, and the top hit is active. Pass `false` to skip
   * client-side filtering and ranking, e.g. when `items` already are the (remote) results for the
   * query.
   */
  filter?: ((item: CommandPaletteItem, query: string) => boolean) | false;
  /** Called with the input value as it changes, and with `''` when the palette closes. */
  onQueryChange?: (query: string) => void;
  /** Shows a busy state and `loadingLabel` in place of `emptyLabel` while `items` is empty. */
  loading?: boolean;
  /** Message shown while `loading` and no items are listed. @default 'Loading…' */
  loadingLabel?: string;
  /** Keyboard hints under the results (↑↓ navigate, ↵ open, esc close). @default true */
  hints?: boolean;
};

function defaultFilter(item: CommandPaletteItem, query: string): boolean {
  return matchCommandItem(item, query);
}

const subscribeNever = () => () => {};
const getFalse = () => false;

function renderHighlighted(text: string, query: string, cp: { mark: ComponentAttrsResult }) {
  const match = findTextMatch(text, query);
  if (!match) return text;
  const [start, end] = match;
  return (
    <>
      {text.slice(0, start)}
      <mark {...mergeProps(cp.mark)}>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

const RECENT_LIMIT = 5;
const RECENT_PREFIX = 'recent:';

function readRecent(key: string | undefined): string[] {
  if (!key || typeof localStorage === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeRecent(key: string, ids: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode, quota): history is a convenience only.
  }
}

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

/**
 * A result row's content. Moving the pointer over it makes it the active (virtually focused) row,
 * so keyboard and pointer share one highlight instead of painting two rows.
 */
function ResultRow({
  id,
  attrs,
  children,
}: {
  id: string;
  attrs: ReturnType<typeof mergeProps>;
  children: ReactNode;
}): JSX.Element {
  const state = useContext(ListStateContext);
  const activate = () => {
    const manager = state?.selectionManager;
    if (!manager || manager.focusedKey === id) return;
    manager.setFocused(true);
    manager.setFocusedKey(id);
  };
  return (
    <span {...attrs} onPointerMove={activate}>
      {children}
    </span>
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
  emptyHint,
  cancelLabel = 'Cancel',
  hotkey = true,
  highlightMatches = true,
  recentKey,
  recentLabel = 'Recent',
  filter = defaultFilter,
  onQueryChange,
  loading = false,
  loadingLabel = 'Loading…',
  hints = true,
  className,
  style,
  'aria-label': ariaLabel,
  ref,
  ...rest
}: CommandPaletteProps): JSX.Element {
  const [query, setQueryState] = useState('');
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    onQueryChangeRef.current?.(next);
  }, []);
  const controllerOpen = useSyncExternalStore(
    controller?.subscribe ?? subscribeNever,
    controller?.getSnapshot ?? getFalse,
    getFalse,
  );
  // A controller makes the palette controlled; it is updated after `onOpenChange` unless that
  // was canceled. The `<dialog>` itself is driven by `useDialogElement`.
  const root = useOverlayRoot({
    open: controller ? controllerOpen : openProp,
    defaultOpen,
    onOpenChange: (next, details) => {
      onOpenChange?.(next, details);
      if (!details.isCanceled) controller?.setOpen(next);
    },
  });
  const dialog = useDialogElement(root);
  const setDialogRef = useMergedRef<HTMLDialogElement>(dialog.ref, ref);
  const cp = commandPalette();

  const hotkeyId =
    hotkey === true ? DEFAULT_COMMAND_PALETTE_HOTKEY : hotkey ? [hotkey].flat().join('\0') : '';
  const toggleOnHotkey: HotkeyHandler = (event) => {
    root.setOpen(!root.open, { event, reason: 'imperative' });
  };
  useHotkeys(
    Object.fromEntries(
      hotkeyId ? hotkeyId.split('\0').map((combo) => [combo, toggleOnHotkey]) : [],
    ),
    // The palette opens from anywhere, including text fields, and toggles on held keys as before.
    { ignoreInputs: false, ignoreRepeat: false },
  );

  // Reset once the exit animation is over so the list does not flash while the palette fades.
  useEffect(() => {
    if (!dialog.mounted) setQuery('');
  }, [dialog.mounted, setQuery]);

  // Ranked so the first item is the top hit, which the Autocomplete focuses as the user types.
  const visibleItems = useMemo(
    () =>
      filter
        ? rankCommandItems(items, query, filter === defaultFilter ? undefined : filter)
        : items,
    [items, filter, query],
  );

  const [recentIds, setRecentIds] = useState<string[]>([]);
  // Read on open (not during render) so server and client markup match.
  useEffect(() => {
    if (dialog.mounted) setRecentIds(readRecent(recentKey));
  }, [dialog.mounted, recentKey]);

  const recentItems = useMemo(() => {
    if (!recentKey || query.trim() !== '') return [];
    return (
      recentIds
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is CommandPaletteItem => item !== undefined)
        // Out of their own section, titles can be ambiguous ("Overview"): the subtitle names it.
        .map((item) =>
          item.group
            ? { ...item, meta: [item.group, item.meta].filter(Boolean).join(' · ') }
            : item,
        )
    );
  }, [recentKey, recentIds, items, query]);
  const empty = recentItems.length === 0 && visibleItems.length === 0;
  const trimmedQuery = query.trim();

  const blocks = useMemo(() => toBlocks(visibleItems), [visibleItems]);

  const remember = (id: string) => {
    if (!recentKey) return;
    const next = [id, ...readRecent(recentKey).filter((entry) => entry !== id)].slice(
      0,
      RECENT_LIMIT,
    );
    writeRecent(recentKey, next);
    setRecentIds(next);
  };

  const renderItem = (item: CommandPaletteItem, keyPrefix = '') => {
    // A description-only match shows the snippet around it, not a truncated start.
    const meta = filter ? commandMetaSnippet(item, query) : item.meta;
    return (
      <ListBoxItem
        key={keyPrefix + item.id}
        id={keyPrefix + item.id}
        textValue={item.title}
        {...mergeProps(cp.result)}
        onAction={() => {
          remember(item.id);
          item.onSelect?.();
          onAction?.(item.id);
          if (closeOnAction) root.close({ reason: 'trigger-press' });
        }}
      >
        {({ isFocused }) => (
          <ResultRow
            id={keyPrefix + item.id}
            attrs={mergeProps(cp.resultLink, cx(isFocused && cp.resultLinkActive))}
          >
            {item.icon ? (
              <span {...mergeProps(cp.resultIcon)} aria-hidden="true">
                {isIconName(item.icon) ? (
                  <Icon name={item.icon} size="sm" />
                ) : (
                  <Icon size="sm">{item.icon}</Icon>
                )}
              </span>
            ) : null}
            <span {...mergeProps(cp.resultBody)}>
              <span {...mergeProps(cp.resultTitle)}>
                {highlightMatches ? renderHighlighted(item.title, query, cp) : item.title}
              </span>
              {meta ? (
                <span {...mergeProps(cp.resultMeta)}>
                  {highlightMatches ? renderHighlighted(meta, query, cp) : meta}
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
          </ResultRow>
        )}
      </ListBoxItem>
    );
  };

  return (
    <dialog
      ref={setDialogRef}
      {...rest}
      aria-label={ariaLabel ?? placeholder}
      aria-busy={loading || undefined}
      data-open={root.open ? '' : undefined}
      data-closed={root.open ? undefined : ''}
      {...mergeProps(cp.root, className)}
      style={style}
    >
      {dialog.mounted ? (
        <div {...mergeProps(cp.frame)} data-empty={empty ? '' : undefined}>
          <Autocomplete inputValue={query} onInputChange={setQuery}>
            <div {...mergeProps(cp.inputRow)}>
              <span {...mergeProps(cp.inputIcon)}>
                <Icon name="search" />
              </span>
              <TextField aria-label={placeholder}>
                <Input {...mergeProps(cp.input)} placeholder={placeholder} autoFocus />
              </TextField>
              <button
                type="button"
                {...mergeProps(cp.cancel)}
                onClick={(event) => root.close({ event: event.nativeEvent, reason: 'close-press' })}
              >
                {cancelLabel}
              </button>
            </div>
            <ListBox
              {...mergeProps(cp.results)}
              aria-label={placeholder}
              renderEmptyState={() =>
                loading ? (
                  <div {...mergeProps(cp.empty)} role="status">
                    {loadingLabel}
                  </div>
                ) : (
                  <div {...mergeProps(cp.empty)} role="status">
                    <span {...mergeProps(cp.emptyIcon)} aria-hidden="true">
                      <Icon name="search" />
                    </span>
                    <p {...mergeProps(cp.emptyTitle)}>
                      {trimmedQuery ? `${emptyLabel} for “${trimmedQuery}”` : emptyLabel}
                    </p>
                    {emptyHint ? <p {...mergeProps(cp.emptyHint)}>{emptyHint}</p> : null}
                  </div>
                )
              }
            >
              {recentItems.length > 0 ? (
                <ListBoxSection key="recent" {...mergeProps(cp.group)}>
                  <Header {...mergeProps(cp.groupHeading)}>{recentLabel}</Header>
                  {recentItems.map((item) => renderItem(item, RECENT_PREFIX))}
                </ListBoxSection>
              ) : null}
              {blocks.map((block, index) =>
                block.group ? (
                  <ListBoxSection key={`${index}:${block.group}`} {...mergeProps(cp.group)}>
                    <Header {...mergeProps(cp.groupHeading)}>{block.group}</Header>
                    {block.items.map((item) => renderItem(item))}
                  </ListBoxSection>
                ) : (
                  block.items.map((item) => renderItem(item))
                ),
              )}
            </ListBox>
          </Autocomplete>
          {hints ? (
            <div {...mergeProps(cp.footer)} aria-hidden="true">
              <span {...mergeProps(cp.footerHint)}>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> to navigate
              </span>
              <span {...mergeProps(cp.footerHint)}>
                <Kbd>↵</Kbd> to open
              </span>
              <span {...mergeProps(cp.footerHint)}>
                <Kbd>esc</Kbd> to close
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
