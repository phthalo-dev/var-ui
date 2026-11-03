import { useRef } from 'react';
import { Portal, Stack, Text } from '@var-ui/react';

export default function Preview() {
  const hostRef = useRef<HTMLDivElement>(null);
  return (
    <Stack gap="sm">
      <Portal container={hostRef}>
        <Text>Rendered into the box below</Text>
      </Portal>
      <div ref={hostRef} style={{ border: '1px dashed currentColor', padding: 8 }} />
    </Stack>
  );
}
