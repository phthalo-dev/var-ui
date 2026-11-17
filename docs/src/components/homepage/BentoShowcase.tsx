'use client';

import { cx } from '@var-ui/react';
import type { CSSProperties, Ref } from 'react';
import { homeBento } from '@/styles/homeBento';
import { docsThemePresetMeta as docsThemePresets } from '@/themes/presetMeta';
import type { ShowcaseThemeId } from '@/themes/presets';
import {
  AgentChatTile,
  KudosTile,
  LaunchCalendarTile,
  MembersTile,
  PreferencesTile,
  RevenueTile,
} from './showcaseTiles';

export type BentoShowcaseProps = {
  themeId: ShowcaseThemeId;
  previewStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** Live `@var-ui/react` product UI, repainted by the selected showcase theme. */
export function BentoShowcase({ themeId, previewStyle, ref }: BentoShowcaseProps) {
  const b = homeBento();
  const theme = docsThemePresets.find((entry) => entry.id === themeId) ?? docsThemePresets[0];
  const tile = b.tile.className;

  return (
    <div
      className={cx(b.showcase.className, theme.className)}
      data-testid="bento-showcase"
      ref={ref}
      style={{ colorScheme: 'inherit', ...previewStyle }}
    >
      <div className={b.grid.className}>
        <RevenueTile className={cx(tile, b.spanWide.className)} />
        <KudosTile className={cx(tile, b.spanNarrow.className, b.tileWide.className)} />
        <AgentChatTile className={cx(tile, b.spanHalf.className, b.tileRowSpan2.className)} />
        <PreferencesTile className={cx(tile, b.spanHalf.className)} />
        <LaunchCalendarTile className={cx(tile, b.spanHalf.className)} />
        <MembersTile className={cx(tile, b.spanFull.className, b.tileWide.className)} />
      </div>
    </div>
  );
}
