import { MobileNav, MobileNavProvider, SideNav, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <MobileNavProvider defaultOpen>
      <div
        style={{
          position: 'relative',
          height: '12.5rem',
          border: '0.0625rem solid var(--var-ui-color-border-subtle)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          padding: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
