import type { JSX, ReactNode } from 'react';
import { useState } from 'react';
import {
  ColorModeContext,
  type ColorMode,
  type ColorModeContextValue,
  readStoredColorMode,
  useResolvedColorMode,
} from './colorMode';
import { COLOR_MODE_ATTRIBUTE, defaultThemeClassName } from '@var-ui/core/theme-constants';
import { type Direction, resolveDirection } from './direction';
import { DirectionProvider } from './DirectionProvider';
import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect';

export type DesignSystemProviderProps = {
  children: ReactNode;
  defaultColorMode?: ColorMode;
  colorMode?: ColorMode;
  onColorModeChange?: (colorMode: ColorMode) => void;
  /** Theme class name, or a `createDesignTheme` result (`{ className }`). */
  customTheme?: { className: string } | string;
  /**
   * When true, apply the design theme class and `data-color-mode` on
   * `document.documentElement` instead of a wrapper, so page chrome (`body` background /
   * text from core document globals) and portals resolve the same color mode as the app.
   * `color-scheme` comes from the stylesheet (`:root` and `[data-color-mode]`).
   * @default false
   */
  applyToDocument?: boolean;
  /**
   * When set (and the provider is uncontrolled), persists the color mode to `localStorage` under
   * this key: read as the initial color mode on mount, written on every `setColorMode` call.
   */
  storageKey?: string;
  direction?: Direction;
  locale?: string;
};

export function DesignSystemProvider({
  children,
  defaultColorMode = 'light',
  colorMode: controlledColorMode,
  onColorModeChange,
  customTheme,
  applyToDocument = false,
  storageKey,
  direction,
  locale,
}: DesignSystemProviderProps): JSX.Element {
  // Starts at defaultColorMode on every render pass, matching what SSR renders — corrected from
  // localStorage in the layout effect below (client-only, before paint) rather than read here,
  // since reading it synchronously would diverge from the server render and trip React's
  // hydration-mismatch diffing.
  const [uncontrolledColorMode, setUncontrolledColorMode] = useState<ColorMode>(defaultColorMode);
  // When persistence is enabled, stay "not ready" until the layout effect has applied storage
  // so consumers can avoid painting `defaultColorMode` for a frame.
  const [colorModeReady, setColorModeReady] = useState(
    () => controlledColorMode !== undefined || !storageKey,
  );

  useIsomorphicLayoutEffect(() => {
    if (controlledColorMode !== undefined) {
      setColorModeReady(true);
      return;
    }
    if (!storageKey) {
      setColorModeReady(true);
      return;
    }
    const stored = readStoredColorMode(storageKey);
    if (stored !== undefined) {
      setUncontrolledColorMode(stored);
    }
    setColorModeReady(true);
    // Runs once per mount (and again only if storageKey itself changes) — deliberately excludes
    // controlledColorMode/defaultColorMode so it doesn't fight later setColorMode calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const colorMode = controlledColorMode ?? uncontrolledColorMode;
  const resolvedColorMode = useResolvedColorMode(colorMode);
  const setColorMode = (nextColorMode: ColorMode): void => {
    if (controlledColorMode === undefined) {
      setUncontrolledColorMode(nextColorMode);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, nextColorMode);
        } catch {
          // Storage blocked/full — the preference still applies for this session.
        }
      }
    }
    onColorModeChange?.(nextColorMode);
  };

  const value: ColorModeContextValue = {
    colorMode,
    resolvedColorMode,
    setColorMode,
    colorModeReady,
  };

  const themeClassName =
    typeof customTheme === 'string'
      ? customTheme
      : (customTheme?.className ?? defaultThemeClassName);
  const resolvedDirection = resolveDirection({ direction, locale });

  useIsomorphicLayoutEffect(() => {
    if (!applyToDocument || typeof document === 'undefined' || !colorModeReady) return;
    const root = document.documentElement;

    root.classList.add(themeClassName);
    root.style.colorScheme = '';
    if (colorMode === 'light' || colorMode === 'dark') {
      root.setAttribute(COLOR_MODE_ATTRIBUTE, colorMode);
    } else {
      root.removeAttribute(COLOR_MODE_ATTRIBUTE);
    }

    return () => {
      // Only remove the theme class we manage. Leave `data-color-mode` in place so
      // Strict Mode remounts (and the init script's correct attrs) aren't cleared mid-flash.
      root.classList.remove(themeClassName);
    };
  }, [applyToDocument, themeClassName, colorMode, colorModeReady]);

  const directed = (
    <DirectionProvider
      direction={direction}
      locale={locale}
      applyToDocument={applyToDocument}
      suppressWrapper={!applyToDocument}
    >
      {children}
    </DirectionProvider>
  );

  if (applyToDocument) {
    return <ColorModeContext.Provider value={value}>{directed}</ColorModeContext.Provider>;
  }

  return (
    <ColorModeContext.Provider value={value}>
      <div
        className={themeClassName}
        dir={resolvedDirection}
        {...(locale ? { lang: locale } : {})}
        {...(colorMode === 'light' || colorMode === 'dark'
          ? { [COLOR_MODE_ATTRIBUTE]: colorMode }
          : {})}
        style={{ display: 'contents' }}
      >
        {directed}
      </div>
    </ColorModeContext.Provider>
  );
}
