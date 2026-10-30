import { AppShell, SideNav, Text, TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: 220,
        border: '1px solid var(--var-ui-color-border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <AppShell
        layout="alt"
        contentPadding={3}
        topNav={
          <TopNav heading={<TopNav.Heading heading="Acme" />}>
            <TopNav.Item label="Home" href="/" selected />
            <TopNav.Item label="Docs" href="/docs" />
          </TopNav>
        }
        sideNav={
          <SideNav header={<SideNav.Heading heading="Workspace" />}>
            <SideNav.Item label="Dashboard" href="/" selected />
            <SideNav.Item label="Settings" href="/settings" />
          </SideNav>
        }
      >
        <Text size="sm">Alt layout — side column spans full height</Text>
      </AppShell>
    </div>
  );
}
