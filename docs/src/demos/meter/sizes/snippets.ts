import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Meter, Stack } from '@var-ui/react';

<Stack gap="md">
  <Meter label="Small" value={50} size="sm" />
  <Meter label="Medium" value={50} size="md" />
  <Meter label="Large" value={50} size="lg" tone="accent" />
</Stack>`,
  astro: `<!-- No Astro demo for this variant: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
