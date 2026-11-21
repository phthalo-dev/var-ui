import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Badge } from '@var-ui/react';

<Badge color="violet">Planner</Badge>
<Badge color="teal">Reviewer</Badge>
<Badge color="sage" appearance="solid">Worker</Badge>`,
  astro: `---
import { Badge } from '@var-ui/astro';
---

<Badge color="violet">Planner</Badge>
<Badge color="teal">Reviewer</Badge>
<Badge color="sage" appearance="solid">Worker</Badge>`,
  html: `<span class="var-ui-badge" data-tone="neutral" data-color="violet" data-appearance="subtle">Planner</span>`,
} satisfies DemoSnippets;
