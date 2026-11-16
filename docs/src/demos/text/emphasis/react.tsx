import { Stack, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Stack gap="sm">
      <Text eyebrow size="xs" tone="secondary">
        Steps
      </Text>
      <Text size="xl" weight="bold">
        128.4k
      </Text>
      <Text weight="semibold">Semibold emphasis</Text>
      <Text weight="bold">Bold emphasis</Text>
    </Stack>
  );
}
