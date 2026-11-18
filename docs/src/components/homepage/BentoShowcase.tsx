'use client';

import { combine, mergeProps } from '@var-ui/react';
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
      {...combine(b.showcase.className, theme.className)}
      data-testid="bento-showcase"
      ref={ref}
      style={{ ...previewStyle }}
    >
      <div {...mergeProps(b.grid)}>
        <RevenueTile {...combine(tile, b.spanWide.className)} />
        <KudosTile {...combine(tile, b.spanNarrow, b.tileWide)} />
        <AgentChatTile {...combine(tile, b.spanHalf.className, b.tileRowSpan2.className)} />
        <PreferencesTile {...combine(tile, b.spanHalf.className)} />
        <LaunchCalendarTile {...combine(tile, b.spanHalf.className)} />
        <MembersTile {...combine(tile, b.spanFull.className, b.tileWide.className)} />
      </div>
    </div>
  );
}
