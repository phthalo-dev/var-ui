import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ProgressCircle } from '@var-ui/react';

<ProgressCircle label="Loading" />`,
  astro: `---
import { ProgressCircle } from '@var-ui/astro';
---

<ProgressCircle label="Loading" />`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
