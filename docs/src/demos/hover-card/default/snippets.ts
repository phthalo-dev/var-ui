import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HoverCard, Link } from '@var-ui/react';

<HoverCard.Root>
  <HoverCard.Trigger>
    <Link href="/u/ada">Ada Lovelace</Link>
  </HoverCard.Trigger>
  <HoverCard.Popup>
    <HoverCard.Title>Ada Lovelace</HoverCard.Title>
    <HoverCard.Content>
      <p>Mathematician and early computing pioneer.</p>
    </HoverCard.Content>
  </HoverCard.Popup>
</HoverCard.Root>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
