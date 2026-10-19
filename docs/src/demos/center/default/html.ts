import { center, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const centerRp = mergeProps(center({ inline: false }));
  const text = serializeHtmlTag('p', mergeProps(textBlock({})), 'Centered');
  return serializeHtmlTag(
    'div',
    { ...centerRp, style: 'height: 120px; border: 1px dashed var(--color-border)' },
    text,
  );
}
