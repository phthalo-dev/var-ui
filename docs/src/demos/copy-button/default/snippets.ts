import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CopyButton } from '@var-ui/react';

<CopyButton value="npm i @var-ui/react" />`,
  astro: `---
import { CopyButton } from '@var-ui/astro';
---

<CopyButton value="npm i @var-ui/react" />`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
