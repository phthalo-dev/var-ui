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
        topNav={
          <TopNav>
            <TopNav.Item label="Home" href="/" selected />
            <TopNav.Item label="Docs" href="/docs" />
          </TopNav>
        }
        sideNav={
          <SideNav header={<SideNav.Heading heading="Acme" />}>
            <SideNav.Item label="Dashboard" href="/" selected />
            <SideNav.Item label="Settings" href="/settings" />
          </SideNav>
        }
      >
        <Text size="sm">Main content</Text>
      </AppShell>
    </div>
  );
}
