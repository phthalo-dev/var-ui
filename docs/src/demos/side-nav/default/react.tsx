import { SideNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: '12.5rem',
        width: '13.75rem',
        border: '0.0625rem solid var(--var-ui-color-border-subtle)',
        borderRadius: '0.5rem',
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
