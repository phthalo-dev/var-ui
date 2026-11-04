import { scrollArea } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = scrollArea({ orientation: 'vertical', fade: 'none' });
  return serializeHtmlTag(
    'div',
    { ...mergeProps(s.root), style: 'height: 7.5rem; width: 15rem;' },
    serializeHtmlTag(
      'div',
      mergeProps(s.viewport),
      '<p>Line 1</p><p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p>',
    ),
  );
}
