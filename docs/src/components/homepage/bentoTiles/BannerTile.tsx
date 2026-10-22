'use client';

import { Banner, Button } from '@var-ui/react';

export type BannerTileProps = {
  className?: string;
};

export function BannerTile({ className }: BannerTileProps) {
  return (
    <div className={className}>
      <Banner
        actions={
          <Button tone="accent" appearance="filled">
            Upgrade plan
          </Button>
        }
        appearance="solid"
        title="You're on the Free plan"
        tone="info"
      >
        Upgrade for unlimited projects and priority support.
      </Banner>
    </div>
  );
}
