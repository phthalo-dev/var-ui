import { Select } from '@var-ui/react';

const MODEL_SECTIONS = [
  {
    title: 'Anthropic',
    options: [
      { value: 'claude-opus', label: 'claude-opus', textValue: 'claude-opus' },
      { value: 'claude-haiku', label: 'claude-haiku', textValue: 'claude-haiku' },
    ],
  },
  {
    title: 'OpenAI',
    options: [
      { value: 'gpt-5', label: 'gpt-5', textValue: 'gpt-5' },
      { value: 'gpt-5-mini', label: 'gpt-5-mini', textValue: 'gpt-5-mini' },
    ],
  },
];

const PRICES: Record<string, string> = {
  'claude-opus': '$15 / $75',
  'claude-haiku': '$1 / $5',
  'gpt-5': '$5 / $20',
  'gpt-5-mini': '$0.60 / $4',
};

export default function Preview() {
  return (
    <Select
      label="Model"
      placeholder="Choose a model…"
      sections={MODEL_SECTIONS}
      renderOption={(option) => (
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
          {option.label}
          <span style={{ color: 'var(--var-ui-color-text-secondary)' }}>
            {PRICES[option.value]}
          </span>
        </span>
      )}
      renderValue={(option) => option?.label ?? 'Choose a model…'}
    />
  );
}
