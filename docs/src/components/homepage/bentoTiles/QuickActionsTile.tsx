'use client';

import { Button, Heading, HStack, Select, TextField, Stack } from '@var-ui/react';

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

export type QuickActionsTileProps = {
  className?: string;
  portalContainer?: Element;
};

export function QuickActionsTile({ className, portalContainer }: QuickActionsTileProps) {
  return (
    <div className={className}>
      <Stack gap="md">
        <Heading level={3} size="sm">
          Invite a teammate
        </Heading>
        <TextField label="Email" placeholder="ada@example.com" />
        <Select label="Role" options={ROLE_OPTIONS} portalContainer={portalContainer} />
        <HStack gap="sm" wrap>
          <Button tone="accent" appearance="filled">
            Send invite
          </Button>
          <Button>Cancel</Button>
          <Button tone="accent" appearance="ghost">
            Learn more
          </Button>
        </HStack>
      </Stack>
    </div>
  );
}
