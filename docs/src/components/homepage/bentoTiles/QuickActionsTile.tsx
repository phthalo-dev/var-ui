'use client';

import { Button, Heading, HStack, Select, TextField, VStack } from '@var-ui/react';

const ROLE_OPTIONS = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'admin', label: 'Admin' },
];

export type QuickActionsTileProps = {
  className?: string;
  portalContainer?: Element;
};

export function QuickActionsTile({ className, portalContainer }: QuickActionsTileProps) {
  return (
    <div className={className}>
      <VStack gap="md">
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
      </VStack>
    </div>
  );
}
