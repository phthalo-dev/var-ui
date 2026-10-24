import { Stack, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Stack gap="xs">
      <Text>Primary text is the default.</Text>
      <Text tone="secondary">Secondary text for supporting copy.</Text>
      <Text tone="danger">Danger text for errors and validation messages.</Text>
    </Stack>
  );
}
