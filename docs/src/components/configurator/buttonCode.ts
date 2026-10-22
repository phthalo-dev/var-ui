import { designTokens as t, type Tone, type ToneAppearance } from '@var-ui/core';
import type { DocsFramework } from '@var-ui/docs-components/framework';

export type ButtonConfiguratorState = {
  appearance: ToneAppearance;
  tone: Tone;
  size: 'sm' | 'md' | 'lg';
  isDisabled: boolean;
  elevated: boolean;
  label: string;
};

const APPEARANCE_OPTIONS: { id: ToneAppearance; label: string }[] = [
  { id: 'filled', label: 'Filled' },
  { id: 'outline', label: 'Outline' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'ghost', label: 'Ghost' },
];

const TONE_OPTIONS: { id: Tone; label: string; swatch: string }[] = [
  { id: 'neutral', label: 'Neutral', swatch: t.color.text.secondary.var },
  { id: 'accent', label: 'Accent', swatch: t.color.tone.accent.foreground.var },
  { id: 'success', label: 'Success', swatch: t.color.tone.success.foreground.var },
  { id: 'warning', label: 'Warning', swatch: t.color.tone.warning.foreground.var },
  { id: 'danger', label: 'Danger', swatch: t.color.tone.danger.foreground.var },
  { id: 'info', label: 'Info', swatch: t.color.tone.info.foreground.var },
];

const SIZE_OPTIONS = ['sm', 'md', 'lg'] as const;

export { APPEARANCE_OPTIONS, SIZE_OPTIONS, TONE_OPTIONS };

function reactProps(state: ButtonConfiguratorState): string {
  const attrs: string[] = [];
  if (state.tone !== 'neutral') attrs.push(`tone="${state.tone}"`);
  if (state.appearance !== 'subtle') attrs.push(`appearance="${state.appearance}"`);
  if (state.size !== 'md') attrs.push(`size="${state.size}"`);
  if (state.elevated) attrs.push('elevated');
  if (state.isDisabled) attrs.push('isDisabled');
  return attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
}

function astroProps(state: ButtonConfiguratorState): string {
  const attrs: string[] = [];
  if (state.tone !== 'neutral') attrs.push(`tone="${state.tone}"`);
  if (state.appearance !== 'subtle') attrs.push(`appearance="${state.appearance}"`);
  if (state.size !== 'md') attrs.push(`size="${state.size}"`);
  if (state.elevated) attrs.push('elevated');
  if (state.isDisabled) attrs.push('disabled');
  return attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
}

function htmlAttrs(state: ButtonConfiguratorState): string {
  const attrs = [
    'type="button"',
    'class="var-ui-button"',
    `data-tone="${state.tone}"`,
    `data-appearance="${state.appearance}"`,
    `data-size="${state.size}"`,
    'data-layout="default"',
  ];
  if (state.elevated) attrs.push('data-elevated');
  if (state.isDisabled) attrs.push('disabled');
  return attrs.join(' ');
}

export function generateButtonCode(
  framework: DocsFramework,
  state: ButtonConfiguratorState,
): { code: string; language: string; filename: string } {
  switch (framework) {
    case 'react':
      return {
        code: `import { Button } from '@var-ui/react';

export default function Demo() {
  return <Button${reactProps(state)}>${state.label}</Button>;
}`,
        language: 'tsx',
        filename: 'Demo.tsx',
      };
    case 'astro':
      return {
        code: `---
import { Button } from '@var-ui/astro';
---

<Button${astroProps(state)}>${state.label}</Button>`,
        language: 'astro',
        filename: 'Demo.astro',
      };
    case 'html':
      return {
        code: `<button ${htmlAttrs(state)}>${state.label}</button>`,
        language: 'html',
        filename: 'index.html',
      };
  }
}
