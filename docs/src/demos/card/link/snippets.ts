import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Card } from '@var-ui/react';

<Card
  href="#"
  title="Theming guide"
  description="Override any token with plain CSS custom properties."
  hint="5 min read"
/>`,
  astro: `---
import { Card } from '@var-ui/astro';
---

<Card
  href="#"
  title="Theming guide"
  description="Override any token with plain CSS custom properties."
  hint="5 min read"
/>`,
  html: `<a href="#" class="var-ui-card var-ui-card__linkRoot"><span class="var-ui-card__linkTitle">Theming guide</span><p class="var-ui-card__linkDescription">Override any token with plain CSS custom properties.</p><span class="var-ui-card__linkHint">5 min read</span></a>`,
} satisfies DemoSnippets;
