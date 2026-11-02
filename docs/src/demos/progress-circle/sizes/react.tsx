import { HStack, ProgressCircle } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="md" align="center">
      <ProgressCircle label="Small" value={40} size="sm" />
      <ProgressCircle label="Medium" value={40} size="md" />
      <ProgressCircle label="Large" value={40} size="lg" />
    </HStack>
  );
}
