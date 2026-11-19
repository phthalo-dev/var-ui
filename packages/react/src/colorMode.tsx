import {
  getColorModeInitScript as getCoreColorModeInitScript,
  type ColorModeInitScriptOptions,
} from '@var-ui/core/color-mode-script';
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

/** Options for {@link getColorModeInitScript}: the provider's `storageKey`, `defaultColorMode` and theme class. */
export type GetColorModeInitScriptOptions = ColorModeInitScriptOptions;

/**
 * Inline `<script>` body that applies DesignSystemProvider's stored colour mode (and theme
 * class) before first paint. Render it first in `<head>` in an SSR app. For a Vite SPA, use the
 * `varUiColorMode` plugin from `@var-ui/core/vite`, which injects the same script into
 * `index.html`. Keep it in sync with the provider's `applyToDocument` effect.
 */
export const getColorModeInitScript: (options: GetColorModeInitScriptOptions) => string =
  getCoreColorModeInitScript;

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used inside DesignSystemProvider');
  }
  return context;
}
