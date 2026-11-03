import { useState } from 'react';
import { Button, Portal, Stack, Text } from '@var-ui/react';

export default function Preview() {
  const [shown, setShown] = useState(false);
  return (
    <Stack gap="sm" align="start">
      <Button onClick={() => setShown((s) => !s)}>{shown ? 'Remove' : 'Render in body'}</Button>
      {shown ? (
        <Portal>
          <Text style={{ position: 'fixed', insetBlockEnd: 16, insetInlineStart: 16 }}>
            I live in document.body
          </Text>
        </Portal>
      ) : null}
    </Stack>
  );
}
