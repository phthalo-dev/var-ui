import { textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return [
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ eyebrow: true, size: 'xs', tone: 'secondary' })),
      'Steps',
    ),
    serializeHtmlTag('p', mergeProps(textBlock({ size: 'xl', weight: 'bold' })), '128.4k'),
    serializeHtmlTag('p', mergeProps(textBlock({ weight: 'semibold' })), 'Semibold emphasis'),
    serializeHtmlTag('p', mergeProps(textBlock({ weight: 'bold' })), 'Bold emphasis'),
  ].join('\n');
}
