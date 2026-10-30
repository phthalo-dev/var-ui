import { Button, Tooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button>Save</Button>
      </Tooltip.Trigger>
      <Tooltip.Popup>Save changes</Tooltip.Popup>
    </Tooltip>
  );
}
