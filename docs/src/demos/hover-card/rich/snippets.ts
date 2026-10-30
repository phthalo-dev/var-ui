import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HoverCard, Link, Text } from '@var-ui/react';

<HoverCard.Root openDelay={400}>
  <HoverCard.Trigger>
    <Link href="/u/ada">@ada</Link>
  </HoverCard.Trigger>
  <HoverCard.Popup placement="bottom">
    <HoverCard.Title>Ada Lovelace</HoverCard.Title>
    <HoverCard.Content>
      <Text size="sm" tone="secondary">
        Mathematician and early computing pioneer.
      </Text>
      <Link href="/u/ada">View profile</Link>
    </HoverCard.Content>
  </HoverCard.Popup>
</HoverCard.Root>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
