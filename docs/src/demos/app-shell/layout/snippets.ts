import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AppShell, SideNav, TopNav } from '@var-ui/react';

<AppShell
  layout="alt"
  contentPadding="sm"
  topNav={<TopNav heading={<TopNav.Heading heading="Acme" />}>…</TopNav>}
  sideNav={<SideNav header={<SideNav.Heading heading="Workspace" />}>…</SideNav>}
>
  Main content
</AppShell>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
