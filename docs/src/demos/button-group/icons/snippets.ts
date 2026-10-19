import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, ButtonGroup, IconButton } from '@var-ui/react';

<ButtonGroup>
  <IconButton name="search" aria-label="Search" />
  <IconButton name="copy" aria-label="Copy" />
  <Button>More</Button>
</ButtonGroup>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
