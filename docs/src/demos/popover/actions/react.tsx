import { Button, HStack, SimplePopover } from '@var-ui/react';

export default function Preview() {
  return (
    <SimplePopover trigger={<Button>Share</Button>} title="Share link">
      <p>Anyone with the link can view this draft.</p>
      <HStack gap="sm" style={{ marginTop: 12 }}>
        <Button tone="accent" appearance="filled" size="sm">
          Copy link
        </Button>
        <Button tone="accent" appearance="ghost" size="sm">
          Cancel
        </Button>
      </HStack>
    </SimplePopover>
  );
}
