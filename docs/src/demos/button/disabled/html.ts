import { button, stack } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const stackRp = mergeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'wrap' }),
  );
  const disabled = serializeHtmlTag(
    'button',
    { type: 'button', disabled: true, ...mergeProps(button({})) },
    'Disabled',
  );
  const disabledPrimary = serializeHtmlTag(
    'button',
    {
      type: 'button',
      disabled: true,
      ...mergeProps(button({ tone: 'accent', appearance: 'filled' })),
    },
    'Disabled primary',
  );
  return serializeHtmlTag('div', stackRp, `${disabled}${disabledPrimary}`);
}
