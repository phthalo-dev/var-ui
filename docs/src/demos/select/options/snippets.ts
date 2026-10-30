import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Grid, Select } from '@var-ui/react';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
];

<Grid columns={2} gap="lg">
  <Select label="Fruit" options={options} />
  <Select label="Favorite fruit" placeholder="Choose a fruit…" options={options} />
</Grid>`,
  astro: `---
// No @var-ui/astro Select — core grid + select recipes with native <select>.
import { grid, select } from '@var-ui/core';

const g = grid({ columns: 'two', gap: 'lg' });
const s = select();
const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
  { id: 'orange', label: 'Orange' },
  { id: 'grape', label: 'Grape' },
];
---

<div class:list={[g]}>
  <div class:list={[s.root]}>
    <label class:list={[s.label]} for="fruit-options">Fruit</label>
    <select class:list={[s.trigger]} id="fruit-options">
      <option value="" disabled selected>Select…</option>
      {options.map((option) => <option value={option.id}>{option.label}</option>)}
    </select>
  </div>
  <div class:list={[s.root]}>
    <label class:list={[s.label]} for="favorite-fruit">Favorite fruit</label>
    <select class:list={[s.trigger]} id="favorite-fruit">
      <option value="" disabled selected>Choose a fruit…</option>
      {options.map((option) => <option value={option.id}>{option.label}</option>)}
    </select>
  </div>
</div>`,
  html: `<div data-columns="two" data-gap="lg" class="var-ui-grid"><div class="var-ui-select"><label class="var-ui-select__label" for="fruit-options">Fruit</label><select class="var-ui-select__trigger" id="fruit-options"><option value="" disabled selected>Select…</option><option value="apple">Apple</option><option value="plum">Plum</option><option value="orange">Orange</option><option value="grape">Grape</option></select></div><div class="var-ui-select"><label class="var-ui-select__label" for="favorite-fruit">Favorite fruit</label><select class="var-ui-select__trigger" id="favorite-fruit"><option value="" disabled selected>Choose a fruit…</option><option value="apple">Apple</option><option value="plum">Plum</option><option value="orange">Orange</option><option value="grape">Grape</option></select></div></div>`,
} satisfies DemoSnippets;
