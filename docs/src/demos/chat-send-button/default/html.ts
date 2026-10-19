import { button } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const arrowUpIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';

export function render(): string {
  return serializeHtmlTag(
    'button',
    {
      type: 'button',
      ...mergeProps(button({ tone: 'accent', appearance: 'filled' })),
      'aria-label': 'Send message',
    },
    arrowUpIcon,
  );
}
