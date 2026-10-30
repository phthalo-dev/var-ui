'use client';

import { Alert, Badge, Divider, HStack, ProgressBar, Spinner, VStack } from '@var-ui/react';

export type StatusFeedbackTileProps = {
  className?: string;
};

export function StatusFeedbackTile({ className }: StatusFeedbackTileProps) {
  return (
    <div className={className}>
      <VStack gap="md">
        <Alert title="Deploy queued" tone="info">
          Waiting for the previous build to finish.
        </Alert>
        <HStack gap="sm" wrap>
          <Badge tone="accent">Beta</Badge>
          <Badge tone="success">Stable</Badge>
        </HStack>
        <ProgressBar label="Build progress" value={72} />
        <Divider />
        <HStack align="center" gap="sm">
          <Spinner label="Syncing" size="sm" />
        </HStack>
      </VStack>
    </div>
  );
}
