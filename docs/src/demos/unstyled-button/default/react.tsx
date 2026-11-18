import { useState } from 'react';
import { Icon, Stack, Text, UnstyledButton } from '@var-ui/react';

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="xs">
      <UnstyledButton aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? 'chevronDown' : 'chevronRight'} size="sm" />
        <Text as="span" size="sm" weight="medium">
          Build details
        </Text>
      </UnstyledButton>
      {open ? (
        <Text size="sm" tone="secondary">
          Ran 2,638 tests in 4m 12s.
        </Text>
      ) : null}
    </Stack>
  );
}
