import { statusDot } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'span',
    {
      ...mergeProps(statusDot({ tone: 'success', appearance: 'filled', pulse: false })),
      role: 'img',
      'aria-label': 'Online',
    },
    '',
  );
}
