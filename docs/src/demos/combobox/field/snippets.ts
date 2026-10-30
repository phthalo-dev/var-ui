import type { DemoSnippets } from '../../types';

const options = `[
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
]`;

export const snippets = {
  react: `import { Combobox } from '@var-ui/react';

const options = ${options};

<Combobox.Root aria-label="Favorite fruit" invalid>
  <Combobox.Label>Favorite fruit</Combobox.Label>
  <Combobox.Input placeholder="Search fruits…" clearable />
  <Combobox.Description>Pick a fruit from the list.</Combobox.Description>
  <Combobox.Error>Selection is required.</Combobox.Error>
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
import { combobox } from '@var-ui/core';

const cb = combobox();
---

<div class:list={[cb.root]}>
  <label class:list={[cb.label]} for="fruit-field">Favorite fruit</label>
  <div class:list={[cb.inputWrapper]}>
    <input
      class:list={[cb.input]}
      id="fruit-field"
      type="text"
      placeholder="Search fruits…"
      role="combobox"
      aria-invalid="true"
    />
  </div>
  <p class:list={[cb.description]}>Pick a fruit from the list.</p>
  <p class:list={[cb.error]}>Selection is required.</p>
</div>`,
  html: `<div class="var-ui-combobox"><label class="var-ui-combobox__label" for="fruit-field">Favorite fruit</label><div class="var-ui-combobox__inputWrapper"><input class="var-ui-combobox__input" id="fruit-field" type="text" placeholder="Search fruits…" role="combobox" aria-invalid="true" /></div><p class="var-ui-combobox__description">Pick a fruit from the list.</p><p class="var-ui-combobox__error">Selection is required.</p></div>`,
} satisfies DemoSnippets;
