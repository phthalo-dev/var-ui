'use client';

import type { DocsFramework } from '@var-ui/docs-components/framework';
import { cx } from '@var-ui/react';
import { useState, type CSSProperties } from 'react';
import { homeBento } from '@/styles/homeBento';
import {
  renderBannerTileMarkup,
  renderCarouselStripTileMarkup,
  renderContentSampleTileMarkup,
  renderEmptyStateDialogTileMarkup,
  renderIdentityCardsTileMarkup,
  renderLayoutTabsTileMarkup,
  renderQuickActionsTileMarkup,
  renderSettingsFormTileMarkup,
  renderStatusFeedbackTileMarkup,
} from './bentoMarkup';
import { BannerTile } from './bentoTiles/BannerTile';
import { CarouselStripTile } from './bentoTiles/CarouselStripTile';
import { ContentSampleTile } from './bentoTiles/ContentSampleTile';
import { EmptyStateDialogTile } from './bentoTiles/EmptyStateDialogTile';
import { IdentityCardsTile } from './bentoTiles/IdentityCardsTile';
import { LayoutTabsTile } from './bentoTiles/LayoutTabsTile';
import { QuickActionsTile } from './bentoTiles/QuickActionsTile';
import { SettingsFormTile } from './bentoTiles/SettingsFormTile';
import { StatusFeedbackTile } from './bentoTiles/StatusFeedbackTile';
import { MarkupTile } from './MarkupTile';
import { docsThemePresets, type ShowcaseThemeId } from '@/themes/presets';

export type BentoShowcaseProps = {
  themeId: ShowcaseThemeId;
  framework?: DocsFramework;
  previewStyle?: CSSProperties;
};

export function BentoShowcase({ themeId, framework = 'react', previewStyle }: BentoShowcaseProps) {
  const b = homeBento();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const theme = docsThemePresets.find((entry) => entry.id === themeId) ?? docsThemePresets[0];
  const useReactTiles = framework === 'react';

  return (
    <div
      className={cx(b.showcase.className, theme.className)}
      data-framework={framework}
      data-testid="bento-showcase"
      ref={setPortalContainer}
      style={{ colorScheme: 'inherit', ...previewStyle }}
    >
      <div className={b.grid.className}>
        {useReactTiles ? (
          <QuickActionsTile
            className={cx(b.tile.className, b.tileSpan2.className, b.tileRowSpan2.className)}
            portalContainer={portalContainer ?? undefined}
          />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileSpan2.className, b.tileRowSpan2.className)}
            html={renderQuickActionsTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <StatusFeedbackTile className={b.tile.className} />
        ) : (
          <MarkupTile className={b.tile.className} html={renderStatusFeedbackTileMarkup()} />
        )}
        {useReactTiles ? (
          <SettingsFormTile className={cx(b.tile.className, b.tileRowSpan2.className)} />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileRowSpan2.className)}
            html={renderSettingsFormTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <EmptyStateDialogTile className={b.tile.className} />
        ) : (
          <MarkupTile className={b.tile.className} html={renderEmptyStateDialogTileMarkup()} />
        )}
        {useReactTiles ? (
          <ContentSampleTile
            className={cx(b.tile.className, b.tileSpan2.className)}
            framework={framework}
          />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileSpan2.className)}
            html={renderContentSampleTileMarkup(framework)}
          />
        )}
        {useReactTiles ? (
          <IdentityCardsTile className={b.tile.className} />
        ) : (
          <MarkupTile className={b.tile.className} html={renderIdentityCardsTileMarkup()} />
        )}
        {useReactTiles ? (
          <CarouselStripTile className={cx(b.tile.className, b.tileSpan2.className)} />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileSpan2.className)}
            html={renderCarouselStripTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <LayoutTabsTile className={cx(b.tile.className, b.tileSpan2.className)} />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileSpan2.className)}
            html={renderLayoutTabsTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <BannerTile className={cx(b.tile.className, b.tileSpanFull.className)} />
        ) : (
          <MarkupTile
            className={cx(b.tile.className, b.tileSpanFull.className)}
            html={renderBannerTileMarkup()}
          />
        )}
      </div>
    </div>
  );
}
