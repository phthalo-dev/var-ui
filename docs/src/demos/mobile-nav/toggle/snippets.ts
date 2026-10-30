import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { MobileNav, MobileNavProvider, SideNav } from '@var-ui/react';

<MobileNavProvider defaultOpen>
  <MobileNav.Toggle />
  <MobileNav header="Menu">
    <SideNav.Section title="Browse">
      <SideNav.Item label="Home" href="/" selected />
      <SideNav.Item label="Docs" href="/docs" />
    </SideNav.Section>
  </MobileNav>
</MobileNavProvider>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
