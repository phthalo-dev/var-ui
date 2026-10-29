export const DEFAULT_COMMAND_PALETTE_HOTKEY = 'mod+k';

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
 * ⌘ on Apple platforms and Ctrl elsewhere. Modifiers must match exactly.
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
