import { radio } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const options = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];

function renderOption(value: string, label: string): string {
  const r = radio();
  const input = serializeHtmlTag(
    'input',
    {
      type: 'radio',
      name: 'plan',
      value,
      style: 'position:absolute;width:0.0625rem;height:0.0625rem;opacity:0',
    },
    '',
  );
  const control = serializeHtmlTag('span', mergeProps(r.control), '');
  const labelEl = serializeHtmlTag('span', mergeProps(r.label), label);
  return serializeHtmlTag('label', mergeProps(r.item), `${input}${control}${labelEl}`);
}

export function render(): string {
  const r = radio();
  const groupLabel = serializeHtmlTag(
    'span',
    { ...mergeProps(r.groupLabel), id: 'plan-label' },
    'Plan',
  );
  const items = options.map((o) => renderOption(o.value, o.label)).join('');
  return serializeHtmlTag(
    'div',
    { ...mergeProps(r.group), role: 'radiogroup', 'aria-labelledby': 'plan-label' },
    `${groupLabel}${items}`,
  );
}
