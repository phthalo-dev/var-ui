import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, IconButton, Stack } from '@var-ui/react';

<Stack gap="lg">
  <HStack gap="sm">
    <IconButton icon="search" aria-label="Search extra small" size="xs" />
    <IconButton icon="search" aria-label="Search small" size="sm" />
    <IconButton icon="search" aria-label="Search medium" size="md" />
    <IconButton icon="search" aria-label="Search large" size="lg" />
    <IconButton icon="search" aria-label="Search extra large" size="xl" />
  </HStack>
  <HStack gap="sm">
    <IconButton icon="close" aria-label="Close" />
    <IconButton icon="search" aria-label="Search" tone="accent" appearance="solid" />
    <IconButton icon="menu" aria-label="Menu" tone="accent" appearance="ghost" />
    <IconButton icon="close" aria-label="Delete" tone="danger" appearance="solid" />
  </HStack>
  <HStack gap="sm">
    <IconButton icon="star" aria-label="Favorite" size="xl" pill tone="accent" appearance="solid" />
  </HStack>
</Stack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
