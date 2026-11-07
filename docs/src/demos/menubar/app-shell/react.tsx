import { AppShell, Menu, Menubar, Text, TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        height: '16.25rem',
        border: '0.0625rem solid var(--var-ui-color-border-subtle)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    >
      <AppShell
        topNav={
          <TopNav>
            <Menubar aria-label="Application" size="sm">
              <Menubar.Menu label="File">
                <Menu.Item id="new">New</Menu.Item>
                <Menu.Item id="open">Open…</Menu.Item>
                <Menu.Separator />
                <Menu.Item id="close">Close window</Menu.Item>
              </Menubar.Menu>
              <Menubar.Menu label="Edit">
                <Menu.Item id="undo">Undo</Menu.Item>
                <Menu.Item id="redo">Redo</Menu.Item>
              </Menubar.Menu>
              <Menubar.Menu label="View">
                <Menu.Item id="sidebar">Toggle sidebar</Menu.Item>
              </Menubar.Menu>
            </Menubar>
          </TopNav>
        }
      >
        <Text size="sm">Main content</Text>
      </AppShell>
    </div>
  );
}
