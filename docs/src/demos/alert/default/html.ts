import { alert } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const a = alert({ tone: 'info', appearance: 'subtle', contentGap: 'spaced' });
  const title = serializeHtmlTag('p', mergeProps(a.title), 'Registry icons');
  const content = serializeHtmlTag(
    'div',
    mergeProps(a.content),
    'Alerts pull their tone glyph from IconProvider automatically.',
  );
  const body = serializeHtmlTag('div', mergeProps(a.body), `${title}${content}`);
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(a.root),
    },
    body,
  );
}
