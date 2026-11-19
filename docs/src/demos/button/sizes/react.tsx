import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm" align="center" wrap>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </HStack>
  );
}
