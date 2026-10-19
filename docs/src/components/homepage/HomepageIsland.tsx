import { defaultIcons } from '@var-ui/icons';
import {
  DesignSystemProvider,
  IconProvider,
  LayerProvider,
  readStoredColorMode,
  type ColorMode,
} from '@var-ui/react';
import { useCallback, useEffect, useState } from 'react';
import type { DocsFramework } from '@var-ui/docs-components/framework';
import { useDocsFramework } from '@/lib/useDocsFramework';
import { BentoShowcase } from './BentoShowcase';
import { ThemeShowcaseSwitcher, type ShowcaseThemeId } from './ThemeShowcaseSwitcher';

const STORAGE_KEY = 'theme-mode';

function readInitialColorMode(): ColorMode {
  return readStoredColorMode(STORAGE_KEY) ?? 'system';
}

export type HomepageIslandProps = {
  framework?: DocsFramework;
};

/**
 * Homepage product theater: bento tiles follow the docs framework switcher
 * (`@var-ui/react`, `@var-ui/astro` markup, or core HTML recipes).
 *
 * Color mode is controlled and synced with Astro header `ColorModeToggle`, which writes
 * `theme-mode` + `document.documentElement[data-mode]` in-tab (no `storage` event).
 */
export default function HomepageIsland({ framework: initialFramework }: HomepageIslandProps) {
  const framework = useDocsFramework(initialFramework);
  const [showcaseThemeId, setShowcaseThemeId] = useState<ShowcaseThemeId>('default');
  const [colorMode, setColorMode] = useState<ColorMode>(readInitialColorMode);

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
      attributeFilter: ['data-mode'],
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
        <LayerProvider>
          <ThemeShowcaseSwitcher onSelect={setShowcaseThemeId} selected={showcaseThemeId} />
          <BentoShowcase framework={framework} themeId={showcaseThemeId} />
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
