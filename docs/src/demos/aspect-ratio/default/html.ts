import { aspectRatio } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(aspectRatio()),
      style:
        'background: var(--color-surface-muted); max-width: 20rem; aspect-ratio: 1.7777777777777777',
    },
    '',
  );
}
