import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, VisuallyHidden } from '@var-ui/react';

<Button layout="icon" tone="danger">
  <span aria-hidden="true">×</span>
  <VisuallyHidden>Delete project</VisuallyHidden>
</Button>`,
  astro: `---
import { Button, VisuallyHidden } from '@var-ui/astro';
---

<Button layout="icon" tone="danger">
  <span aria-hidden="true">×</span>
  <VisuallyHidden>Delete project</VisuallyHidden>
</Button>`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
