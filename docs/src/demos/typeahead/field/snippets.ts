import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Typeahead } from '@var-ui/react';

<Typeahead
  label="Fruit"
  description="Start typing to filter the list."
  errorMessage="Choose a fruit to continue."
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'plum', label: 'Plum' },
    { value: 'orange', label: 'Orange' },
  ]}
/>`,
  astro: `---
import { combobox } from '@var-ui/core';

const cb = combobox();
---

<div class:list={[cb.root]}>
  <label class:list={[cb.label]} for="fruit-typeahead-field">Fruit</label>
  <div class:list={[cb.inputWrapper]}>
    <input
      class:list={[cb.input]}
      id="fruit-typeahead-field"
      type="text"
      placeholder="Search…"
      role="combobox"
      aria-invalid="true"
    />
  </div>
  <p class:list={[cb.description]}>Start typing to filter the list.</p>
  <p class:list={[cb.error]}>Choose a fruit to continue.</p>
</div>`,
  html: `<div class="var-ui-combobox"><label class="var-ui-combobox__label" for="fruit-typeahead-field">Fruit</label><div class="var-ui-combobox__inputWrapper"><input class="var-ui-combobox__input" id="fruit-typeahead-field" type="text" placeholder="Search…" role="combobox" aria-invalid="true" /></div><p class="var-ui-combobox__description">Start typing to filter the list.</p><p class="var-ui-combobox__error">Choose a fruit to continue.</p></div>`,
} satisfies DemoSnippets;
