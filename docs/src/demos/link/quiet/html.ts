import { link } from '@var-ui/core';
import { svg as chevronLeftSvg } from '@var-ui/icons/glyphs/chevronLeft';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const l = link({ tone: 'secondary', size: 'sm' });
  const icon = serializeHtmlTag(
    'span',
    { ...mergeProps(l.icon), 'aria-hidden': 'true' },
    chevronLeftSvg,
  );
  return serializeHtmlTag('a', { href: '#', ...mergeProps(l.root) }, `${icon}Back to runs`);
}
