import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, ButtonGroup } from '@var-ui/react';

<ButtonGroup>
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
