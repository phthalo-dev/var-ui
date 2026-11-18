'use client';

import { defaultIcons } from '@var-ui/icons';
import {
  Button,
  DesignSystemProvider,
  IconProvider,
  SegmentedControl,
  type ColorMode,
  combine,
  mergeProps,
} from '@var-ui/react';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ensureShowcaseThemeStyles } from '@/lib/showcaseThemeStyles';
import { readStoredColorMode } from '@/lib/storedColorMode';
import { docsThemePresetMeta } from '@/themes/presetMeta';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { BentoShowcase } from '../homepage/BentoShowcase';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import { generateThemeCode } from './generateThemeCode';
import { buildPreviewOverrideStyle } from './themePlaygroundTokens';
import { useThemePlaygroundState } from './useThemePlaygroundState';
import type { ThemePlaygroundViewport } from './themePlaygroundState';

const STORAGE_KEY = 'theme-mode';

const VIEWPORT_OPTIONS = [
  { value: 'desktop' as const, label: 'Desktop' },
  { value: 'mobile' as const, label: 'Mobile' },
];

export default function ThemePlayground({
  toolbarStart,
}: {
  /** Leading toolbar content (the shell's Theme controls drawer below `lg`). */
  toolbarStart?: ReactNode;
} = {}) {
  const { state, patchState } = useThemePlaygroundState();
  const [colorMode, setColorMode] = useState<ColorMode>(
    () => readStoredColorMode(STORAGE_KEY) ?? 'system',
  );
  const s = themePlaygroundStyles();

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) setColorMode(stored);
  }, []);

  // Showcase theme CSS is extracted to /themes/<id>.css; load the selected one.
  useEffect(() => {
    const theme = docsThemePresetMeta.find((entry) => entry.id === state.presetId);
    if (theme) ensureShowcaseThemeStyles(theme);
  }, [state.presetId]);

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
        <div {...mergeProps(s.root)} data-theme-playground>
          <div {...mergeProps(s.workspace)}>
            <div {...mergeProps(s.preview)}>
              <div {...mergeProps(s.toolbar)}>
                {toolbarStart}
                <SegmentedControl
                  aria-label="Preview viewport"
                  options={VIEWPORT_OPTIONS}
                  value={state.viewport}
                  onValueChange={(next) => {
                    if (next) patchState({ viewport: next as ThemePlaygroundViewport });
                  }}
                />
                <Button appearance="outline" size="sm" onClick={handleExport}>
                  Export
                </Button>
              </div>
              <div {...mergeProps(s.previewInner)}>
                <div
                  {...combine(
                    (state.viewport === 'mobile' ? s.previewFrameMobile : s.previewFrame).className,
                  )}
                >
                  <BentoShowcase themeId={state.presetId} previewStyle={previewStyle} />
                </div>
              </div>
            </div>
          </div>
          <div {...mergeProps(s.code)}>
            <HighlightedCodeBlock
              code={codeOutput.code}
              language={codeOutput.language}
              filename={codeOutput.filename}
            />
          </div>
        </div>
      </IconProvider>
    </DesignSystemProvider>
  );
}
