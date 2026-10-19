import { button, emptyState } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const searchIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg>';

export function render(): string {
  const e = emptyState();
  const iconWell = serializeHtmlTag(
    'div',
    { ...mergeProps(e.icon), 'data-empty-state-icon': true, 'aria-hidden': 'true' },
    searchIcon,
  );
  const title = serializeHtmlTag('h3', mergeProps(e.title), 'No results');
  const description = serializeHtmlTag(
    'p',
    mergeProps(e.description),
    'Try a different filter, or clear the search.',
  );
  const btn = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(button({ tone: 'accent', appearance: 'filled' })) },
    'Clear filters',
  );
  const action = serializeHtmlTag('div', mergeProps(e.action), btn);
  return serializeHtmlTag('div', mergeProps(e.root), `${iconWell}${title}${description}${action}`);
}
