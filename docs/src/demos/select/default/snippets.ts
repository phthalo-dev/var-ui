import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Select } from '@var-ui/react';

<Select
  label="Fruit"
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'plum', label: 'Plum' },
  ]}
/>`,
  astro: `---
// No @var-ui/astro Select — core recipe + native <select>.
// React uses options={[{ value, label }]}; HTML uses <option value>.
import { select } from '@var-ui/core';

const s = select();
const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
];
---

<div class:list={[s.root]}>
  <label class:list={[s.label]} for="fruit">Fruit</label>
  <select class:list={[s.trigger]} id="fruit">
    <option value="" disabled selected>Select…</option>
    {options.map((option) => <option value={option.id}>{option.label}</option>)}
  </select>
</div>`,
  html: `<div class="var-ui-select"><label class="var-ui-select__label" for="fruit">Fruit</label><select class="var-ui-select__trigger" id="fruit"><option value="" disabled selected>Select…</option><option value="apple">Apple</option><option value="plum">Plum</option></select></div>`,
} satisfies DemoSnippets;
