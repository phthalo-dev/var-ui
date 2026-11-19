import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Link } from '@var-ui/react';

<Link href="#">Documentation</Link>`,
  astro: `---
import { Link } from '@var-ui/astro';
---

<Link href="#">Documentation</Link>`,
  html: `<a href="#" data-tone="accent" data-size="inherit" class="var-ui-link">Documentation</a>`,
} satisfies DemoSnippets;
