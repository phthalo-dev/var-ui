import { SideNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: 200,
        width: 220,
        border: '1px solid var(--var-ui-color-border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <SideNav header={<SideNav.Heading heading="Acme" />}>
        <SideNav.Section title="Main">
          <SideNav.Item label="Dashboard" href="/" selected />
          <SideNav.Item label="Projects" href="/projects" />
        </SideNav.Section>
      </SideNav>
    </div>
  );
}
