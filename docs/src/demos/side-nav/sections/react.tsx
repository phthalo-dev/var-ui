import { SideNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: '17.5rem',
        width: '15rem',
        border: '0.0625rem solid var(--var-ui-color-border-subtle)',
        borderRadius: '0.5rem',
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
