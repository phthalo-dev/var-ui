import { switchStyles } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const sw = switchStyles();
  const input = serializeHtmlTag(
    'input',
    {
      type: 'checkbox',
      role: 'switch',
      style: 'position:absolute;width:0.0625rem;height:0.0625rem;opacity:0',
    },
    '',
  );
  const thumb = serializeHtmlTag('span', mergeProps(sw.thumb), '');
  const track = serializeHtmlTag('span', mergeProps(sw.track), thumb);
  const label = serializeHtmlTag('span', mergeProps(sw.label), 'Enable notifications');
  return serializeHtmlTag('label', mergeProps(sw.root), `${input}${track}${label}`);
}
