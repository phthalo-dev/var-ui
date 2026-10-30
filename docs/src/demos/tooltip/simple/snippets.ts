import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Tooltip } from '@var-ui/react';

<Tooltip>
  <Tooltip.Trigger>
    <Button>Save</Button>
  </Tooltip.Trigger>
  <Tooltip.Popup>Save changes</Tooltip.Popup>
</Tooltip>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
