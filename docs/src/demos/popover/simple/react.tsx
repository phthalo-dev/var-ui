import { Button, Popover } from '@var-ui/react';

export default function Preview() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button>Open</Button>
      </Popover.Trigger>
      <Popover.Popup>
        <Popover.Title>Details</Popover.Title>
        <Popover.Content>
          <p>Popover body content.</p>
        </Popover.Content>
      </Popover.Popup>
    </Popover>
  );
}
