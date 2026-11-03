import { useEffect, useRef, useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type ParsedHotkey = {
  key: string;
  mod: boolean;
  meta: boolean;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
};

const KEY_ALIASES: Record<string, string> = { space: ' ', esc: 'escape', plus: '+' };

function parseHotkey(combo: string): ParsedHotkey {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);
  const rawKey = parts.pop() ?? '';
  const mods = new Set(parts);
  return {
    key: KEY_ALIASES[rawKey] ?? rawKey,
    mod: mods.has('mod'),
    meta: mods.has('meta') || mods.has('cmd'),
    ctrl: mods.has('ctrl') || mods.has('control'),
    shift: mods.has('shift'),
    alt: mods.has('alt') || mods.has('option'),
  };
}

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * Whether `event` matches `combo`, e.g. `'mod+k'`, `'ctrl+shift+p'`, `'alt+space'`. `mod` is
 * ⌘ on Apple platforms and Ctrl elsewhere. Modifiers must match exactly. Keys compare
 * against `event.key` (case-insensitive).
 */
export function matchesHotkey(event: KeyboardEvent, combo: string): boolean {
  const parsed = parseHotkey(combo);
  if (!parsed.key || event.key.toLowerCase() !== parsed.key) return false;
  if (event.shiftKey !== parsed.shift || event.altKey !== parsed.alt) return false;
  if (parsed.mod) {
    const apple = isApplePlatform();
    return apple ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
  }
  return event.metaKey === parsed.meta && event.ctrlKey === parsed.ctrl;
}

/** Whether the event came from a place where typing is expected. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLInputElement &&
      !['button', 'checkbox', 'radio', 'submit', 'reset', 'image', 'range', 'color'].includes(
        target.type,
      ))
  );
}

export type HotkeyHandler = (event: KeyboardEvent) => void;

export type UseHotkeysOptions = {
  /**
   * Where to listen. A ref listens on that element (it must be focusable or contain focus).
   * @default window
   */
  target?: RefObject<EventTarget | null> | EventTarget | null;
  /** @default 'keydown' */
  event?: 'keydown' | 'keyup';
  /**
   * Skip events whose target is a text input, textarea, select or contenteditable element, so
   * bare keys like `/` do not fire while typing. Set `false` for shortcuts that should work
   * everywhere, such as `mod+k`.
   * @default true
   */
  ignoreInputs?: boolean;
  /**
   * Call `event.preventDefault()` when a binding matches.
   * @default true
   */
  preventDefault?: boolean;
  /**
   * Skip auto-repeated key events while a key is held.
   * @default true
   */
  ignoreRepeat?: boolean;
  /**
   * When false, no bindings fire.
   * @default true
   */
  enabled?: boolean;
};

/**
 * Keyboard shortcuts. `bindings` maps combos to handlers; a combo is modifiers and a key joined
 * with `+`: `'mod+k'`, `'shift+/'`, `'ctrl+alt+delete'`, `'escape'`, `'alt+space'`. Modifiers are
 * `mod` (⌘ on Apple platforms, Ctrl elsewhere), `meta`/`cmd`, `ctrl`, `alt`/`option` and `shift`,
 * and must match exactly. The key is compared with `event.key`, so layout-dependent characters
 * follow the user's keyboard. Several combos can share a handler by repeating it. Handlers may
 * change on every render; the listener is not re-attached.
 *
 * By default events from text fields and contenteditable elements are ignored; pass
 * `ignoreInputs: false` to opt in.
 *
 * ```tsx
 * useHotkeys({
 *   'mod+k': () => palette.show(),
 *   '/': () => searchRef.current?.focus(),
 *   escape: () => palette.hide(),
 * });
 * ```
 */
export function useHotkeys(
  bindings: Record<string, HotkeyHandler>,
  {
    target,
    event = 'keydown',
    ignoreInputs = true,
    preventDefault = true,
    ignoreRepeat = true,
    enabled = true,
  }: UseHotkeysOptions = {},
): void {
  const latest = useRef(bindings);
  useEffect(() => {
    latest.current = bindings;
  });

  // Re-attach only when the set of combos changes, not on every new handler object.
  const combosKey = Object.keys(bindings).join('\0');

  // A ref's node appears after commit, and a later mount does not change the ref object, so
  // resolve it in a layout effect (it runs every commit) and subscribe to that node.
  const [node, setNode] = useState<EventTarget | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      setNode(null);
      return;
    }
    const next: EventTarget | null =
      target === undefined
        ? window
        : target && 'current' in target
          ? target.current
          : (target as EventTarget | null);
    setNode((current) => (current === next ? current : next));
  });

  useEffect(() => {
    if (!enabled || !combosKey || !node) return undefined;
    const combos = combosKey.split('\0');

    function listener(e: Event) {
      const keyEvent = e as KeyboardEvent;
      if (ignoreRepeat && keyEvent.repeat) return;
      if (ignoreInputs && isEditableTarget(keyEvent.target)) return;
      for (const combo of combos) {
        if (!matchesHotkey(keyEvent, combo)) continue;
        if (preventDefault) keyEvent.preventDefault();
        latest.current[combo]?.(keyEvent);
        return;
      }
    }
    node.addEventListener(event, listener);
    return () => node.removeEventListener(event, listener);
  }, [combosKey, enabled, event, ignoreInputs, ignoreRepeat, preventDefault, node]);
}
