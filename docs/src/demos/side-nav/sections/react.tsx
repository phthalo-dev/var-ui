import { SideNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: 280,
        width: 240,
        border: '1px solid var(--var-ui-color-border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <SideNav header={<SideNav.Heading heading="Acme" subheading="Workspace" />}>
        <SideNav.Section title="Main">
          <SideNav.Item label="Dashboard" href="/" selected />
          <SideNav.Item label="Projects" href="/projects" />
        </SideNav.Section>
        <SideNav.Section title="Team" subtitle="Shared">
          <SideNav.Item label="Members" href="/members" />
          <SideNav.Item label="Billing" href="/billing" />
        </SideNav.Section>
      </SideNav>
    </div>
  );
}
