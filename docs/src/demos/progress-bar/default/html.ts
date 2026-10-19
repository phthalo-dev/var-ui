import { progressBar } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const p = progressBar({ tone: 'accent', indeterminate: false });
  const header = serializeHtmlTag(
    'div',
    mergeProps(p.header),
    `${serializeHtmlTag('span', mergeProps(p.label), 'Uploading assets')}${serializeHtmlTag('span', mergeProps(p.valueText), '64%')}`,
  );
  const fill = serializeHtmlTag('div', { ...mergeProps(p.fill), style: 'width: 64%' }, '');
  const track = serializeHtmlTag('div', mergeProps(p.track), fill);
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(p.root),
      role: 'progressbar',
      'aria-label': 'Uploading assets',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '64',
    },
    `${header}${track}`,
  );
}
