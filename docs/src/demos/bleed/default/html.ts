import { bleed, stack, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const text = (s: string) => serializeHtmlTag('p', mergeProps(textBlock({})), s);
  const band = serializeHtmlTag(
    'div',
    {
      ...mergeProps(bleed({ align: 'content' })),
      style:
        '--var-ui-bleed-gutter: 1.5rem; background: var(--var-ui-color-background-subtle); padding-block: 0.75rem',
    },
    text('A full-bleed band, content on the column'),
  );
  const column = serializeHtmlTag(
    'div',
    { ...mergeProps(stack({ gap: 'sm' })), style: 'max-width: 20rem; margin-inline: auto' },
    text('The column') + band + text('The column again'),
  );
  return serializeHtmlTag(
    'div',
    {
      style:
        'container-type: inline-size; padding-inline: 1.5rem; border: 0.0625rem dashed var(--var-ui-color-border-default)',
    },
    column,
  );
}
