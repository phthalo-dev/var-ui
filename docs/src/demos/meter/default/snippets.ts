import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Meter } from '@var-ui/react';

<Meter label="Storage used" value={42} />`,
  astro: `---
import { Meter } from '@var-ui/astro';
---

<Meter label="Storage used" value={42} />`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
