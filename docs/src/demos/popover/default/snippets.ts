import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Popover } from '@var-ui/react';

<Popover>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Popup>
    <Popover.Arrow />
    <Popover.Title>Details</Popover.Title>
    <Popover.Content>
      <p>Popover body content.</p>
    </Popover.Content>
  </Popover.Popup>
</Popover>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
