import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, type ColorMode } from '@var-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureShowcaseThemeStyles } from '@/lib/showcaseThemeStyles';
import { readStoredColorMode } from '@/lib/storedColorMode';
import { docsThemePresetMeta as docsThemePresets } from '@/themes/presetMeta';
import { BentoShowcase } from './BentoShowcase';
import { ThemeShowcaseSwitcher, type ShowcaseThemeId } from './ThemeShowcaseSwitcher';

const STORAGE_KEY = 'theme-mode';

function readInitialColorMode(): ColorMode {
  return readStoredColorMode(STORAGE_KEY) ?? 'system';
}

/**
 * Homepage product theater: a theme picker with a live token readout over a bento of
 * `@var-ui/react` product UI.
 *
 * Color mode is controlled and synced with Astro header `ColorModeToggle`, which writes
 * `theme-mode` + `document.documentElement[data-color-mode]` in-tab (no `storage` event).
 */
export default function HomepageIsland() {
  const [showcaseThemeId, setShowcaseThemeId] = useState<ShowcaseThemeId>('default');
  const [colorMode, setColorMode] = useState<ColorMode>(readInitialColorMode);
  const previewRef = useRef<HTMLDivElement>(null);
  const [stylesVersion, setStylesVersion] = useState(0);

  // Showcase themes ship as lazy stylesheets; load them all so every picker swatch and
  // the readout show real theme colors before anything is clicked.
  useEffect(() => {
    for (const theme of docsThemePresets) {
      ensureShowcaseThemeStyles(theme, () => setStylesVersion((n) => n + 1));
    }
  }, []);

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) {
      setColorMode(stored);
    }
  }, []);

  useEffect(() => {
    syncColorModeFromStorage();

    const observer = new MutationObserver(() => {
      syncColorModeFromStorage();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-mode'],
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncColorModeFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, [syncColorModeFromStorage]);

  const handleColorModeChange = useCallback((nextColorMode: ColorMode) => {
    setColorMode(nextColorMode);
    window.localStorage.setItem(STORAGE_KEY, nextColorMode);
  }, []);

  return (
    <DesignSystemProvider
      colorMode={colorMode}
      defaultColorMode="system"
      onColorModeChange={handleColorModeChange}
      storageKey={STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <>
          <ThemeShowcaseSwitcher
            onSelect={setShowcaseThemeId}
            previewRef={previewRef}
            selected={showcaseThemeId}
            stylesVersion={stylesVersion}
          />
          <BentoShowcase ref={previewRef} themeId={showcaseThemeId} />
        </>
      </IconProvider>
    </DesignSystemProvider>
  );
}
