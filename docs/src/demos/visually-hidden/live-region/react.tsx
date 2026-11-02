import { useState } from 'react';
import { Button, Stack, VisuallyHidden } from '@var-ui/react';

export default function Preview() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="sm" align="start">
      <Button onClick={() => setSaved(true)}>Save</Button>
      <VisuallyHidden role="status">{saved ? 'Changes saved' : ''}</VisuallyHidden>
    </Stack>
  );
}
