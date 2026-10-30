'use client';

import { Button, Dialog, EmptyState, Icon } from '@var-ui/react';

export type EmptyStateDialogTileProps = {
  className?: string;
};

export function EmptyStateDialogTile({ className }: EmptyStateDialogTileProps) {
  return (
    <div className={className}>
      <EmptyState
        action={
          <Dialog>
            <Dialog.Trigger>
              <Button>New project</Button>
            </Dialog.Trigger>
            <Dialog.Popup>
              <Dialog.Header>
                <Dialog.Title>Create a project</Dialog.Title>
                <Dialog.Close aria-label="Close" />
              </Dialog.Header>
              <Dialog.Description>
                Give your project a name. You can rename it later.
              </Dialog.Description>
              <Dialog.Actions>
                <Dialog.Close>
                  <Button>Close</Button>
                </Dialog.Close>
              </Dialog.Actions>
            </Dialog.Popup>
          </Dialog>
        }
        description="Create your first project to get started."
        icon={<Icon name="search" size="lg" />}
        title="No projects yet"
      />
    </div>
  );
}
