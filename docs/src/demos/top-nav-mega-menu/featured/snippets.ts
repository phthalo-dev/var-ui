import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, TopNav } from '@var-ui/react';

<TopNav>
  <TopNav.MegaMenu
    label="Solutions"
    isOpen
    items={[
      { id: 'startups', title: 'For startups', href: '/startups' },
      { id: 'enterprise', title: 'For enterprise', href: '/enterprise' },
    ]}
    featured={
      <TopNav.MegaMenu.FeaturedCard
        title="Platform tour"
        description="See how teams build with Acme in under five minutes."
        href="/tour"
        action={<Button size="sm">Watch demo</Button>}
      />
    }
  />
</TopNav>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
