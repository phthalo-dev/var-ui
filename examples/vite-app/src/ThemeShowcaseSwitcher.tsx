import { defaultThemeClassName } from '@var-ui/core';
import {
  aiGlowTheme,
  amberTheme,
  classicSystemTheme,
  forestTheme,
  newWaveTheme,
  roseTheme,
  windows95Theme,
} from './themes';
import { Button, HStack, Stack, Text } from '@var-ui/react';

export type ShowcaseThemeId =
  | 'default'
  | 'forest'
  | 'rose'
  | 'amber'
  | 'ai-glow'
  | 'new-wave'
  | 'windows-95'
  | 'classic-system';

type ShowcaseTheme = {
  id: ShowcaseThemeId;
  label: string;
  className: string;
  swatch: string;
};

/** Showcase themes — default from core, palette/style examples from docs `src/themes`. */
export const SHOWCASE_THEMES: ShowcaseTheme[] = [
  { id: 'default', label: 'Default', className: defaultThemeClassName, swatch: '#64748b' },
  { id: 'forest', label: 'Forest', className: forestTheme.className, swatch: '#16a34a' },
  { id: 'rose', label: 'Rose', className: roseTheme.className, swatch: '#e11d48' },
  { id: 'amber', label: 'Amber', className: amberTheme.className, swatch: '#d97706' },
  { id: 'ai-glow', label: 'AI Glow', className: aiGlowTheme.className, swatch: '#0ea5e9' },
  { id: 'new-wave', label: 'New Wave', className: newWaveTheme.className, swatch: '#ff4fd8' },
  {
    id: 'windows-95',
    label: 'Windows 95',
    className: windows95Theme.className,
    swatch: '#000080',
  },
  {
    id: 'classic-system',
    label: 'Classic System',
    className: classicSystemTheme.className,
    swatch: '#000000',
  },
];

export function getShowcaseTheme(id: ShowcaseThemeId): ShowcaseTheme {
  return SHOWCASE_THEMES.find((theme) => theme.id === id) ?? SHOWCASE_THEMES[0];
}

export type ThemeShowcaseSwitcherProps = {
  selected: ShowcaseThemeId;
  onSelect: (id: ShowcaseThemeId) => void;
};

export function ThemeShowcaseSwitcher({ selected, onSelect }: ThemeShowcaseSwitcherProps) {
  return (
    <Stack gap="xs">
      <Text as="span" size="sm" tone="secondary">
        Palette / style
      </Text>
      <HStack gap="xs" wrap>
        {SHOWCASE_THEMES.map((theme) => {
          const isActive = theme.id === selected;
          return (
            <Button
              key={theme.id}
              tone={isActive ? 'accent' : 'neutral'}
              appearance={isActive ? 'filled' : 'subtle'}
              onClick={() => onSelect(theme.id)}
              aria-pressed={isActive}
            >
              <span
                aria-hidden
                style={{
                  backgroundColor: theme.swatch,
                  borderRadius: '999px',
                  display: 'inline-block',
                  height: '0.625rem',
                  width: '0.625rem',
                }}
              />
              {theme.label}
            </Button>
          );
        })}
      </HStack>
    </Stack>
  );
}
