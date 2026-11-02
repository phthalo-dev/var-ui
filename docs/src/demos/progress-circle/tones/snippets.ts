import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, ProgressCircle } from '@var-ui/react';

<HStack gap="md" align="center">
  <ProgressCircle label="Accent" value={60} />
  <ProgressCircle label="Success" value={60} tone="success" />
  <ProgressCircle label="Warning" value={60} tone="warning" />
  <ProgressCircle label="Danger" value={60} tone="danger" />
  <ProgressCircle label="Neutral" value={60} tone="neutral" appearance="subtle" />
</HStack>`,
  astro: `<!-- No Astro demo for this variant: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
