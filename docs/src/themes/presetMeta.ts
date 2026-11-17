import { defaultThemeClassName } from '@var-ui/core';

/**
 * Client-safe showcase theme list: ids, labels and class names only. Importing the theme
 * modules (`presets.ts`) in a browser bundle re-registers every theme at runtime, which
 * duplicates the extracted `/themes/<id>.css` and (typestyles#325) leaks mode-aware shadow
 * tokens onto `:root`. Islands that only need class names import this file instead.
 * `presetMeta.test.ts` keeps it in sync with `presets.ts`.
 */
export const docsThemePresetMeta = [
  { id: 'default', label: 'Default', className: defaultThemeClassName, lazyCss: false },
  { id: 'forest', label: 'Forest', className: 'theme-var-ui-forest' },
  { id: 'rose', label: 'Rose', className: 'theme-var-ui-rose' },
  { id: 'amber', label: 'Amber', className: 'theme-var-ui-amber' },
  { id: 'ai-glow', label: 'AI Glow', className: 'theme-var-ui-ai-glow' },
  { id: 'new-wave', label: 'New Wave', className: 'theme-var-ui-new-wave' },
  { id: 'windows-95', label: 'Windows 95', className: 'theme-var-ui-windows-95' },
  { id: 'classic-system', label: 'Classic System', className: 'theme-var-ui-classic-system' },
] as const satisfies readonly { id: string; label: string; className: string; lazyCss?: boolean }[];
