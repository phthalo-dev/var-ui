import { banner } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const b = banner({ tone: 'success', appearance: 'solid' });
  const content = serializeHtmlTag(
    'div',
    mergeProps(b.content),
    serializeHtmlTag('span', {}, 'Deploy finished in 42s.'),
  );
  return serializeHtmlTag(
    'div',
    { ...mergeProps(b.root), 'data-var-ui-banner': true, role: 'status' },
    content,
  );
}
