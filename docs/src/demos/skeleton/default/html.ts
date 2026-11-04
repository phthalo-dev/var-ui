import { skeleton } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(skeleton({ shape: 'text' })),
      'aria-hidden': true,
      style: 'width: 7.5rem; height: 1rem;',
    },
    '',
  );
}
