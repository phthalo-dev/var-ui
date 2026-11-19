import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm" wrap>
      <Button disabled>Disabled</Button>
      <Button tone="accent" appearance="solid" disabled>
        Disabled primary
      </Button>
    </HStack>
  );
}
