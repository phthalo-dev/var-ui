import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TextField } from '@var-ui/react';

<TextField
  label="Project name"
  description="Shown on the dashboard."
  placeholder="My project"
/>`,
  astro: `---
// No @var-ui/astro TextField — use core recipe markup + native input.
import { textField } from '@var-ui/core';

const tf = textField();
---

<div class:list={[tf.root]}>
  <label class:list={[tf.label]} for="project-name">Project name</label>
  <input class:list={[tf.input]} id="project-name" type="text" placeholder="My project" />
  <p class:list={[tf.description]}>Shown on the dashboard.</p>
</div>`,
  html: `<div class="var-ui-text-field"><label class="var-ui-text-field__label" for="project-name">Project name</label><input class="var-ui-text-field__input" id="project-name" type="text" placeholder="My project"></input><p class="var-ui-text-field__description">Shown on the dashboard.</p></div>`,
} satisfies DemoSnippets;
