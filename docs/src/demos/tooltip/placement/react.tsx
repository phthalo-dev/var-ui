import { Button, HStack, Tooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="md" wrap>
      <Tooltip openDelay={200}>
        <Tooltip.Trigger>
          <Button>Bottom · 200ms</Button>
        </Tooltip.Trigger>
        <Tooltip.Popup placement="bottom">Below the trigger</Tooltip.Popup>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger>
          <Button>End</Button>
        </Tooltip.Trigger>
        <Tooltip.Popup placement="end">After the trigger</Tooltip.Popup>
      </Tooltip>
    </HStack>
  );
}
