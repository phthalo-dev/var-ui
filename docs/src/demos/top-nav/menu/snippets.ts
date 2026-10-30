import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TopNav } from '@var-ui/react';

<TopNav heading={<TopNav.Heading heading="Acme" />}>
  <TopNav.Item label="Home" href="/" selected />
  <TopNav.Item label="Docs" href="/docs" />
  <TopNav.Menu
    label="Products"
    items={[
      { id: 'cloud', title: 'Cloud', description: 'Deploy anywhere', href: '/cloud' },
      { id: 'analytics', title: 'Analytics', description: 'Measure what matters', href: '/analytics' },
    ]}
  />
</TopNav>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
