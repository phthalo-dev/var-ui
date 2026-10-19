import { Button, Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button>Song</Button>
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.Item id="lib" onAction={() => {}}>
          Add to Library
        </Menu.Item>
        <Menu.Separator />
        <Menu.Section title="Danger">
          <Menu.Item id="delete" onAction={() => {}}>
            Delete
          </Menu.Item>
        </Menu.Section>
      </Menu.Popup>
    </Menu>
  );
}
