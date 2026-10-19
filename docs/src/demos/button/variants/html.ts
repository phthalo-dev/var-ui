import { button, stack } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['filled', 'outline', 'subtle', 'ghost'] as const;

function toneLabel(tone: (typeof tones)[number]) {
  return tone.charAt(0).toUpperCase() + tone.slice(1);
}

function buttonTag(label: string, options: NonNullable<Parameters<typeof button>[0]>): string {
  return serializeHtmlTag('button', { type: 'button', ...mergeProps(button(options)) }, label);
}

export function render(): string {
  const row = stack({
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  });
  const root = stack({ direction: 'column', gap: 'lg', align: 'stretch', justify: 'start' });

  const rows = appearances
    .map((appearance) => {
      const buttons = tones
        .map((tone) => buttonTag(toneLabel(tone), { tone, appearance }))
        .join('');
      return serializeHtmlTag('div', mergeProps(row), buttons);
    })
    .join('');

  return serializeHtmlTag('div', mergeProps(root), rows);
}
