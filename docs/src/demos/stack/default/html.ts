import { button, stack } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const stackRp = mergeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'nowrap' }),
  );
  const cancel = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(button({})) },
    'Cancel',
  );
  const save = serializeHtmlTag('button', { type: 'button', ...mergeProps(button({})) }, 'Save');
  return serializeHtmlTag('div', stackRp, `${cancel}${save}`);
}
