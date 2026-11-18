'use client';

import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, Select, Tabs, type ColorMode } from '@var-ui/react';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStoredColorMode } from '@/lib/storedColorMode';
// Class names only: importing the theme modules re-registers them at runtime and leaks
// their mode-aware shadows onto :root (typestyles#325).
import { docsThemePresetMeta as docsThemePresets } from '@/themes/presetMeta';
import type { ShowcaseThemeId } from '@/themes/presets';
import { playgroundSidebarStyles } from '@/styles/playgroundSidebar';
import {
  ThemePlaygroundAdvancedTab,
  ThemePlaygroundBaseStyles,
  ThemePlaygroundComponentsTab,
} from './ThemePlaygroundBaseStyles';
import { useThemePlaygroundState } from './useThemePlaygroundState';

const STORAGE_KEY = 'theme-mode';

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  const s = playgroundSidebarStyles();
  return (
    <div className={s.controlGroup.className}>
      <span className={s.controlLabel.className}>{label}</span>
      {children}
    </div>
  );
}

export default function PlaygroundEditorSidebar() {
  const { state, patchState } = useThemePlaygroundState();
  const [colorMode, setColorMode] = useState<ColorMode>(
    () => readStoredColorMode(STORAGE_KEY) ?? 'system',
  );
  const s = playgroundSidebarStyles();

  const presetOptions = useMemo(
    () =>
      docsThemePresets.map((theme) => ({
        value: theme.id,
        label: theme.label,
      })),
    [],
  );

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
    return () => observer.disconnect();
  }, [syncColorModeFromStorage]);

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
        <div className={s.root.className} data-playground-editor-sidebar>
          <ControlGroup label="Theme preset">
            <Select
              aria-label="Theme preset"
              options={presetOptions}
              value={state.presetId}
              onValueChange={(key) => {
                if (key) patchState({ presetId: key as ShowcaseThemeId });
              }}
            />
          </ControlGroup>

          <Tabs
            size="sm"
            tabs={[
              {
                value: 'base',
                label: 'Base',
                content: <ThemePlaygroundBaseStyles state={state} onChange={patchState} />,
              },
              {
                value: 'components',
                label: 'Components',
                content: <ThemePlaygroundComponentsTab />,
              },
              {
                value: 'advanced',
                label: 'Advanced',
                content: <ThemePlaygroundAdvancedTab />,
              },
            ]}
          />
        </div>
      </IconProvider>
    </DesignSystemProvider>
  );
}
