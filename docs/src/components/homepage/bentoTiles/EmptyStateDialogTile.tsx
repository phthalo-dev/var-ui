'use client';

import { Button, Dialog, EmptyState, Icon } from '@var-ui/react';

export type EmptyStateDialogTileProps = {
  className?: string;
  portalContainer?: Element;
};

export function EmptyStateDialogTile({ className, portalContainer }: EmptyStateDialogTileProps) {
  return (
    <div className={className}>
      <EmptyState
        action={
          <Dialog portalContainer={portalContainer}>
            <Dialog.Trigger>
              <Button>New project</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop>
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
            </Dialog.Backdrop>
          </Dialog>
        }
        description="Create your first project to get started."
        icon={<Icon name="search" size="lg" />}
        title="No projects yet"
      />
    </div>
  );
}
