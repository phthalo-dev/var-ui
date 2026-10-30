import type { DemoSnippets } from '../../types';

const options = `[
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
]`;

export const snippets = {
  react: `import { Combobox } from '@var-ui/react';

const options = ${options};

<Combobox.Root aria-label="Favorite fruit">
  <Combobox.Label>Favorite fruit</Combobox.Label>
  <Combobox.Input placeholder="Search fruits…" clearable />
  <Combobox.Popover>
    <Combobox.ListBox items={options}>
      {(option) => (
        <Combobox.Item value={option.value} textValue={option.label}>
          {option.label}
        </Combobox.Item>
      )}
    </Combobox.ListBox>
  </Combobox.Popover>
</Combobox.Root>`,
  astro: `---
// Filtering and listbox behavior require React — use the combobox recipe for static chrome.
import { combobox } from '@var-ui/core';

const cb = combobox();
---

<div class:list={[cb.root]}>
  <label class:list={[cb.label]} for="fruit-search">Favorite fruit</label>
  <div class:list={[cb.inputWrapper]}>
    <input
      class:list={[cb.input]}
      id="fruit-search"
      type="text"
      placeholder="Search fruits…"
      role="combobox"
      aria-autocomplete="list"
    />
  </div>
</div>`,
  html: `<div class="var-ui-combobox"><label class="var-ui-combobox__label" for="fruit-search">Favorite fruit</label><div class="var-ui-combobox__inputWrapper"><input class="var-ui-combobox__input" id="fruit-search" type="text" placeholder="Search fruits…" role="combobox" aria-autocomplete="list" /></div></div>`,
} satisfies DemoSnippets;
