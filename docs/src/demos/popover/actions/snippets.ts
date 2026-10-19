import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack, SimplePopover } from '@var-ui/react';

<SimplePopover trigger={<Button>Share</Button>} title="Share link">
  <p>Anyone with the link can view this draft.</p>
  <HStack gap="sm">
    <Button tone="accent" appearance="filled" size="sm">Copy link</Button>
    <Button tone="accent" appearance="ghost" size="sm">Cancel</Button>
  </HStack>
</SimplePopover>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
