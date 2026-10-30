import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { IconButton } from '@var-ui/react';

<IconButton icon="close" aria-label="Close" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
