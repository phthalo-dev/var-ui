import { link } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('a', { href: '#', ...mergeProps(link().root) }, 'Documentation');
}
