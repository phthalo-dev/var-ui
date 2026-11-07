import { Menu, Menubar } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ minHeight: '12.5rem' }}>
      <Menubar aria-label="Editor">
        <Menubar.Menu label="File">
          <Menu.Item id="new">New</Menu.Item>
          <Menu.Item id="save" disabled>
            Save
          </Menu.Item>
          <Menu.Item id="export" disabled>
            Export…
          </Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Edit">
          <Menu.Item id="undo" disabled>
            Undo
          </Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Plugins" disabled>
          <Menu.Item id="manage">Manage plugins</Menu.Item>
        </Menubar.Menu>
        <Menubar.Menu label="Help">
          <Menu.Item id="about">About</Menu.Item>
        </Menubar.Menu>
      </Menubar>
    </div>
  );
}
