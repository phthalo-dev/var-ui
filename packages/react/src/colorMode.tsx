import { COLOR_MODE_ATTRIBUTE } from '@var-ui/core/theme-constants';
import { createContext, useContext, useState } from 'react';
import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect';

export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

export type ColorModeContextValue = {
  colorMode: ColorMode;
  resolvedColorMode: ResolvedColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  /**
   * False until a `storageKey` preference has been read into React state (SSR starts with
   * `defaultColorMode`). When there is no `storageKey`, this is always true.
   * Use it to avoid painting color-mode UI with the default before persistence hydrates.
   */
  colorModeReady: boolean;
};

function hasMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

export function useResolvedColorMode(colorMode: ColorMode): ResolvedColorMode {
  // Starts false (matching what SSR would compute) on every environment; corrected client-side
  // in the layout effect below before paint, never read synchronously from matchMedia here.
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (colorMode !== 'system' || !hasMatchMedia()) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: { matches: boolean }) => setSystemPrefersDark(event.matches);
    setSystemPrefersDark(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [colorMode]);

  if (colorMode === 'system') return systemPrefersDark ? 'dark' : 'light';
  return colorMode;
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);

const VALID_COLOR_MODES: ColorMode[] = ['light', 'dark', 'system'];

export function readStoredColorMode(storageKey: string | undefined): ColorMode | undefined {
  if (!storageKey || typeof window === 'undefined') return undefined;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(storageKey);
  } catch {
    // Blocked storage (privacy mode, disabled cookies) — fall back to the default.
    return undefined;
  }
  return VALID_COLOR_MODES.includes(stored as ColorMode) ? (stored as ColorMode) : undefined;
}

export type GetColorModeInitScriptOptions = {
  storageKey: string;
  defaultColorMode: ColorMode;
  /** When set, adds this class to `document.documentElement` before paint (use with `applyToDocument`). */
  themeClassName?: string;
};

/**
 * Returns an inline `<script>` body that reproduces DesignSystemProvider's color-mode
 * resolution synchronously, before first paint. Render it as the first child of `<head>` in an
 * SSR app (before any other head content) to eliminate flash-of-wrong-mode on load.
 *
 * Built as a plain string template rather than via `Function.prototype.toString()` — a real
 * function's stringified source isn't guaranteed byte-identical between an app's SSR and client
 * bundles (different transform passes), which caused a hydration mismatch on this script's
 * `dangerouslySetInnerHTML` content. `light` and `dark` set `data-color-mode`; `system` removes
 * it so `color-scheme: light dark` on `:root` follows the OS. Keep that in sync with
 * DesignSystemProvider's `applyToDocument` effect.
 */
export function getColorModeInitScript({
  storageKey,
  defaultColorMode,
  themeClassName,
}: GetColorModeInitScriptOptions): string {
  var storageKeyJson = JSON.stringify(storageKey);
  var defaultColorModeJson = JSON.stringify(defaultColorMode);
  var themeClassStmt = themeClassName
    ? 'document.documentElement.classList.add(' + JSON.stringify(themeClassName) + ');'
    : '';
  const attributeJson = JSON.stringify(COLOR_MODE_ATTRIBUTE);
  return (
    '(function(){' +
    'var VALID=["light","dark","system"];' +
    'var stored=null;' +
    'try{stored=window.localStorage.getItem(' +
    storageKeyJson +
    ')}catch(e){}' +
    'var colorMode=VALID.indexOf(stored)!==-1?stored:' +
    defaultColorModeJson +
    ';' +
    themeClassStmt +
    'var root=document.documentElement;' +
    'root.style.colorScheme="";' +
    'if(colorMode==="light"||colorMode==="dark"){root.setAttribute(' +
    attributeJson +
    ',colorMode)}else{root.removeAttribute(' +
    attributeJson +
    ')}' +
    '})();'
  );
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used inside DesignSystemProvider');
  }
  return context;
}
