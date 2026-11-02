import { Meter, Stack } from '@var-ui/react';

export default function Preview() {
  return (
    <Stack gap="md">
      <Meter label="Small" value={50} size="sm" />
      <Meter label="Medium" value={50} size="md" />
      <Meter label="Large" value={50} size="lg" tone="accent" />
    </Stack>
  );
}
