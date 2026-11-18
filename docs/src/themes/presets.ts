import { defaultThemeClassName } from '@var-ui/core';
import { aiGlowTheme } from './ai-glow';
import { amberTheme } from './amber';
import { classicSystemTheme } from './classic-system';
import { forestTheme } from './forest';
import { newWaveTheme } from './new-wave';
import { roseTheme } from './rose';
import { windows95Theme } from './windows-95';

/**
 * Single source for showcase theme picker + `varDocs({ theme.presets })`.
 * Add a theme: create `src/themes/{id}.ts` + `typestyles-themes/{id}.ts`, then append here.
 */
export const docsThemePresets = [
  {
    id: 'default',
    label: 'Default',
    className: defaultThemeClassName,
    // Phthalo, the default accent (hue 175).
    swatch: 'oklch(0.62 0.15 175)',
    lazyCss: false as boolean | undefined,
  },
  {
    id: 'forest',
    label: 'Forest',
    className: forestTheme.className,
    swatch: '#16a34a',
  },
  {
    id: 'rose',
    label: 'Rose',
    className: roseTheme.className,
    swatch: '#e11d48',
  },
  {
    id: 'amber',
    label: 'Amber',
    className: amberTheme.className,
    swatch: '#d97706',
  },
  {
    id: 'ai-glow',
    label: 'AI Glow',
    className: aiGlowTheme.className,
    swatch: '#0ea5e9',
  },
  {
    id: 'new-wave',
    label: 'New Wave',
    className: newWaveTheme.className,
    swatch: '#ff4fd8',
  },
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

export type ShowcaseThemeId = (typeof docsThemePresets)[number]['id'];
