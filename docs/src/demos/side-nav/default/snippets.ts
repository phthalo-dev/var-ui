import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SideNav } from '@var-ui/react';

<SideNav header={<SideNav.Heading heading="Acme" />}>
  <SideNav.Section title="Main">
    <SideNav.Item label="Dashboard" href="/" selected />
  </SideNav.Section>
</SideNav>`,
  astro: `---
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@var-ui/astro';
---
<SideNav>
  <SideNavHeading slot="header" heading="Acme" />
  <SideNavSection title="Main">
    <SideNavItem label="Dashboard" href="/" selected />
  </SideNavSection>
</SideNav>`,
  html: `<nav class="var-ui-side-nav" aria-label="Side navigation">…</nav>`,
} satisfies DemoSnippets;
