import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SideNav } from '@var-ui/react';

<SideNav header={<SideNav.Heading heading="Acme" subheading="Workspace" />}>
  <SideNav.Section title="Main">
    <SideNav.Item label="Dashboard" href="/" selected />
    <SideNav.Item label="Projects" href="/projects" />
  </SideNav.Section>
  <SideNav.Section title="Team" subtitle="Shared">
    <SideNav.Item label="Members" href="/members" />
    <SideNav.Item label="Billing" href="/billing" />
  </SideNav.Section>
</SideNav>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
