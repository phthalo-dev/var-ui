import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Breadcrumbs, DirectionProvider, Pagination, SideNav, Text } from '@var-ui/react';

<DirectionProvider direction="rtl">
  <SideNav header={<SideNav.Heading heading="Docs" />}>
    <SideNav.Section title="Main">
      <SideNav.Item label="Overview" href="#overview" selected />
      <SideNav.Item label="Guides" collapsible>
        <SideNav.Item label="Hidden" href="#hidden" />
        <SideNav.Item label="Direction" href="#direction" />
      </SideNav.Item>
    </SideNav.Section>
  </SideNav>
  <Breadcrumbs
    items={[
      { id: 'home', label: 'Home', href: '#' },
      { id: 'here', label: 'Current' },
    ]}
  />
  <Pagination page={1} onValueChange={() => {}} totalPages={5} variant="compact" />
  <Text>dir=rtl island</Text>
</DirectionProvider>`,
  astro: `---
import { Breadcrumbs, SideNav, SideNavHeading, SideNavItem, SideNavSection, Text } from '@var-ui/astro';
---
<div dir="rtl">
  <SideNav>
    <SideNavHeading slot="header" heading="Docs" />
    <SideNavSection title="Main">
      <SideNavItem label="Overview" href="#overview" selected />
      <SideNavItem label="Hidden" href="#hidden" />
    </SideNavSection>
  </SideNav>
  <Breadcrumbs
    items={[
      { id: 'home', label: 'Home', href: '#' },
      { id: 'here', label: 'Current' },
    ]}
  />
  <span data-mirror><!-- chevronRight SVG --></span>
  <Text>dir=rtl island</Text>
</div>`,
  html: `<div dir="rtl">
  <nav class="var-ui-side-nav" aria-label="Side navigation">…</nav>
  <nav class="var-ui-breadcrumbs" aria-label="Breadcrumb">…</nav>
  <span class="var-ui-icon" data-mirror>…</span>
  <p class="var-ui-text-block">dir=rtl island</p>
</div>`,
} satisfies DemoSnippets;
