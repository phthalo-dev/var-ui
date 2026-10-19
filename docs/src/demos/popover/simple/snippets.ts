import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, SimplePopover } from '@var-ui/react';

<SimplePopover trigger={<Button>Open</Button>} title="Details">
  <p>Popover body content.</p>
</SimplePopover>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
