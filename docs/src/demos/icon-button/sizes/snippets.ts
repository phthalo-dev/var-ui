import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, IconButton, VStack } from '@var-ui/react';

<VStack gap="lg">
  <HStack gap="sm">
    <IconButton name="search" aria-label="Search small" size="sm" />
    <IconButton name="search" aria-label="Search medium" size="md" />
    <IconButton name="search" aria-label="Search large" size="lg" />
  </HStack>
  <HStack gap="sm">
    <IconButton name="close" aria-label="Close" />
    <IconButton name="search" aria-label="Search" tone="accent" appearance="filled" />
    <IconButton name="menu" aria-label="Menu" tone="accent" appearance="ghost" />
    <IconButton name="close" aria-label="Delete" tone="danger" appearance="filled" />
  </HStack>
</VStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
