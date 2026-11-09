import { Button, Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button>File</Button>
      </Menu.Trigger>
      <Menu.Popup aria-label="File">
        <Menu.Item id="new">New</Menu.Item>
        <Menu.Submenu label="Share" icon="copy">
          <Menu.Item id="link">Copy link</Menu.Item>
          <Menu.Item id="email">Email</Menu.Item>
          <Menu.Separator />
          <Menu.Submenu label="Export as">
            <Menu.Item id="pdf">PDF</Menu.Item>
            <Menu.Item id="png">PNG</Menu.Item>
          </Menu.Submenu>
        </Menu.Submenu>
        <Menu.Submenu label="Archive" disabled>
          <Menu.Item id="zip">Zip</Menu.Item>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Item id="quit">Quit</Menu.Item>
      </Menu.Popup>
    </Menu>
  );
}
