import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Typeahead } from '@var-ui/react';

<Typeahead
  label="Fruit"
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'plum', label: 'Plum' },
    { value: 'orange', label: 'Orange' },
  ]}
/>`,
  astro: `---
// Filtering requires React — use the combobox recipe for static chrome.
import { combobox } from '@var-ui/core';

const cb = combobox();
---

<div class:list={[cb.root]}>
  <label class:list={[cb.label]} for="fruit-typeahead">Fruit</label>
  <div class:list={[cb.inputWrapper]}>
    <input
      class:list={[cb.input]}
      id="fruit-typeahead"
      type="text"
      placeholder="Search…"
      role="combobox"
      aria-autocomplete="list"
    />
  </div>
</div>`,
  html: `<div class="var-ui-combobox"><label class="var-ui-combobox__label" for="fruit-typeahead">Fruit</label><div class="var-ui-combobox__inputWrapper"><input class="var-ui-combobox__input" id="fruit-typeahead" type="text" placeholder="Search…" role="combobox" aria-autocomplete="list" /></div></div>`,
} satisfies DemoSnippets;
