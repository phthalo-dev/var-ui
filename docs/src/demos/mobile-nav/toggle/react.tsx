import { MobileNav, MobileNavProvider, SideNav, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <MobileNavProvider defaultOpen>
      <div
        style={{
          position: 'relative',
          height: 200,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
          padding: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MobileNav.Toggle />
          <Text size="sm">Provider + toggle</Text>
        </div>
        <MobileNav header="Menu">
          <SideNav.Section title="Browse">
            <SideNav.Item label="Home" href="/" selected />
            <SideNav.Item label="Docs" href="/docs" />
            <SideNav.Item label="Blog" href="/blog" />
          </SideNav.Section>
        </MobileNav>
      </div>
    </MobileNavProvider>
  );
}
