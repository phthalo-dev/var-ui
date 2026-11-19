import { Center, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Center
      style={{ height: '7.5rem', border: '0.0625rem dashed var(--var-ui-color-border-default)' }}
    >
      <Text>Centered</Text>
    </Center>
  );
}
