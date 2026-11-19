import { button, stack } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const sizes = [
  ['xs', 'Extra small'],
  ['sm', 'Small'],
  ['md', 'Medium'],
  ['lg', 'Large'],
  ['xl', 'Extra large'],
] as const;

export function render(): string {
  const stackRp = mergeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'wrap' }),
  );
  const buttons = sizes
    .map(([size, label]) =>
      serializeHtmlTag('button', { type: 'button', ...mergeProps(button({ size })) }, label),
    )
    .join('');
  return serializeHtmlTag('div', stackRp, buttons);
}
