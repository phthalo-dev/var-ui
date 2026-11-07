import { center, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const centerRp = mergeProps(center({ inline: false }));
  const text = serializeHtmlTag('p', mergeProps(textBlock({})), 'Centered');
  return serializeHtmlTag(
    'div',
    { ...centerRp, style: 'height: 7.5rem; border: 0.0625rem dashed var(--color-border)' },
    text,
  );
}
