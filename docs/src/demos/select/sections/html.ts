import { select } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const groups = [
  {
    label: 'Anthropic',
    options: [
      { value: 'claude-opus', label: 'claude-opus' },
      { value: 'claude-haiku', label: 'claude-haiku' },
    ],
  },
  {
    label: 'OpenAI',
    options: [
      { value: 'gpt-5', label: 'gpt-5' },
      { value: 'gpt-5-mini', label: 'gpt-5-mini' },
    ],
  },
];

export function render(): string {
  const s = select();
  const labelEl = serializeHtmlTag(
    'label',
    { ...mergeProps(s.label), for: 'model-sections' },
    'Model',
  );
  const optionEls = [
    serializeHtmlTag('option', { value: '', disabled: true, selected: true }, 'Choose a model…'),
    ...groups.map((group) =>
      serializeHtmlTag(
        'optgroup',
        { label: group.label },
        group.options.map((o) => serializeHtmlTag('option', { value: o.value }, o.label)).join(''),
      ),
    ),
  ].join('');
  const trigger = serializeHtmlTag(
    'select',
    { ...mergeProps(s.trigger), id: 'model-sections' },
    optionEls,
  );
  return serializeHtmlTag('div', mergeProps(s.root), `${labelEl}${trigger}`);
}
