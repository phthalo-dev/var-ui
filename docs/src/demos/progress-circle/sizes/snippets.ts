import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, ProgressCircle } from '@var-ui/react';

<HStack gap="md" align="center">
  <ProgressCircle label="Small" value={40} size="sm" />
  <ProgressCircle label="Medium" value={40} size="md" />
  <ProgressCircle label="Large" value={40} size="lg" />
</HStack>`,
  astro: `<!-- No Astro demo for this variant: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
