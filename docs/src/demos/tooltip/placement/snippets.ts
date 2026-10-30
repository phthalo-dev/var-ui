import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack, Tooltip } from '@var-ui/react';

<HStack gap="md" wrap>
  <Tooltip delay={200}>
    <Tooltip.Trigger>
      <Button>Bottom · 200ms</Button>
    </Tooltip.Trigger>
    <Tooltip.Popup placement="bottom">Below the trigger</Tooltip.Popup>
  </Tooltip>
  <Tooltip>
    <Tooltip.Trigger>
      <Button>End</Button>
    </Tooltip.Trigger>
    <Tooltip.Popup placement="end">After the trigger</Tooltip.Popup>
  </Tooltip>
</HStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
