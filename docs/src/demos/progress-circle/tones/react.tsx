import { HStack, ProgressCircle } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="md" align="center">
      <ProgressCircle label="Accent" value={60} />
      <ProgressCircle label="Success" value={60} tone="success" />
      <ProgressCircle label="Warning" value={60} tone="warning" />
      <ProgressCircle label="Danger" value={60} tone="danger" />
      <ProgressCircle label="Neutral" value={60} tone="neutral" appearance="subtle" />
    </HStack>
  );
}
