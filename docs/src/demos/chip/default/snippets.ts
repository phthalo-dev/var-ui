import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Chip, ChipGroup, Pill } from '@var-ui/react';

<ChipGroup multiple value={values} onValueChange={setValues} tone="accent">
  <Chip value="react">React</Chip>
  <Chip value="vue">Vue</Chip>
</ChipGroup>

<Pill onRemove={() => remove('docs')}>Documentation</Pill>`,
  astro: `---
import { Chip } from '@var-ui/astro';
---

<Chip tone="accent">Static</Chip>
<Chip tone="neutral">Documentation</Chip>`,
  html: `<span class="var-ui-chip" data-tone="accent">React</span>`,
} satisfies DemoSnippets;
