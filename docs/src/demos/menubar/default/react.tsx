import { Kbd, Menu, Menubar } from '@var-ui/react';

function Row({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <>
      <span style={{ flex: 1 }}>{label}</span>
      <Kbd>{shortcut}</Kbd>
    </>
  );
}

export default function Preview() {
  return (
    <div style={{ minHeight: '13.75rem' }}>
      <Menubar aria-label="Application">
        <Menubar.Menu label="File">
          <Menu.Item id="new" textValue="New file">
            <Row label="New file" shortcut="⌘N" />
          </Menu.Item>
          <Menu.Item id="open" textValue="Open">
            <Row label="Open…" shortcut="⌘O" />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Recent">
            <Menu.Item id="r1">report.md</Menu.Item>
            <Menu.Item id="r2">notes.txt</Menu.Item>
          </Menu.Section>
          <Menu.Separator />
          <Menu.Item id="quit" textValue="Quit">
            <Row label="Quit" shortcut="⌘Q" />
          </Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Edit">
          <Menu.Item id="undo" textValue="Undo">
            <Row label="Undo" shortcut="⌘Z" />
          </Menu.Item>
          <Menu.Item id="redo" textValue="Redo">
            <Row label="Redo" shortcut="⇧⌘Z" />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item id="cut" textValue="Cut">
            <Row label="Cut" shortcut="⌘X" />
          </Menu.Item>
          <Menu.Item id="copy" textValue="Copy">
            <Row label="Copy" shortcut="⌘C" />
          </Menu.Item>
          <Menu.Item id="paste" textValue="Paste">
            <Row label="Paste" shortcut="⌘V" />
          </Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="View">
          <Menu.Item id="zoom-in">Zoom in</Menu.Item>
          <Menu.Item id="zoom-out">Zoom out</Menu.Item>
          <Menu.Item id="fullscreen">Enter full screen</Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Help">
          <Menu.Item id="docs">Documentation</Menu.Item>
          <Menu.Item id="about">About</Menu.Item>
        </Menubar.Menu>
      </Menubar>
    </div>
  );
}
