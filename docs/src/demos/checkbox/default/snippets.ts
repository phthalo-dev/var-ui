import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox } from '@var-ui/react';

<Checkbox>Accept terms</Checkbox>`,
  astro: `---
// No @var-ui/astro Checkbox — core recipe + native checkbox (visual box is decorative).
import { checkbox } from '@var-ui/core';
import { mergeProps } from '@var-ui/astro';

const cb = checkbox();
---

<label {...mergeProps(cb.root)}>
  <input type="checkbox" class="sr-only" />
  <span {...mergeProps(cb.box)}></span>
  <span {...mergeProps(cb.label)}>Accept terms</span>
</label>`,
  html: `<label data-size="md" class="var-ui-checkbox"><input type="checkbox" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span data-size="md" class="var-ui-checkbox__box"></span><span data-size="md" class="var-ui-checkbox__label">Accept terms</span></label>`,
} satisfies DemoSnippets;
