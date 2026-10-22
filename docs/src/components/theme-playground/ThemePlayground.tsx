'use client';

import { defaultIcons } from '@var-ui/icons';
import {
  cx,
  Button,
  DesignSystemProvider,
  IconProvider,
  LayerProvider,
  SegmentedControl,
  type ColorMode,
} from '@var-ui/react';
import type { Selection } from 'react-aria-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { readStoredColorMode } from '@/lib/storedColorMode';
import { useDocsFramework } from '@/lib/useDocsFramework';
import type { DocsFramework } from '@var-ui/docs-components/framework';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { BentoShowcase } from '../homepage/BentoShowcase';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import { generateThemeCode } from './generateThemeCode';
import { buildPreviewOverrideStyle } from './themePlaygroundTokens';
import { useThemePlaygroundState } from './useThemePlaygroundState';
import type { ThemePlaygroundViewport } from './themePlaygroundState';

const STORAGE_KEY = 'theme-mode';

const VIEWPORT_OPTIONS = [
  { id: 'desktop' as const, label: 'Desktop' },
  { id: 'mobile' as const, label: 'Mobile' },
];

export type ThemePlaygroundProps = {
  framework?: DocsFramework;
};

export default function ThemePlayground({ framework: initialFramework }: ThemePlaygroundProps) {
  const framework = useDocsFramework(initialFramework);
  const { state, patchState } = useThemePlaygroundState();
  const [colorMode, setColorMode] = useState<ColorMode>(
    () => readStoredColorMode(STORAGE_KEY) ?? 'system',
  );
  const s = themePlaygroundStyles();

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) setColorMode(stored);
  }, []);

  useEffect(() => {
    syncColorModeFromStorage();
    const observer = new MutationObserver(() => syncColorModeFromStorage());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-mode'],
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncColorModeFromStorage();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, [syncColorModeFromStorage]);

  const previewStyle = useMemo(() => buildPreviewOverrideStyle(state), [state]);
  const codeOutput = useMemo(() => generateThemeCode(state), [state]);

  const handleExport = async () => {
    await navigator.clipboard.writeText(codeOutput.code);
  };

  return (
    <DesignSystemProvider
      colorMode={colorMode}
      defaultColorMode="system"
      onColorModeChange={(next) => {
        setColorMode(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      }}
      storageKey={STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={s.root.className} data-theme-playground>
            <div className={s.workspace.className}>
              <div className={s.preview.className}>
                <div className={s.toolbar.className}>
                  <SegmentedControl
                    aria-label="Preview viewport"
                    options={VIEWPORT_OPTIONS}
                    selectedKeys={[state.viewport]}
                    onSelectionChange={(keys: Selection) => {
                      if (keys === 'all') return;
                      const id = [...keys][0] as ThemePlaygroundViewport;
                      if (id) patchState({ viewport: id });
                    }}
                  />
                  <Button appearance="outline" size="sm" onPress={handleExport}>
                    Export
                  </Button>
                </div>
                <div className={s.previewInner.className}>
                  <div
                    className={cx(
                      (state.viewport === 'mobile' ? s.previewFrameMobile : s.previewFrame)
                        .className,
                    )}
                  >
                    <BentoShowcase
                      framework={framework}
                      themeId={state.presetId}
                      previewStyle={previewStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={s.code.className}>
              <HighlightedCodeBlock
                code={codeOutput.code}
                language={codeOutput.language}
                filename={codeOutput.filename}
              />
            </div>
          </div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
