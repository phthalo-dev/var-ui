import { Button, Drawer } from '@var-ui/react';

export default function Preview() {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Popup aria-label="Settings">
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <p>Drawer body content.</p>
        </Drawer.Body>
      </Drawer.Popup>
    </Drawer>
  );
}
