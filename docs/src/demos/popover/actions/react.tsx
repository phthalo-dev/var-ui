import { Button, HStack, Popover } from '@var-ui/react';

export default function Preview() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button>Share</Button>
      </Popover.Trigger>
      <Popover.Popup>
        <Popover.Title>Share link</Popover.Title>
        <Popover.Content>
          <p>Anyone with the link can view this draft.</p>
          <HStack gap="sm" style={{ marginTop: 12 }}>
            <Button tone="accent" appearance="filled" size="sm">
              Copy link
            </Button>
            <Button tone="accent" appearance="ghost" size="sm">
              Cancel
            </Button>
          </HStack>
        </Popover.Content>
      </Popover.Popup>
    </Popover>
  );
}
