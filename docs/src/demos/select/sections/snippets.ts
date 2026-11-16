import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Select } from '@var-ui/react';

const sections = [
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

<Select
  label="Model"
  placeholder="Choose a model…"
  sections={sections}
  renderOption={(option) => (
    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
      {option.label}
      <span style={{ color: 'var(--var-ui-color-text-secondary)' }}>{prices[option.value]}</span>
    </span>
  )}
  renderValue={(option) => option?.label ?? 'Choose a model…'}
/>`,
  astro: `---
// No @var-ui/astro Select — core select recipe with a native <select> and <optgroup>.
import { select } from '@var-ui/core';

const s = select();
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
---

<div class:list={[s.root]}>
  <label class:list={[s.label]} for="model-sections">Model</label>
  <select class:list={[s.trigger]} id="model-sections">
    <option value="" disabled selected>Choose a model…</option>
    {groups.map((group) => (
      <optgroup label={group.label}>
        {group.options.map((option) => <option value={option.value}>{option.label}</option>)}
      </optgroup>
    ))}
  </select>
</div>`,
  html: `<div class="var-ui-select"><label class="var-ui-select__label" for="model-sections">Model</label><select class="var-ui-select__trigger" id="model-sections"><option value="" disabled selected>Choose a model…</option><optgroup label="Anthropic"><option value="claude-opus">claude-opus</option><option value="claude-haiku">claude-haiku</option></optgroup><optgroup label="OpenAI"><option value="gpt-5">gpt-5</option><option value="gpt-5-mini">gpt-5-mini</option></optgroup></select></div>`,
} satisfies DemoSnippets;
