import { card } from '@var-ui/core';
import { combine, mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = card();
  const title = serializeHtmlTag('span', mergeProps(c.linkTitle), 'Theming guide');
  const description = serializeHtmlTag(
    'p',
    mergeProps(c.linkDescription),
    'Override any token with plain CSS custom properties.',
  );
  const hint = serializeHtmlTag('span', mergeProps(c.linkHint), '5 min read');
  return serializeHtmlTag(
    'a',
    { href: '#', ...combine(c.root, c.linkRoot) },
    `${title}${description}${hint}`,
  );
}
