import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox } from '@var-ui/react';

<Checkbox>Accept terms</Checkbox>`,
  astro: `---
// No @var-ui/astro Checkbox — core recipe + native checkbox (visual box is decorative).
import { checkbox } from '@var-ui/core';

const cb = checkbox();
---

<label class:list={[cb.root]}>
  <input type="checkbox" class="sr-only" />
  <span class:list={[cb.box]}></span>
  <span class:list={[cb.label]}>Accept terms</span>
</label>`,
  html: `<label class="var-ui-checkbox"><input type="checkbox" style="position:absolute;width:1px;height:1px;opacity:0"></input><span class="var-ui-checkbox__box"></span><span class="var-ui-checkbox__label">Accept terms</span></label>`,
} satisfies DemoSnippets;
