import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, SimpleTooltip } from '@var-ui/react';

<SimpleTooltip content="Below the trigger" placement="bottom" delay={200}>
  <Button>Bottom · 200ms</Button>
</SimpleTooltip>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
