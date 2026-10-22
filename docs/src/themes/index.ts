// Showcase theme presets — side-effect imports register themes for JS consumers of `@/themes`.
import './default';
import './ai-glow';
import './new-wave';
import './windows-95';
import './classic-system';
import './forest';
import './rose';
import './amber';

export { forestTheme, forestThemeTokens } from './forest';
export { roseTheme, roseThemeTokens } from './rose';
export { amberTheme, amberThemeTokens } from './amber';
export { aiGlowTheme, aiGlowThemeTokens } from './ai-glow';
export { newWaveTheme, newWaveThemeTokens } from './new-wave';
export { windows95Theme, windows95ThemeTokens } from './windows-95';
export { classicSystemTheme, classicSystemThemeTokens } from './classic-system';

export type DesignPaletteId = 'default' | 'forest' | 'rose' | 'amber';

export const designPaletteList = [
  { id: 'default' as const, label: 'Slate' },
  { id: 'forest' as const, label: 'Forest' },
  { id: 'rose' as const, label: 'Rose' },
  { id: 'amber' as const, label: 'Amber' },
];

export type DesignStyleId = 'default' | 'ai-glow' | 'new-wave' | 'windows-95' | 'classic-system';

export const designStyleList = [
  { id: 'default' as const, label: 'Default' },
  { id: 'ai-glow' as const, label: 'AI Glow' },
  { id: 'new-wave' as const, label: 'New Wave' },
  { id: 'windows-95' as const, label: 'Windows 95' },
  { id: 'classic-system' as const, label: 'Classic System' },
];
