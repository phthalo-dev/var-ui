import { checkbox } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = checkbox();
  const input = serializeHtmlTag(
    'input',
    { type: 'checkbox', style: 'position:absolute;width:0.0625rem;height:0.0625rem;opacity:0' },
    '',
  );
  const box = serializeHtmlTag('span', mergeProps(cb.box), '');
  const label = serializeHtmlTag('span', mergeProps(cb.label), 'Accept terms');
  return serializeHtmlTag('label', mergeProps(cb.root), `${input}${box}${label}`);
}
