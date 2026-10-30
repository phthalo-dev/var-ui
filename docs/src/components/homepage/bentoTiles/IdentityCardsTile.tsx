'use client';

import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  ClickableCard,
  HStack,
  Thumbnail,
  Stack,
} from '@var-ui/react';

const PREVIEW_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

export type IdentityCardsTileProps = {
  className?: string;
};

export function IdentityCardsTile({ className }: IdentityCardsTileProps) {
  return (
    <div className={className}>
      <Stack gap="md">
        <Card title="Design team">
          <HStack align="center" gap="sm" justify="between">
            <AvatarGroup max={3}>
              <Avatar name="Ada Lovelace" />
              <Avatar name="Grace Hopper" />
              <Avatar name="Alan Turing" />
              <Avatar name="Edsger Dijkstra" />
            </AvatarGroup>
            <Badge tone="accent">4 members</Badge>
          </HStack>
        </Card>
        <HStack gap="sm">
          <Thumbnail alt="Cover preview" src={PREVIEW_URL} />
          <Thumbnail alt="Icon preview" src={PREVIEW_URL} />
        </HStack>
        <ClickableCard
          description="Browse every asset in the workspace."
          hint="24 files"
          href="#"
          title="All files"
        />
      </Stack>
    </div>
  );
}
