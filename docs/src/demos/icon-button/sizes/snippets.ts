import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, IconButton, VStack } from '@var-ui/react';

<VStack gap="lg">
  <HStack gap="sm">
    <IconButton icon="search" aria-label="Search small" size="sm" />
    <IconButton icon="search" aria-label="Search medium" size="md" />
    <IconButton icon="search" aria-label="Search large" size="lg" />
  </HStack>
  <HStack gap="sm">
    <IconButton icon="close" aria-label="Close" />
    <IconButton icon="search" aria-label="Search" tone="accent" appearance="filled" />
    <IconButton icon="menu" aria-label="Menu" tone="accent" appearance="ghost" />
    <IconButton icon="close" aria-label="Delete" tone="danger" appearance="filled" />
  </HStack>
</VStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
