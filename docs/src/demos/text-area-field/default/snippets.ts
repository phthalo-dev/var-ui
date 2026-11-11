import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TextAreaField } from '@var-ui/react';

<TextAreaField label="Notes" placeholder="Add a note…" />`,
  astro: `---
// No @var-ui/astro TextAreaField — use core recipe markup + native textarea.
import { textAreaField } from '@var-ui/core';
import { mergeProps } from '@var-ui/astro';

const taf = textAreaField();
---

<div {...mergeProps(taf.root)}>
  <label {...mergeProps(taf.label)} for="notes">Notes</label>
  <textarea {...mergeProps(taf.input)} id="notes" placeholder="Add a note…"></textarea>
</div>`,
  html: `<div data-size="md" class="var-ui-text-area-field"><label data-size="md" class="var-ui-text-area-field__label" for="notes">Notes</label><textarea data-size="md" class="var-ui-text-area-field__input" id="notes" placeholder="Add a note…"></textarea></div>`,
} satisfies DemoSnippets;
